---
description: Generate comprehensive static code analysis metrics report
---

# Metrics Analysis Command

You are a code metrics analyst. Your task is to perform comprehensive static code analysis on the Moments project and generate a detailed metrics report.

## Analysis Scope

Analyze the following aspects of the codebase:

### 1. Code Volume Metrics
- **Total Lines of Code (LOC)**: Count all lines in source files
- **Source Lines of Code (SLOC)**: Exclude blank lines and comments
- **Lines by Language**: Break down by TypeScript, JavaScript, JSON, Markdown, CSS
- **Lines by Directory**: src/, tests/, components/, lib/, app/, etc.

### 2. File and Module Metrics
- **Total Files**: Count by type (.ts, .tsx, .js, .jsx, .json, .md, .css)
- **Average File Size**: Mean lines per file
- **Largest Files**: Top 10 files by line count
- **Module Distribution**: Components vs utilities vs API routes vs types

### 3. Test Coverage Metrics
- **Test Files**: Count of test files (*.test.ts, *.spec.ts)
- **Test Lines**: Total lines in test files
- **Test-to-Code Ratio**: Test LOC / Source LOC
- **Tested Modules**: Files with corresponding test files
- **Coverage Gaps**: Source files without tests

### 4. Code Quality Metrics
- **Comment Density**: Comment lines / Total lines
- **Documentation**: JSDoc comments, inline comments, README files
- **Type Safety**: TypeScript files vs JavaScript files
- **Function Complexity**: Average function length (lines per function)
- **Import Analysis**: External dependencies vs internal imports

### 5. Architecture Metrics
- **Component Count**: React components (.tsx files)
- **Hook Count**: Custom hooks (use-*.ts files)
- **API Routes**: Number of API endpoints
- **Type Definitions**: Interface and type declarations
- **Utility Functions**: Shared utilities and helpers

### 6. Dependency Analysis
- **Package Dependencies**: Count from package.json
- **Dev Dependencies**: Development-only packages
- **Dependency Tree Depth**: Analyze node_modules structure
- **Unused Dependencies**: Potential optimization candidates

### 7. Content Analysis (Moments-specific)
- **Moments Count**: Number of extracted moments (moments/ folder)
- **Companies Tracked**: Unique companies in analysis
- **Technologies Tracked**: Unique technologies
- **Specifications**: Documentation in specs/ folder
- **Backlog Items**: Feature requests and TODOs

## Implementation Steps

### Step 1: Setup Metrics Directory
```bash
mkdir -p metrics
```

### Step 2: Count Lines of Code
Use tools like `cloc` or custom bash scripts:
```bash
# Install cloc if needed
# brew install cloc (macOS)
# sudo apt-get install cloc (Linux)

# Run analysis
cloc src/ --json > /tmp/cloc-src.json
cloc tests/ --json > /tmp/cloc-tests.json
cloc . --exclude-dir=node_modules,.next,build,dist --json > /tmp/cloc-total.json
```

### Step 3: Analyze File Structure
```bash
# Count files by type
find src -type f -name "*.ts" | wc -l
find src -type f -name "*.tsx" | wc -l
find src -type f -name "*.css" | wc -l

# Analyze directory structure
tree -L 3 src/ > /tmp/src-structure.txt
```

### Step 4: Test Coverage Analysis
```bash
# Find test files
find . -name "*.test.ts" -o -name "*.spec.ts" | wc -l

# Analyze test coverage (if jest is configured)
npm run test -- --coverage --json > /tmp/coverage.json 2>/dev/null || true
```

### Step 5: Code Quality Metrics
```bash
# Count comments
grep -r "^[[:space:]]*\/\/" src/ | wc -l
grep -r "^[[:space:]]*\/\*" src/ | wc -l

# Count TypeScript vs JavaScript
find src -name "*.ts" -o -name "*.tsx" | wc -l
find src -name "*.js" -o -name "*.jsx" | wc -l
```

### Step 6: Dependency Analysis
```bash
# Count dependencies
cat package.json | jq '.dependencies | length'
cat package.json | jq '.devDependencies | length'

# List all dependencies
cat package.json | jq -r '.dependencies | keys[]' | sort
```

### Step 7: Moments Content Analysis
```bash
# Count moments
find moments/ -name "*.md" | wc -l

# Count companies (from catalog)
# Count technologies
# Count specifications
find specs/ -name "*.md" | wc -l
```

## Report Generation

Create a comprehensive markdown report at `metrics/report-{timestamp}.md` with the following structure:

