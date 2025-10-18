/**
 * API Route: Test Model Availability
 *
 * Tests which Claude model IDs are available in the Anthropic API.
 * Access via: /api/test-models
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'

// Model IDs to test
const MODEL_IDS_TO_TEST = [
  // Claude 4.5 Models
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-5-20250929',

  // Claude 4.1 Models
  'claude-opus-4-1-20250805',

  // Claude 3.5 Models (known working)
  'claude-3-5-haiku-20241022',
  'claude-3-5-sonnet-20241022',

  // Alternative naming patterns
  'claude-4-5-haiku-20251001',
  'claude-4-5-sonnet-20250929',
  'claude-4-1-opus-20250805',
]

interface ModelTestResult {
  modelId: string
  available: boolean
  errorType?: string
  errorMessage?: string
  responseTime?: number
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      error: 'ANTHROPIC_API_KEY not configured',
      message: 'Please set NEXT_PUBLIC_ANTHROPIC_API_KEY in .env.local'
    }, { status: 500 })
  }

  console.log('[Model Test] Starting model availability test...')
  console.log('[Model Test] API Key prefix:', apiKey.substring(0, 15) + '...')
  console.log('[Model Test] Testing', MODEL_IDS_TO_TEST.length, 'model IDs')

  const results: ModelTestResult[] = []

  for (const modelId of MODEL_IDS_TO_TEST) {
    console.log(`[Model Test] Testing: ${modelId}`)

    const anthropic = new Anthropic({
      apiKey,
    })

    const startTime = Date.now()

    try {
      const response = await anthropic.messages.create({
        model: modelId,
        max_tokens: 10,
        messages: [{
          role: 'user',
          content: 'Hi'
        }]
      })

      const responseTime = Date.now() - startTime

      console.log(`[Model Test] ✅ ${modelId} AVAILABLE (${responseTime}ms)`)
      console.log(`[Model Test]   Response ID: ${response.id}`)
      console.log(`[Model Test]   Usage:`, response.usage)

      results.push({
        modelId,
        available: true,
        responseTime
      })

    } catch (error: any) {
      const responseTime = Date.now() - startTime

      console.log(`[Model Test] ❌ ${modelId} NOT AVAILABLE`)
      console.log(`[Model Test]   Error type: ${error?.error?.type || error?.constructor?.name}`)
      console.log(`[Model Test]   Error message: ${error?.error?.message || error?.message}`)
      console.log(`[Model Test]   Status: ${error?.status}`)

      results.push({
        modelId,
        available: false,
        errorType: error?.error?.type || error?.constructor?.name || 'Unknown',
        errorMessage: error?.error?.message || error?.message || 'Unknown error',
        responseTime
      })
    }
  }

  const available = results.filter(r => r.available)
  const unavailable = results.filter(r => !r.available)

  console.log(`[Model Test] Summary: ${available.length} available, ${unavailable.length} unavailable`)

  return NextResponse.json({
    summary: {
      total: results.length,
      available: available.length,
      unavailable: unavailable.length,
    },
    availableModels: available.map(r => ({
      modelId: r.modelId,
      responseTime: r.responseTime
    })),
    unavailableModels: unavailable.map(r => ({
      modelId: r.modelId,
      errorType: r.errorType,
      errorMessage: r.errorMessage
    })),
    allResults: results
  })
}
