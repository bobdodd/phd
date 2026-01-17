# Understanding Analysis Modes in Paradise

**Audience**: VS Code extension users

**Last Updated**: January 17, 2026

---

## Table of Contents

1. [Introduction](#introduction)
2. [The Three Analysis Modes](#the-three-analysis-modes)
3. [File Mode](#file-mode)
4. [Smart Mode (Recommended)](#smart-mode-recommended)
5. [Project Mode](#project-mode)
6. [Configuration Guide](#configuration-guide)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting](#troubleshooting)
9. [FAQs](#faqs)

---

## Introduction

Paradise can analyze your code in three different modes, each with different trade-offs between accuracy and performance. Understanding these modes helps you configure Paradise for optimal results.

**Quick Summary**:

| Mode | Speed | Accuracy | False Positives | Best For |
|------|-------|----------|-----------------|----------|
| **File** | ⚡ Instant | Medium | Possible | Quick checks, single files |
| **Smart** | ⚡ Instant | High | Minimal | Most projects (recommended) |
| **Project** | 🐢 Slower | Highest | Zero | Multi-page apps, accuracy critical |

---

## The Three Analysis Modes

### Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FILE MODE                            │
│  Analyzes: Current file only                                │
│  Speed: <100ms instant                                       │
│  Accuracy: Medium (can't see other files)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       SMART MODE ⭐                          │
│  Analyzes: Current file + related HTML pages                │
│  Speed: <100ms instant (background builds full context)     │
│  Accuracy: High (progressive enhancement)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      PROJECT MODE                           │
│  Analyzes: Entire workspace (all HTML + JS + CSS)           │
│  Speed: 100ms - 2000ms depending on project size            │
│  Accuracy: Highest (complete context)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## File Mode

### What It Does

Analyzes **only the currently open file** without looking at other files in your project.

### When to Use

- ✅ Quick syntax checks
- ✅ Working on standalone JavaScript utilities
- ✅ Performance-critical environments
- ✅ Very large projects (10,000+ files)

### Limitations

**False Positives Example**:

```javascript
// handlers.js
document.getElementById('submit').addEventListener('click', handleSubmit);
```

```javascript
// keyboard.js (separate file)
document.getElementById('submit').addEventListener('keydown', handleKeyboard);
```

```html
<!-- index.html -->
<button id="submit">Submit</button>
```

**File Mode Result**: ⚠️ "Missing keyboard handler" (false positive)

**Why**: File mode only sees `handlers.js` and doesn't know `keyboard.js` exists.

### Configuration

```json
{
  "paradise.analysisMode": "file"
}
```

---

## Smart Mode (Recommended)

### What It Does

Uses a **dual-phase approach**:

1. **Instant Analysis**: Analyzes current file immediately (<100ms)
2. **Background Enhancement**: Discovers related HTML pages and builds complete context
3. **Progressive Update**: Re-analyzes with full context once background work completes

### How It Works

```
Open JavaScript File
        ↓
  [Instant Analysis]
   File-scope check
   Results in <100ms
        ↓
   [Background Work]
    Find HTML pages
    Link related JS/CSS
    Build DocumentModel
        ↓
  [Progressive Update]
   Re-analyze with full context
   Zero false positives!
```

### When to Use

- ✅ **Most projects** (this is the default)
- ✅ Multi-page web applications
- ✅ Projects with separate HTML/JS/CSS files
- ✅ When you want accuracy without sacrificing speed

### Benefits

- **Instant feedback**: See issues immediately as you type
- **High accuracy**: Background process eliminates false positives
- **Non-blocking**: Doesn't interrupt your workflow
- **Progressive**: Gets more accurate as analysis completes

### Example Workflow

1. Open `handlers.js`
   - **Instant**: Paradise shows potential issues (MEDIUM confidence)

2. Background discovers `index.html`, `keyboard.js`, `styles.css`
   - **Progress**: Status bar shows "Analyzing project..."

3. Analysis completes
   - **Update**: Issues refresh with HIGH confidence
   - **Result**: False positives disappear

### Configuration

```json
{
  "paradise.analysisMode": "smart"  // Default
}
```

---

## Project Mode

### What It Does

Analyzes your **entire workspace** upfront, building complete context before showing any results.

### When to Use

- ✅ Accuracy is critical (zero tolerance for false positives)
- ✅ Smaller projects (<500 files)
- ✅ Final validation before deployment
- ✅ CI/CD integration

### Performance

| Project Size | Analysis Time | RAM Usage |
|--------------|---------------|-----------|
| Small (<50 files) | 100-200ms | ~50MB |
| Medium (100-500 files) | 200-500ms | ~100MB |
| Large (500-1000 files) | 500ms-2s | ~200MB |

### Limitations

- ⚠️ Slower initial analysis
- ⚠️ Higher memory usage
- ⚠️ May block on very large projects

### Configuration

```json
{
  "paradise.analysisMode": "project",
  "paradise.maxFilesToAnalyze": 1000  // Limit for safety
}
```

---

## Configuration Guide

### Basic Settings

Open VS Code Settings (`Cmd+,` / `Ctrl+,`) and search for "Paradise":

```json
{
  // Analysis mode (file, smart, project)
  "paradise.analysisMode": "smart",

  // Enable analysis on save
  "paradise.analyzeOnSave": true,

  // Enable analysis while typing (with delay)
  "paradise.analyzeOnType": false,
  "paradise.analyzeOnTypeDelay": 1000,

  // Maximum files to analyze in project mode
  "paradise.maxFilesToAnalyze": 1000
}
```

### Include/Exclude Patterns

Control which files Paradise analyzes:

```json
{
  "paradise.includePatterns": [
    "**/*.html",
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx",
    "**/*.css"
  ],

  "paradise.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**",
    "**/vendor/**"
  ]
}
```

### Per-Project Configuration

Create `.vscode/settings.json` in your project:

```json
{
  "paradise.analysisMode": "project",  // Override user setting
  "paradise.excludePatterns": [
    "**/node_modules/**",
    "**/generated/**"  // Project-specific exclusion
  ]
}
```

---

## Performance Considerations

### Choosing the Right Mode

```
Small project (<100 files)
  → Use: Project Mode
  → Why: Fast enough for instant complete analysis

Medium project (100-1000 files)
  → Use: Smart Mode
  → Why: Best balance of speed and accuracy

Large project (1000+ files)
  → Use: Smart Mode or File Mode
  → Why: Project mode may be too slow

Monorepo / Multi-project
  → Use: File Mode + exclude patterns
  → Why: Limit scope to relevant code
```

### Optimization Tips

#### 1. Exclude Build Artifacts

```json
{
  "paradise.excludePatterns": [
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
    "**/out/**",
    "**/target/**"
  ]
}
```

#### 2. Limit File Count

```json
{
  "paradise.maxFilesToAnalyze": 500  // Lower for large projects
}
```

#### 3. Disable Type-Delay Analysis

```json
{
  "paradise.analyzeOnType": false  // Only analyze on save
}
```

#### 4. Use Include Patterns

```json
{
  "paradise.includePatterns": [
    "src/**/*.{html,js,jsx,ts,tsx}"  // Only src folder
  ]
}
```

---

## Troubleshooting

### Issue: Too Many False Positives

**Symptom**: Paradise reports issues that aren't real problems

**Solution**:

1. Check your analysis mode:
   ```json
   {
     "paradise.analysisMode": "smart"  // Not "file"
   }
   ```

2. Ensure HTML pages are included:
   ```json
   {
     "paradise.includePatterns": ["**/*.html"]
   }
   ```

3. Check status bar for background analysis completion

### Issue: Analysis is Too Slow

**Symptom**: Paradise takes >5 seconds to analyze

**Solution**:

1. Switch to Smart Mode:
   ```json
   {
     "paradise.analysisMode": "smart"  // Not "project"
   }
   ```

2. Reduce file count:
   ```json
   {
     "paradise.maxFilesToAnalyze": 500
   }
   ```

3. Exclude unnecessary files:
   ```json
   {
     "paradise.excludePatterns": [
       "**/node_modules/**",
       "**/test/**",
       "**/__tests__/**"
     ]
   }
   ```

### Issue: No Issues Detected

**Symptom**: Paradise doesn't show any diagnostics

**Possible Causes**:

1. **No HTML files found**
   - Check if HTML files are in `includePatterns`
   - Verify HTML files aren't in `excludePatterns`

2. **Analysis not triggered**
   - Save the file to trigger analysis
   - Check status bar for analyzer status

3. **Language not supported**
   - Paradise only works with HTML, CSS, JavaScript, TypeScript
   - Check file extension

4. **No issues present**
   - Your code might actually be accessible! ✅

### Issue: High Memory Usage

**Symptom**: VS Code using >1GB RAM

**Solution**:

1. Switch to Smart Mode (lower memory footprint)

2. Reduce max files:
   ```json
   {
     "paradise.maxFilesToAnalyze": 200
   }
   ```

3. Exclude large directories:
   ```json
   {
     "paradise.excludePatterns": [
       "**/node_modules/**",
       "**/bower_components/**",
       "**/vendor/**"
     ]
   }
   ```

---

## FAQs

### Q: Which mode should I use?

**A**: Use **Smart Mode** (the default). It provides the best balance of speed and accuracy for most projects.

### Q: What's the difference between Smart and Project mode?

**A**:
- **Smart**: Analyzes current file instantly, builds full context in background
- **Project**: Builds full context upfront before showing results

Smart Mode gives you instant feedback while Project Mode makes you wait for complete analysis.

### Q: Why am I seeing warnings about false positives?

**A**: You're in **File Mode**, which can't see code in other files. Switch to Smart Mode:

```json
{
  "paradise.analysisMode": "smart"
}
```

### Q: Can I analyze just one folder in a large project?

**A**: Yes! Use include patterns:

```json
{
  "paradise.includePatterns": [
    "src/components/**/*.{html,js,jsx,tsx}"
  ]
}
```

### Q: Does Paradise analyze minified files?

**A**: No. Paradise automatically excludes `.min.js` and `.min.css` files. You can customize this:

```json
{
  "paradise.excludePatterns": [
    "**/*.min.js",
    "**/*.min.css",
    "**/bundle.js"
  ]
}
```

### Q: How do I know which mode is being used?

**A**: Check the VS Code status bar (bottom right). You'll see:

- "Paradise: Analyzing..." - Working
- "Paradise: ✓ 3 issues" - Complete
- Hover for details on mode and confidence

### Q: Can I disable Paradise temporarily?

**A**: Yes, several options:

1. **Disable extension**: VS Code Extensions panel → Paradise → Disable
2. **Disable for workspace**: `.vscode/settings.json`:
   ```json
   {
     "paradise.enable": false
   }
   ```
3. **Use command**: `Cmd+Shift+P` → "Paradise: Clear Diagnostics"

---

## Advanced: Confidence Levels

Paradise tags each issue with a confidence level based on analysis mode:

| Confidence | Meaning | Analysis Mode |
|------------|---------|---------------|
| **HIGH** ✓ | Zero false positive risk | Smart/Project (with full context) |
| **MEDIUM** ◐ | Possible false positive | File mode or incomplete context |
| **LOW** ⚠ | Heuristic detection | Pattern matching, uncertain |

You can filter by minimum confidence:

```json
{
  "paradise.minConfidence": "HIGH"  // Only show high-confidence issues
}
```

---

## Summary

**Recommended Configuration** for most projects:

```json
{
  "paradise.analysisMode": "smart",
  "paradise.analyzeOnSave": true,
  "paradise.analyzeOnType": false,
  "paradise.maxFilesToAnalyze": 1000,
  "paradise.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**"
  ]
}
```

This gives you:
- ⚡ Instant feedback
- 🎯 High accuracy
- 🚀 Good performance
- ✅ Zero false positives (after background analysis)

---

**Need help?** Open an issue on [GitHub](https://github.com/bobdodd/phd) or check the [extension README](../../app/vscode-extension/README.md).