```markdown
# Moments Project - Code Metrics Report

**Generated:** {timestamp}
**Branch:** {git branch}
**Commit:** {git commit hash}

## Executive Summary

- **Total Lines of Code:** {number}
- **Source Files:** {number}
- **Test Coverage:** {percentage}%
- **Comment Density:** {percentage}%
- **TypeScript Adoption:** {percentage}%

## 1. Code Volume Metrics

### Lines of Code by Language
| Language   | Files | Blank | Comment | Code  | Total  |
|------------|-------|-------|---------|-------|--------|
| TypeScript | ...   | ...   | ...     | ...   | ...    |
| JavaScript | ...   | ...   | ...     | ...   | ...    |
| CSS        | ...   | ...   | ...     | ...   | ...    |
| Markdown   | ...   | ...   | ...     | ...   | ...    |
| JSON       | ...   | ...   | ...     | ...   | ...    |

### Lines of Code by Directory
| Directory      | Files | Lines | Percentage |
|----------------|-------|-------|------------|
| src/app        | ...   | ...   | ...%       |
| src/components | ...   | ...   | ...%       |
| src/lib        | ...   | ...   | ...%       |
| src/types      | ...   | ...   | ...%       |
| tests/         | ...   | ...   | ...%       |

## 2. File and Module Metrics

- **Total Files:** {number}
- **Average File Size:** {number} lines
- **Median File Size:** {number} lines

### Largest Files (Top 10)
| File | Lines | Type |
|------|-------|------|
| ...  | ...   | ...  |

### File Distribution by Type
| Extension | Count | Percentage |
|-----------|-------|------------|
| .tsx      | ...   | ...%       |
| .ts       | ...   | ...%       |
| .json     | ...   | ...%       |
| .md       | ...   | ...%       |

## 3. Test Coverage Metrics

- **Test Files:** {number}
- **Test Lines:** {number}
- **Test-to-Code Ratio:** {ratio}
- **Tested Modules:** {number}/{total} ({percentage}%)

### Coverage Gaps
{List of untested files or modules}

## 4. Code Quality Metrics

- **Comment Lines:** {number}
- **Comment Density:** {percentage}%
- **JSDoc Coverage:** {percentage}%
- **TypeScript Files:** {number}
- **JavaScript Files:** {number}
- **Type Safety:** {percentage}% TypeScript adoption

### Code Complexity
- **Average Function Length:** {number} lines
- **Longest Function:** {number} lines in {file}
- **Component Average Size:** {number} lines

## 5. Architecture Metrics

### React Components
- **Total Components:** {number}
- **Page Components:** {number}
- **UI Components:** {number}
- **Custom Hooks:** {number}

### API Architecture
- **API Routes:** {number}
- **Dynamic Routes:** {number}
- **Static Routes:** {number}

### Type System
- **Type Definitions:** {number}
- **Interfaces:** {number}
- **Enums:** {number}

## 6. Dependency Analysis

### Package Dependencies
- **Production Dependencies:** {number}
- **Development Dependencies:** {number}
- **Total Dependencies:** {number}

### Key Dependencies
{List top 10 most important dependencies}

### Dependency Health
- **Outdated Packages:** {number}
- **Security Vulnerabilities:** {number}
- **License Compliance:** ✅/❌

## 7. Content Analysis (Moments-specific)

### AI Business Intelligence Content
- **Extracted Moments:** {number}
- **Companies Tracked:** {number}
- **Technologies Tracked:** {number}
- **Specification Documents:** {number}
- **Backlog Items:** {number}

### Moment Distribution
| Category | Count | Percentage |
|----------|-------|------------|
| Company  | ...   | ...%       |
| Technology | ... | ...%       |
| Macro Factor | ... | ...%     |

## 8. Historical Trends

### Growth Metrics
{If previous reports exist, show trends}

- **LOC Growth:** +{number} lines since last report
- **Test Coverage Change:** +/-{percentage}%
- **New Dependencies:** +{number}

## 9. Recommendations

Based on the analysis:

1. **Code Quality:**
   - [ ] Increase test coverage to 80%+ (currently {current}%)
   - [ ] Add JSDoc comments to public APIs
   - [ ] Refactor files over 500 lines

2. **Architecture:**
   - [ ] Extract repeated logic into utilities
   - [ ] Consider splitting large components
   - [ ] Improve type definitions

3. **Dependencies:**
   - [ ] Update outdated packages
   - [ ] Remove unused dependencies
   - [ ] Audit security vulnerabilities

4. **Documentation:**
   - [ ] Add README files to major directories
   - [ ] Document API routes
   - [ ] Create component usage examples

## 10. Appendices

### A. Detailed File Listing
{Full file tree with line counts}

### B. Dependency Tree
{Complete dependency graph}

### C. Analysis Tools Used
- cloc v{version}
- npm v{version}
- TypeScript v{version}
- Custom analysis scripts

---

**Report Hash:** {sha256 of report content}
**Analysis Duration:** {seconds}s
```

## Execution Instructions

1. **Install Required Tools:**
   ```bash
   # Install cloc for line counting
   npm install -g cloc

   # Ensure jq is available for JSON parsing
   # macOS: brew install jq
   # Linux: sudo apt-get install jq
   ```

2. **Run Analysis:**
   - Execute all bash commands to collect metrics
   - Parse JSON outputs
   - Calculate derived metrics
   - Generate markdown report

3. **Save Report:**
   - Create timestamp: `date +%Y-%m-%d-%H%M%S`
   - Save to: `metrics/report-{timestamp}.md`
   - Update `metrics/latest.md` symlink

4. **Generate Summary:**
   - Create executive summary
   - Highlight key findings
   - Provide actionable recommendations

5. **Commit Results:**
   - Add metrics report to git
   - Update project documentation
   - Create summary comment

## Success Criteria

The report should include:
- ✅ All 10 sections completed
- ✅ Accurate line counts
- ✅ File statistics
- ✅ Test coverage analysis
- ✅ Dependency breakdown
- ✅ Actionable recommendations
- ✅ Professional formatting
- ✅ Timestamp and metadata

## Notes

- Run this command periodically (weekly/monthly) to track progress
- Compare reports over time to see trends
- Use metrics to guide refactoring decisions
- Share reports with team for visibility
- Archive old reports for historical reference

**IMPORTANT:** Think harder about the metrics that matter most for the Moments project:
- AI content extraction quality
- Processing efficiency
- Code maintainability
- Test reliability
- Documentation completeness
