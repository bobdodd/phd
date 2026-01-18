export default function FrameworksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Framework Support
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Paradise provides comprehensive accessibility analysis for modern JavaScript frameworks
            including React, with extensibility for Vue, Angular, Svelte, and more.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Framework Support Matrix */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Supported Frameworks</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* React */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">⚛️</div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900">React</h3>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Full Support
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Comprehensive support for React components, hooks, JSX, and TypeScript.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ JSX/TSX syntax parsing</li>
                  <li>✅ React Hooks (useState, useEffect, useRef, useCallback, useMemo, useContext, useImperativeHandle)</li>
                  <li>✅ React Portals (ReactDOM.createPortal)</li>
                  <li>✅ Ref forwarding (forwardRef, useImperativeHandle)</li>
                  <li>✅ Context API (Provider, Consumer, useContext)</li>
                  <li>✅ Synthetic events (stopPropagation detection)</li>
                  <li>✅ Focus management patterns</li>
                </ul>
              </div>

              {/* Vanilla JavaScript */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">📜</div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-900">Vanilla JavaScript</h3>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Full Support
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Complete support for vanilla JavaScript and TypeScript with DOM manipulation.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ addEventListener patterns</li>
                  <li>✅ DOM manipulation (querySelector, getElementById)</li>
                  <li>✅ ARIA attribute updates</li>
                  <li>✅ Focus management (focus(), blur())</li>
                  <li>✅ Event delegation</li>
                  <li>✅ Dynamic content updates</li>
                </ul>
              </div>

              {/* Vue */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 opacity-75">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🟢</div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900">Vue.js</h3>
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Planned
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Vue Single File Components (SFC) support planned for future release.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>⏳ SFC template parsing</li>
                  <li>⏳ Vue 3 Composition API</li>
                  <li>⏳ v-on event directives</li>
                  <li>⏳ Ref and reactive patterns</li>
                  <li>⏳ Teleport detection</li>
                </ul>
              </div>

              {/* Angular */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-8 opacity-75">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🅰️</div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-900">Angular</h3>
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Planned
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Angular template and component support planned for future release.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>⏳ Template syntax parsing</li>
                  <li>⏳ Event binding analysis</li>
                  <li>⏳ Directives and pipes</li>
                  <li>⏳ Dependency injection patterns</li>
                  <li>⏳ CDK accessibility features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* React-Specific Features */}
          <div id="react-features" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-8 text-blue-600">React-Specific Features</h2>

            <div className="space-y-8">
              {/* React Hooks Accessibility Analysis - NEW */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🎣</span>
                  <h3 className="text-2xl font-bold text-blue-900">React Hooks Accessibility Analyzer</h3>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">NEW</span>
                </div>
                <p className="text-gray-800 mb-6 text-lg">
                  Comprehensive accessibility validation for React Hooks patterns - the <strong>first accessibility analyzer specifically designed for React Hooks</strong>.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* useEffect Analysis */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <code className="bg-blue-100 px-2 py-1 rounded text-sm">useEffect</code>
                      Focus & Cleanup
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">⚠️</span>
                        <div>
                          <strong>Missing cleanup for focus management</strong>
                          <p className="text-xs text-gray-600 mt-1">Detects <code>.focus()</code> or <code>.blur()</code> without cleanup function</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">🚫</span>
                        <div>
                          <strong>Event listener leaks</strong>
                          <p className="text-xs text-gray-600 mt-1">Flags <code>addEventListener</code> without <code>removeEventListener</code></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 2.1.1 (Keyboard)</strong>
                          <p className="text-xs text-gray-600 mt-1">Prevents focus leaks and memory issues</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* useRef Analysis */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <code className="bg-purple-100 px-2 py-1 rounded text-sm">useRef</code>
                      Focus Traps
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">⛔</span>
                        <div>
                          <strong>Focus trap without keyboard handlers</strong>
                          <p className="text-xs text-gray-600 mt-1">Detects <code>querySelectorAll</code> focus patterns missing Tab/Escape</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>Programmatic focus without ARIA</strong>
                          <p className="text-xs text-gray-600 mt-1">Elements receiving <code>ref.current.focus()</code> need labels</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 2.1.1, 2.1.2, 2.4.3</strong>
                          <p className="text-xs text-gray-600 mt-1">Keyboard accessibility & focus order</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* useContext Analysis */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                      <code className="bg-green-100 px-2 py-1 rounded text-sm">useContext</code>
                      Announcements
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>A11y state without live regions</strong>
                          <p className="text-xs text-gray-600 mt-1">Context managing ARIA needs screen reader announcements</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✅</span>
                        <div>
                          <strong>Auto-detects accessibility contexts</strong>
                          <p className="text-xs text-gray-600 mt-1">Identifies contexts with "aria", "focus", "announce" keywords</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 4.1.3 (Status Messages)</strong>
                          <p className="text-xs text-gray-600 mt-1">Dynamic changes need announcements</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* useState Analysis */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                      <code className="bg-orange-100 px-2 py-1 rounded text-sm">useState</code>
                      ARIA State
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>Toggle state without aria-expanded</strong>
                          <p className="text-xs text-gray-600 mt-1">Detects <code>isOpen</code>, <code>isExpanded</code> state patterns</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>ARIA attributes without updates</strong>
                          <p className="text-xs text-gray-600 mt-1">State used in <code>aria-*</code> needs setter function</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 4.1.2 (Name, Role, Value)</strong>
                          <p className="text-xs text-gray-600 mt-1">ARIA must reflect current state</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                  <p className="text-sm text-green-900 font-semibold mb-2">
                    🎯 Paradise is the first tool to analyze React Hooks patterns for accessibility issues
                  </p>
                  <p className="text-xs text-green-800">
                    Detects 8 different Hook accessibility patterns including focus leaks, missing cleanup, keyboard traps, and improper ARIA state management.
                  </p>
                </div>
              </div>

              {/* React Hooks */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">React Hooks Detection</h3>
                <p className="text-gray-700 mb-4">
                  Paradise analyzes all React hooks to understand component behavior and accessibility patterns:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">State Hooks</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><code className="bg-white px-2 py-1 rounded">useState</code></li>
                      <li><code className="bg-white px-2 py-1 rounded">useReducer</code></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">Effect Hooks</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><code className="bg-white px-2 py-1 rounded">useEffect</code></li>
                      <li><code className="bg-white px-2 py-1 rounded">useLayoutEffect</code></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">Ref Hooks</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><code className="bg-white px-2 py-1 rounded">useRef</code></li>
                      <li><code className="bg-white px-2 py-1 rounded">useImperativeHandle</code></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">Performance Hooks</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><code className="bg-white px-2 py-1 rounded">useCallback</code></li>
                      <li><code className="bg-white px-2 py-1 rounded">useMemo</code></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">Context Hook</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><code className="bg-white px-2 py-1 rounded">useContext</code></li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2">Custom Hooks</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>Detects all hooks starting with <code className="bg-white px-2 py-1 rounded">use*</code></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                  <p className="text-sm text-green-900">
                    <strong>Example:</strong> Paradise detects <code>useEffect</code> with focus management and tracks ref changes across component lifecycle.
                  </p>
                </div>
              </div>

              {/* React Portals */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">React Portals Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Detects <code>ReactDOM.createPortal()</code> and flags potential accessibility issues:
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <strong className="text-gray-900">Focus management breaks:</strong>
                      <p className="text-gray-700 text-sm">Portal content renders outside parent DOM hierarchy, breaking focus traps</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <strong className="text-gray-900">ARIA relationship boundaries:</strong>
                      <p className="text-gray-700 text-sm">aria-labelledby and aria-controls don't work well across portal boundaries</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <strong className="text-gray-900">Keyboard navigation order:</strong>
                      <p className="text-gray-700 text-sm">Tab order follows DOM structure, not visual layout</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <strong className="text-gray-900">Screen reader context:</strong>
                      <p className="text-gray-700 text-sm">Content announced out of visual context</p>
                    </div>
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>WCAG Criteria:</strong> 2.1.1 (Keyboard), 2.4.3 (Focus Order), 1.3.2 (Meaningful Sequence), 4.1.2 (Name, Role, Value)
                  </p>
                </div>
              </div>

              {/* Ref Forwarding */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Ref Forwarding & useImperativeHandle</h3>
                <p className="text-gray-700 mb-4">
                  Tracks refs passed between components for focus management analysis:
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">forwardRef Detection</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Identifies components using <code className="bg-gray-100 px-2 py-1 rounded">React.forwardRef()</code> to pass refs to children.
                    </p>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <code className="text-blue-600">const</code> Button = <code className="text-blue-600">React</code>.forwardRef((props, ref) =&gt; ...)
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">useImperativeHandle Detection</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      Extracts exposed methods (focus, blur, select) for accessibility analysis.
                    </p>
                    <div className="bg-gray-50 p-4 rounded font-mono text-sm">
                      <code className="text-purple-600">useImperativeHandle</code>(ref, () =&gt; ({'{'}
                      <br />
                      &nbsp;&nbsp;focus: () =&gt; inputRef.current.focus(),
                      <br />
                      &nbsp;&nbsp;blur: () =&gt; inputRef.current.blur()
                      <br />
                      {'})'});
                    </div>
                  </div>
                </div>
              </div>

              {/* Context API */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Context API for Accessibility State</h3>
                <p className="text-gray-700 mb-4">
                  Paradise automatically identifies accessibility-related contexts:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-900 mb-2">Auto-Detected A11y Contexts</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>🎨 <strong>Theme</strong> contexts (dark mode, high contrast)</li>
                      <li>🎯 <strong>Focus</strong> management contexts</li>
                      <li>⌨️ <strong>Keyboard</strong> navigation contexts</li>
                      <li>📢 <strong>Announcement</strong> contexts (screen readers)</li>
                      <li>🔊 <strong>Notification</strong> contexts</li>
                      <li>♿ <strong>ARIA</strong> state contexts</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-900 mb-2">Detected Patterns</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>✅ Context.Provider usage</li>
                      <li>✅ Context.Consumer usage</li>
                      <li>✅ useContext() hook calls</li>
                      <li>✅ Property destructuring</li>
                      <li>✅ Context value analysis</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                  <p className="text-sm text-green-900">
                    <strong>Smart Detection:</strong> Paradise uses keyword matching to identify accessibility-related contexts automatically without manual annotation.
                  </p>
                </div>
              </div>

              {/* Synthetic Events */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Synthetic Event Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Detects problematic event handling patterns that block assistive technology:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <h4 className="font-bold text-red-900 mb-2">⛔ stopPropagation() Issues</h4>
                    <p className="text-sm text-red-900 mb-2">
                      <strong>Severity: Warning</strong> - Blocks event bubbling that assistive technology relies on
                    </p>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Prevents screen readers from receiving events</li>
                      <li>• Can break AT keyboard navigation</li>
                      <li>• Interferes with focus management in AT</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r">
                    <h4 className="font-bold text-red-900 mb-2">🚫 stopImmediatePropagation() Issues</h4>
                    <p className="text-sm text-red-900 mb-2">
                      <strong>Severity: Error</strong> - Blocks ALL subsequent listeners including AT
                    </p>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Completely blocks assistive technology</li>
                      <li>• Prevents all event listeners from firing</li>
                      <li>• Critical accessibility violation</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                    <h4 className="font-bold text-green-900 mb-2">✅ preventDefault() - Safe</h4>
                    <p className="text-sm text-green-900">
                      Prevents default browser behavior while allowing event bubbling - safe for accessibility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Svelte-Specific Features */}
          <div id="svelte-features" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-8 text-orange-600">Svelte-Specific Features</h2>

            <div className="space-y-8">
              {/* Svelte Reactivity Accessibility Analyzer - NEW */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border-2 border-orange-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">⚡</span>
                  <h3 className="text-2xl font-bold text-orange-900">Svelte Reactivity Accessibility Analyzer</h3>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">NEW</span>
                </div>
                <p className="text-gray-800 mb-6 text-lg">
                  Comprehensive accessibility validation for Svelte reactive patterns and directives - the <strong>first accessibility analyzer specifically designed for Svelte</strong>.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* bind: Directives */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                      <code className="bg-orange-100 px-2 py-1 rounded text-sm">bind:</code>
                      Two-Way Binding
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">⚠️</span>
                        <div>
                          <strong>bind:value without labels</strong>
                          <p className="text-xs text-gray-600 mt-1">Detects <code>bind:value</code> and <code>bind:checked</code> without aria-label</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>bind:group without fieldset</strong>
                          <p className="text-xs text-gray-600 mt-1">Radio/checkbox groups need <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 4.1.2, 1.3.1</strong>
                          <p className="text-xs text-gray-600 mt-1">Proper labeling and grouping</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* on: Event Handlers */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                      <code className="bg-red-100 px-2 py-1 rounded text-sm">on:</code>
                      Event Handlers
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">⛔</span>
                        <div>
                          <strong>on:click without keyboard handler</strong>
                          <p className="text-xs text-gray-600 mt-1">Non-interactive elements need <code>on:keydown</code> + role/tabindex</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✅</span>
                        <div>
                          <strong>Validates interactive semantics</strong>
                          <p className="text-xs text-gray-600 mt-1">Checks for proper role and tabindex on custom controls</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 2.1.1, 2.1.2</strong>
                          <p className="text-xs text-gray-600 mt-1">Keyboard accessibility for all interactive elements</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* class: Directives */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-yellow-900 mb-3 flex items-center gap-2">
                      <code className="bg-yellow-100 px-2 py-1 rounded text-sm">class:</code>
                      Conditional Classes
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>Visibility changes without ARIA</strong>
                          <p className="text-xs text-gray-600 mt-1">class:hidden needs <code>aria-hidden</code> or <code>aria-expanded</code></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">⚡</span>
                        <div>
                          <strong>Auto-detects visibility patterns</strong>
                          <p className="text-xs text-gray-600 mt-1">Identifies hidden, visible, show, hide, open, closed classes</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 4.1.2, 4.1.3</strong>
                          <p className="text-xs text-gray-600 mt-1">Screen readers need state communication</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* $: Reactive Statements */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <code className="bg-purple-100 px-2 py-1 rounded text-sm">$:</code>
                      Reactive Statements
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <strong>Focus management without cleanup</strong>
                          <p className="text-xs text-gray-600 mt-1">Reactive <code>.focus()</code> needs onDestroy cleanup</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">🔄</span>
                        <div>
                          <strong>Store subscriptions without announcements</strong>
                          <p className="text-xs text-gray-600 mt-1">Accessibility state stores need <code>aria-live</code> regions</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">💡</span>
                        <div>
                          <strong>WCAG: 2.4.3, 4.1.3</strong>
                          <p className="text-xs text-gray-600 mt-1">Focus restoration and dynamic announcements</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                  <p className="text-sm text-green-900 font-semibold mb-2">
                    🎯 Paradise is the first tool to analyze Svelte reactive patterns for accessibility issues
                  </p>
                  <p className="text-xs text-green-800">
                    Detects 6 different Svelte accessibility patterns including bind: without labels, on: without keyboard handlers, class: visibility changes, and reactive focus management.
                  </p>
                </div>
              </div>

              {/* Svelte Component Structure */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Svelte Component Parsing</h3>
                <p className="text-gray-700 mb-4">
                  Paradise natively understands Svelte's three-block component structure:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <pre className="font-mono text-sm text-gray-800 overflow-x-auto">
{`<script>
  let count = 0;
  let isOpen = false;

  $: if (isOpen) {
    // Reactive statement - Paradise checks focus management
  }
</script>

<button
  on:click={() => count++}
  on:keydown={(e) => {
    if (e.key === 'Enter') count++;
  }}
  aria-label="Increment counter"
>
  Count: {count}
</button>

<div class:hidden={!isOpen} aria-hidden={!isOpen}>
  Content
</div>

<style>
  .hidden { display: none; }
</style>`}
                  </pre>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">&lt;script&gt; Block</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Extracts reactive declarations ($:)</li>
                      <li>• Detects store subscriptions</li>
                      <li>• Analyzes lifecycle hooks</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">Template Block</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Parses Svelte directives</li>
                      <li>• Builds virtual DOM tree</li>
                      <li>• Validates ARIA attributes</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">&lt;style&gt; Block</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Cross-references with template</li>
                      <li>• Detects visibility CSS</li>
                      <li>• Scoped style analysis</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Example: Svelte Dropdown */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Example: Accessible Svelte Dropdown</h3>
                <p className="text-gray-700 mb-6">
                  Paradise validates proper use of Svelte directives for accessibility:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-red-900 mb-3">❌ Inaccessible</h4>
                    <div className="bg-red-50 p-4 rounded-lg font-mono text-sm mb-4">
                      <pre className="text-gray-800 whitespace-pre-wrap">
{`<script>
  let isOpen = false;
</script>

<div on:click={() => isOpen = !isOpen}>
  Toggle
</div>

<div class:hidden={!isOpen}>
  Dropdown content
</div>`}
                      </pre>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>⚠️ <strong>on:click on div without keyboard handler</strong></p>
                      <p>⚠️ <strong>No role or tabindex on interactive element</strong></p>
                      <p>⚠️ <strong>class:hidden without aria-hidden</strong></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-green-900 mb-3">✅ Accessible</h4>
                    <div className="bg-green-50 p-4 rounded-lg font-mono text-sm mb-4">
                      <pre className="text-gray-800 whitespace-pre-wrap">
{`<script>
  let isOpen = false;

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isOpen = !isOpen;
    }
  }
</script>

<button
  aria-expanded={isOpen}
  on:click={() => isOpen = !isOpen}
  on:keydown={handleKeydown}
>
  Toggle
</button>

<div class:hidden={!isOpen} aria-hidden={!isOpen}>
  Dropdown content
</div>`}
                      </pre>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>✅ <strong>Proper button element</strong></p>
                      <p>✅ <strong>aria-expanded tracks state</strong></p>
                      <p>✅ <strong>aria-hidden matches visibility</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extending Paradise */}
          <div id="extending" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-8 text-purple-600">Extending Paradise for New Frameworks</h2>

            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Architecture for Extensibility</h3>
              <p className="text-gray-700 mb-6">
                Paradise's architecture is designed for easy extension to new frameworks through ActionLanguage,
                an intermediate representation that abstracts away framework-specific details.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">1. Create Framework Pattern Detector</h4>
                  <p className="text-gray-700 mb-3">
                    Build a parser that detects framework-specific patterns and transforms them into ActionLanguage nodes.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    <code className="text-gray-700">
                      <span className="text-blue-600">export class</span> VuePatternDetector {'{\n'}
                      &nbsp;&nbsp;<span className="text-green-600">// Parse Vue SFC templates</span>{'\n'}
                      &nbsp;&nbsp;detectVOnDirective(path, sourceFile) {'{ ... }'}{'\n'}
                      &nbsp;&nbsp;detectVModel(path, sourceFile) {'{ ... }'}{'\n'}
                      &nbsp;&nbsp;detectTeleport(path, sourceFile) {'{ ... }'}{'\n'}
                      {'}'}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">2. Map to ActionLanguage</h4>
                  <p className="text-gray-700 mb-3">
                    Transform framework patterns into universal ActionLanguage nodes:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-purple-600">Framework Code:</strong>
                        <pre className="bg-white p-2 rounded mt-1 font-mono text-xs">
{'<button @click="submit">\n  Submit\n</button>'}
                        </pre>
                      </div>
                      <div>
                        <strong className="text-blue-600">ActionLanguage:</strong>
                        <pre className="bg-white p-2 rounded mt-1 font-mono text-xs">
{`{
  actionType: 'eventHandler',
  event: 'click',
  element: { selector: 'button' }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">3. Create Framework-Specific Analyzers (Optional)</h4>
                  <p className="text-gray-700 mb-3">
                    Add analyzers for framework-specific accessibility concerns:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                    <code className="text-gray-700">
                      <span className="text-blue-600">export class</span> VueTeleportAnalyzer {'{\n'}
                      &nbsp;&nbsp;<span className="text-green-600">// Analyze Vue teleport accessibility</span>{'\n'}
                      &nbsp;&nbsp;analyze(source, sourceFile) {'{ ... }'}{'\n'}
                      {'}'}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">4. Universal Analyzers Work Automatically</h4>
                  <p className="text-gray-700 mb-3">
                    Existing analyzers (MouseOnlyClickAnalyzer, StaticAriaAnalyzer, etc.) automatically work with
                    your framework once it outputs ActionLanguage nodes.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                    <p className="text-sm text-green-900">
                      <strong>Zero Changes Needed:</strong> All 13 core analyzers work with any framework that produces ActionLanguage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Contributing Framework Support</h3>
              <p className="text-gray-700 mb-4">
                Want to add support for your favorite framework? We welcome contributions!
              </p>
              <div className="space-y-2 text-gray-700 mb-6">
                <p>📚 <strong>Read:</strong> <a href="/architecture" className="text-blue-600 hover:underline">Architecture Documentation</a></p>
                <p>💡 <strong>Study:</strong> <a href="https://github.com/anthropics/paradise/tree/main/src/parsers" className="text-blue-600 hover:underline">ReactPatternDetector.ts</a> as reference implementation</p>
                <p>🧪 <strong>Test:</strong> Comprehensive test coverage required (see existing test suites)</p>
                <p>🚀 <strong>Submit:</strong> Pull request with pattern detector + tests + documentation</p>
              </div>
              <a
                href="https://github.com/anthropics/paradise"
                className="inline-block bg-gradient-to-r from-paradise-blue to-paradise-purple text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                View on GitHub →
              </a>
            </div>
          </div>

          {/* Framework Comparison */}
          <div id="comparison" className="scroll-mt-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">Framework Analysis Comparison</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">React</th>
                    <th className="px-6 py-4 text-center font-semibold">Svelte</th>
                    <th className="px-6 py-4 text-center font-semibold">Vanilla JS</th>
                    <th className="px-6 py-4 text-center font-semibold">Vue (Planned)</th>
                    <th className="px-6 py-4 text-center font-semibold">Angular (Planned)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Event Handler Detection</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Focus Management</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">ARIA Updates</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Reactivity/State Management</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">N/A</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Two-Way Data Binding</td>
                    <td className="px-6 py-4 text-center">N/A</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">N/A</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Synthetic Event Issues</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">✅</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                    <td className="px-6 py-4 text-center">⏳</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-paradise-blue to-paradise-purple text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Try Paradise with React Today</h3>
            <p className="text-lg mb-6 opacity-90">
              Get instant accessibility analysis for your React components with comprehensive pattern detection.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/extension"
                className="bg-white text-paradise-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get VS Code Extension
              </a>
              <a
                href="/playground"
                className="bg-paradise-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-paradise-green/90 transition-colors"
              >
                Try Interactive Playground
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
