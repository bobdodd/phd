export default function AnalysisModesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">Understanding Analysis Modes</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Paradise offers three analysis modes optimized for different project sizes and accuracy requirements.
            Learn how to configure Paradise for optimal performance and accuracy.
          </p>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-700">Mode</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Speed</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">False Positives</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">File</td>
                  <td className="py-3 px-4">⚡ Instant</td>
                  <td className="py-3 px-4">Medium</td>
                  <td className="py-3 px-4">Possible</td>
                  <td className="py-3 px-4">Quick checks, single files</td>
                </tr>
                <tr className="border-b border-gray-100 bg-paradise-blue/5">
                  <td className="py-3 px-4 font-medium text-paradise-blue">Smart ⭐</td>
                  <td className="py-3 px-4">⚡ Instant</td>
                  <td className="py-3 px-4">High</td>
                  <td className="py-3 px-4">Minimal</td>
                  <td className="py-3 px-4">Most projects (recommended)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">Project</td>
                  <td className="py-3 px-4">🐢 Slower</td>
                  <td className="py-3 px-4">Highest</td>
                  <td className="py-3 px-4">Zero</td>
                  <td className="py-3 px-4">Multi-page apps, accuracy critical</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Three Modes Explanation */}
      <section className="container mx-auto px-6 pb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">The Three Analysis Modes</h2>

        {/* File Mode */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gray-100 text-gray-700 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">File Mode</h3>
              <p className="text-gray-600">Analyzes only the currently open file without looking at other files</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Quick syntax checks</li>
                <li>Working on standalone JavaScript utilities</li>
                <li>Performance-critical environments</li>
                <li>Very large projects (10,000+ files)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-700 mb-2"><strong>False Positive Example:</strong></p>
                <p className="text-gray-600 text-sm mb-2">If keyboard handlers are in a separate file, File Mode won't see them and may incorrectly report missing keyboard support.</p>
                <div className="bg-white rounded p-3 text-sm">
                  <pre className="text-gray-800"><code>{`// handlers.js
document.getElementById('submit').addEventListener('click', handleSubmit);

// keyboard.js (separate file - NOT SEEN by File Mode)
document.getElementById('submit').addEventListener('keydown', handleKeyboard);`}</code></pre>
                  <p className="text-red-600 mt-2">⚠️ Result: "Missing keyboard handler" (false positive)</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  "paradise.analysisMode": "file"
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Mode */}
        <div className="bg-gradient-to-br from-paradise-blue/10 to-paradise-purple/10 rounded-xl shadow-lg p-8 mb-8 border-2 border-paradise-blue">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-paradise-blue text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Mode ⭐ (Recommended)</h3>
              <p className="text-gray-700">Uses dual-phase approach: instant analysis + background enhancement</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
              <div className="bg-white rounded-lg p-6 shadow">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-paradise-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold text-gray-900">Instant Analysis</p>
                      <p className="text-gray-600 text-sm">Analyzes current file immediately (&lt;100ms)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-paradise-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold text-gray-900">Background Enhancement</p>
                      <p className="text-gray-600 text-sm">Discovers related HTML pages and builds complete context</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold text-gray-900">Progressive Update</p>
                      <p className="text-gray-600 text-sm">Re-analyzes with full context once background work completes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Most projects</strong> (this is the default)</li>
                <li>Multi-page web applications</li>
                <li>Projects with separate HTML/JS/CSS files</li>
                <li>When you want accuracy without sacrificing speed</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-semibold text-paradise-blue mb-1">⚡ Instant Feedback</p>
                  <p className="text-gray-600 text-sm">See issues immediately as you type</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-semibold text-paradise-blue mb-1">🎯 High Accuracy</p>
                  <p className="text-gray-600 text-sm">Background process eliminates false positives</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-semibold text-paradise-blue mb-1">🚀 Non-blocking</p>
                  <p className="text-gray-600 text-sm">Doesn't interrupt your workflow</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="font-semibold text-paradise-blue mb-1">📈 Progressive</p>
                  <p className="text-gray-600 text-sm">Gets more accurate as analysis completes</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  "paradise.analysisMode": "smart"  // Default
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Project Mode */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gray-700 text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Project Mode</h3>
              <p className="text-gray-600">Analyzes entire workspace upfront before showing results</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When to Use</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Accuracy is critical (zero tolerance for false positives)</li>
                <li>Smaller projects (&lt;500 files)</li>
                <li>Final validation before deployment</li>
                <li>CI/CD integration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-3 font-semibold text-gray-700">Project Size</th>
                      <th className="py-2 px-3 font-semibold text-gray-700">Analysis Time</th>
                      <th className="py-2 px-3 font-semibold text-gray-700">RAM Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Small (&lt;50 files)</td>
                      <td className="py-2 px-3">100-200ms</td>
                      <td className="py-2 px-3">~50MB</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Medium (100-500 files)</td>
                      <td className="py-2 px-3">200-500ms</td>
                      <td className="py-2 px-3">~100MB</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">Large (500-1000 files)</td>
                      <td className="py-2 px-3">500ms-2s</td>
                      <td className="py-2 px-3">~200MB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>⚠️ Slower initial analysis</li>
                <li>⚠️ Higher memory usage</li>
                <li>⚠️ May block on very large projects</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  "paradise.analysisMode": "project",
  "paradise.maxFilesToAnalyze": 1000  // Limit for safety
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Guide */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Configuration Guide</h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Basic Settings */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Settings</h3>
              <p className="text-gray-600 mb-4">Open VS Code Settings (<kbd className="px-2 py-1 bg-gray-200 rounded text-sm">Cmd+,</kbd> / <kbd className="px-2 py-1 bg-gray-200 rounded text-sm">Ctrl+,</kbd>) and search for "Paradise":</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  // Analysis mode (file, smart, project)
  "paradise.analysisMode": "smart",

  // Enable analysis on save
  "paradise.analyzeOnSave": true,

  // Enable analysis while typing (with delay)
  "paradise.analyzeOnType": false,
  "paradise.analyzeOnTypeDelay": 1000,

  // Maximum files to analyze in project mode
  "paradise.maxFilesToAnalyze": 1000
}`}</pre>
              </div>
            </div>

            {/* Include/Exclude Patterns */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Include/Exclude Patterns</h3>
              <p className="text-gray-600 mb-4">Control which files Paradise analyzes:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
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
}`}</pre>
              </div>
            </div>

            {/* Recommended Configuration */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✅ Recommended Configuration</h3>
              <p className="text-gray-700 mb-4">For most projects, use this configuration:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  "paradise.analysisMode": "smart",
  "paradise.analyzeOnSave": true,
  "paradise.analyzeOnType": false,
  "paradise.maxFilesToAnalyze": 1000,
  "paradise.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**"
  ]
}`}</pre>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 text-sm">✨ This gives you:</p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                  <li>⚡ Instant feedback</li>
                  <li>🎯 High accuracy</li>
                  <li>🚀 Good performance</li>
                  <li>✅ Zero false positives (after background analysis)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Optimization */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Performance Optimization</h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Choosing the Right Mode</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-paradise-blue pl-4">
                <p className="font-semibold text-gray-900">Small project (&lt;100 files)</p>
                <p className="text-gray-600 text-sm">→ Use: <strong>Project Mode</strong></p>
                <p className="text-gray-500 text-sm">Fast enough for instant complete analysis</p>
              </div>
              <div className="border-l-4 border-paradise-purple pl-4">
                <p className="font-semibold text-gray-900">Medium project (100-1000 files)</p>
                <p className="text-gray-600 text-sm">→ Use: <strong>Smart Mode</strong></p>
                <p className="text-gray-500 text-sm">Best balance of speed and accuracy</p>
              </div>
              <div className="border-l-4 border-gray-400 pl-4">
                <p className="font-semibold text-gray-900">Large project (1000+ files)</p>
                <p className="text-gray-600 text-sm">→ Use: <strong>Smart Mode or File Mode</strong></p>
                <p className="text-gray-500 text-sm">Project mode may be too slow</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Optimization Tips</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Exclude Build Artifacts</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                  <pre>{`"paradise.excludePatterns": ["**/dist/**", "**/build/**", "**/.next/**", "**/out/**"]`}</pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Limit File Count</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                  <pre>{`"paradise.maxFilesToAnalyze": 500  // Lower for large projects`}</pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Disable Type-Delay Analysis</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                  <pre>{`"paradise.analyzeOnType": false  // Only analyze on save`}</pre>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">4. Use Include Patterns</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                  <pre>{`"paradise.includePatterns": ["src/**/*.{html,js,jsx,ts,tsx}"]  // Only src folder`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Troubleshooting</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">❌ Too Many False Positives</h3>
              <p className="text-gray-600 mb-4"><strong>Symptom:</strong> Paradise reports issues that aren't real problems</p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Solution 1: Check analysis mode</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <pre>{`{ "paradise.analysisMode": "smart" }  // Not "file"`}</pre>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Solution 2: Ensure HTML pages are included</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <pre>{`{ "paradise.includePatterns": ["**/*.html"] }`}</pre>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Solution 3: Wait for background analysis</p>
                  <p className="text-gray-600 text-sm">Check status bar for completion indicator</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🐌 Analysis is Too Slow</h3>
              <p className="text-gray-600 mb-4"><strong>Symptom:</strong> Paradise takes &gt;5 seconds to analyze</p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Solution 1: Switch to Smart Mode</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <pre>{`{ "paradise.analysisMode": "smart" }  // Not "project"`}</pre>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Solution 2: Reduce file count</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <pre>{`{ "paradise.maxFilesToAnalyze": 500 }`}</pre>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Solution 3: Exclude unnecessary files</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <pre>{`{ "paradise.excludePatterns": ["**/node_modules/**", "**/test/**"] }`}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 No Issues Detected</h3>
              <p className="text-gray-600 mb-4"><strong>Symptom:</strong> Paradise doesn't show any diagnostics</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700"><strong>Possible Causes:</strong></p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>No HTML files found - check include patterns</li>
                  <li>Analysis not triggered - save the file</li>
                  <li>Language not supported - only HTML/CSS/JS/TS</li>
                  <li>No issues present - your code might be accessible! ✅</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Q: Which mode should I use?</h3>
            <p className="text-gray-600">
              <strong>A:</strong> Use <strong>Smart Mode</strong> (the default). It provides the best balance of speed and accuracy for most projects.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Q: What's the difference between Smart and Project mode?</h3>
            <div className="text-gray-600 space-y-2">
              <p><strong>A:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Smart:</strong> Analyzes current file instantly, builds full context in background</li>
                <li><strong>Project:</strong> Builds full context upfront before showing results</li>
              </ul>
              <p className="mt-2">Smart Mode gives you instant feedback while Project Mode makes you wait for complete analysis.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Q: Why am I seeing warnings about false positives?</h3>
            <p className="text-gray-600 mb-3">
              <strong>A:</strong> You're in <strong>File Mode</strong>, which can't see code in other files. Switch to Smart Mode:
            </p>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
              <pre>{`{ "paradise.analysisMode": "smart" }`}</pre>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Q: Can I analyze just one folder in a large project?</h3>
            <p className="text-gray-600 mb-3">
              <strong>A:</strong> Yes! Use include patterns:
            </p>
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
              <pre>{`{ "paradise.includePatterns": ["src/components/**/*.{html,js,jsx,tsx}"] }`}</pre>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Q: How do I know which mode is being used?</h3>
            <p className="text-gray-600">
              <strong>A:</strong> Check the VS Code status bar (bottom right). You'll see "Paradise: Analyzing..." when working and "Paradise: ✓ 3 issues" when complete. Hover for details on mode and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Confidence Levels */}
      <section className="bg-gradient-to-r from-paradise-purple/10 to-paradise-blue/10 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Understanding Confidence Levels</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Paradise tags each issue with a confidence level based on how much context it has available during analysis.
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 font-semibold text-gray-700">Confidence</th>
                    <th className="py-4 px-6 font-semibold text-gray-700">Meaning</th>
                    <th className="py-4 px-6 font-semibold text-gray-700">Analysis Mode</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                        <span className="text-lg">✓</span> HIGH
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">Zero false positive risk</td>
                    <td className="py-4 px-6 text-gray-600">Smart/Project (with full context)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-yellow-600 font-semibold">
                        <span className="text-lg">◐</span> MEDIUM
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">Possible false positive</td>
                    <td className="py-4 px-6 text-gray-600">File mode or incomplete context</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-red-600 font-semibold">
                        <span className="text-lg">⚠</span> LOW
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">Heuristic detection</td>
                    <td className="py-4 px-6 text-gray-600">Pattern matching, uncertain</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Filter by Confidence</h3>
              <p className="text-gray-600 mb-4">You can configure Paradise to only show high-confidence issues:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  "paradise.minConfidence": "HIGH"  // Only show high-confidence issues
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple rounded-2xl shadow-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Configure Paradise?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Install the VS Code extension and start analyzing your code with Smart Mode for the best experience.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/extension"
              className="px-8 py-3 bg-white text-paradise-blue rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Install Extension
            </a>
            <a
              href="https://github.com/bobdodd/phd"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white/10 backdrop-blur text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border-2 border-white"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
