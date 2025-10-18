/**
 * Model Availability Test
 *
 * Tests which Claude model IDs are currently available in the Anthropic API.
 * This helps verify model names before using them in production code.
 */

import Anthropic from '@anthropic-ai/sdk'

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

async function testModelAvailability(apiKey: string): Promise<ModelTestResult[]> {
  const results: ModelTestResult[] = []

  console.log('Testing model availability...\n')
  console.log('=' .repeat(80))

  for (const modelId of MODEL_IDS_TO_TEST) {
    console.log(`\nTesting: ${modelId}`)

    const anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        "anthropic-dangerous-direct-browser-access": "true"
      }
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

      console.log(`  ✅ AVAILABLE`)
      console.log(`  Response time: ${responseTime}ms`)
      console.log(`  Response ID: ${response.id}`)
      console.log(`  Usage: ${JSON.stringify(response.usage)}`)

      results.push({
        modelId,
        available: true,
        responseTime
      })

    } catch (error: any) {
      const responseTime = Date.now() - startTime

      console.log(`  ❌ NOT AVAILABLE`)
      console.log(`  Error type: ${error?.error?.type || error?.constructor?.name || 'Unknown'}`)
      console.log(`  Error message: ${error?.error?.message || error?.message || 'Unknown error'}`)
      console.log(`  Status: ${error?.status || 'N/A'}`)

      results.push({
        modelId,
        available: false,
        errorType: error?.error?.type || error?.constructor?.name || 'Unknown',
        errorMessage: error?.error?.message || error?.message || 'Unknown error',
        responseTime
      })
    }
  }

  console.log('\n' + '=' .repeat(80))
  console.log('\nSummary:')
  console.log('=' .repeat(80))

  const available = results.filter(r => r.available)
  const unavailable = results.filter(r => !r.available)

  console.log(`\n✅ Available models (${available.length}):`)
  available.forEach(r => {
    console.log(`  - ${r.modelId} (${r.responseTime}ms)`)
  })

  console.log(`\n❌ Unavailable models (${unavailable.length}):`)
  unavailable.forEach(r => {
    console.log(`  - ${r.modelId}`)
    console.log(`    Error: ${r.errorType} - ${r.errorMessage}`)
  })

  console.log('\n' + '=' .repeat(80))

  return results
}

// Main execution
async function main() {
  // Load environment variables from .env.local
  const dotenv = await import('dotenv')
  const path = await import('path')

  dotenv.config({ path: path.join(process.cwd(), '.env.local') })

  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY not found in environment')
    console.error('Please set NEXT_PUBLIC_ANTHROPIC_API_KEY or ANTHROPIC_API_KEY in .env.local')
    console.error('\nCurrent environment variables:')
    console.error('  NEXT_PUBLIC_ANTHROPIC_API_KEY:', process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? 'Set' : 'Not set')
    console.error('  ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set')
    process.exit(1)
  }

  console.log('API Key found:', apiKey.substring(0, 15) + '...')
  console.log(`Testing ${MODEL_IDS_TO_TEST.length} model IDs\n`)

  try {
    const results = await testModelAvailability(apiKey)

    // Exit with error if no models are available
    if (results.filter(r => r.available).length === 0) {
      console.error('\n❌ No models are available - check your API key and permissions')
      process.exit(1)
    }

    console.log('\n✅ Test completed successfully')

  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { testModelAvailability, MODEL_IDS_TO_TEST }
