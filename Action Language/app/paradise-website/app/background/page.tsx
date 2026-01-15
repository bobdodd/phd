export default function BackgroundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-paradise-purple to-paradise-blue text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Background & Origins
          </h1>
          <p className="text-2xl mb-4 max-w-3xl">
            Paradise's ActionLanguage concept has deep academic roots dating back to 2008 research
            on accessible adaptive hypermedia, first presented at the W4A (Web for All) conference in Beijing.
          </p>
          <div className="bg-white/10 backdrop-blur-sm border-l-4 border-white/40 p-6 rounded-r-lg mt-8 max-w-3xl">
            <p className="text-white/95 italic text-lg">
              "New versions of well-known websites, including for example Google Select, which is an AJAX driven
              variant of their standard search page, are now largely opaque to screen reading technology such as Jaws."
            </p>
            <p className="text-sm text-white/80 mt-2">— Dodd, Green & Pearson, W4A 2008</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="border-l-4 border-paradise-blue pl-8 space-y-12">
            <div>
              <div className="text-sm font-bold text-paradise-blue mb-2">1994</div>
              <h3 className="text-2xl font-bold mb-2">Dexter Hypertext Model</h3>
              <p className="text-gray-600">
                Three-layer architecture (Storage, Within-Component, Runtime) establishing the node-and-link
                paradigm for hypertext. Components connected by Links, with Presentation Specifications
                providing rendering hints.
              </p>
            </div>

            <div>
              <div className="text-sm font-bold text-paradise-blue mb-2">1994</div>
              <h3 className="text-2xl font-bold mb-2">Amsterdam Hypermedia Model</h3>
              <p className="text-gray-600">
                Extended Dexter with time-based media (video, audio), Synchronization Arcs for temporal
                relationships, and Channels for presentation. Foundation for SMIL and multimedia messaging.
              </p>
            </div>

            <div>
              <div className="text-sm font-bold text-paradise-blue mb-2">2001</div>
              <h3 className="text-2xl font-bold mb-2">Multi-Sensory Design Space</h3>
              <p className="text-gray-600">
                Nesbitt's work on modeling the multi-sensory design space provided foundational concepts for
                adaptation and cross-modal representation. These abstractions directly informed CISNA's
                Adaptation Layer and the concept of adapting content between different sensory modalities
                (visual, sonic, haptic).
              </p>
            </div>

            <div>
              <div className="text-sm font-bold text-paradise-blue mb-2">2008</div>
              <h3 className="text-2xl font-bold mb-2">The CISNA Model & ActionLanguage</h3>
              <p className="text-gray-600 mb-4">
                Robert Dodd, Dr Steve Green, and Dr. Elaine Pearson (University of Teesside) presented
                "The Carnforth Model of Accessible Adaptive Hypermedia" at W4A conference in Beijing.
                Introduced five-layer CISNA model with ActionLanguage concepts in the Navigation Layer.
              </p>
              <div className="bg-blue-50 border-l-4 border-paradise-blue p-4 rounded-r-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>The Problem:</strong> AJAX-based applications were opaque to screen readers.
                  JavaScript interactions existed only in code, not in accessible semantic structures.
                  Google Select's keyword completion was either mute or missed updates.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>The Solution:</strong> Abstract User Interface separating content, semantics,
                  and navigation from presentation. Enable adaptation between design spaces (visual → sonic).
                </p>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-paradise-blue mb-2">2025</div>
              <h3 className="text-2xl font-bold mb-2">Paradise: Modern Implementation</h3>
              <p className="text-gray-600">
                Paradise evolves CISNA's research into a practical tool for modern web development.
                Babel AST parsing extracts ActionLanguage patterns from JavaScript/TypeScript/JSX,
                detecting accessibility issues automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="#cisna-model" className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">1</div>
              <div className="text-lg font-semibold">The CISNA Model</div>
              <div className="text-sm opacity-90 mt-2">Five-layer architecture</div>
            </a>

            <a href="#bridges" className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-lg font-semibold">Bridges & Counterparts</div>
              <div className="text-sm opacity-90 mt-2">Layer connections</div>
            </a>

            <a href="#abstract-ui" className="group relative overflow-hidden bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-lg font-semibold">Abstract User Interface</div>
              <div className="text-sm opacity-90 mt-2">Content-presentation separation</div>
            </a>

            <a href="#prototype" className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-lg font-semibold">Google Maps Prototype</div>
              <div className="text-sm opacity-90 mt-2">Proof of concept</div>
            </a>

            <a href="#insights" className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-lg font-semibold">Key Insights</div>
              <div className="text-sm opacity-90 mt-2">Shaping Paradise</div>
            </a>

            <a href="#modern-relevance" className="group relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-lg font-semibold">Modern Relevance</div>
              <div className="text-sm opacity-90 mt-2">2025 perspective</div>
            </a>

            <a href="#more-than-linter" className="group relative overflow-hidden bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">7</div>
              <div className="text-lg font-semibold">More Than a Linter</div>
              <div className="text-sm opacity-90 mt-2">Research foundations</div>
            </a>

            <a href="#references" className="group relative overflow-hidden bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-lg font-semibold">References</div>
              <div className="text-sm opacity-90 mt-2">Academic sources</div>
            </a>
          </div>
        </div>

        {/* The CISNA Model */}
        <div id="cisna-model" className="max-w-4xl mx-auto mb-16 scroll-mt-8">
          <h2 className="text-4xl font-bold mb-8 text-indigo-600">The CISNA Model</h2>
          <p className="text-lg text-gray-600 mb-8">
            <strong>CISNA</strong> (Content, Inventory, Semantics, Navigation, Adaptation) is a five-layer
            document representation extending Dexter/Amsterdam models. It "peels apart" the Dexter Runtime Layer
            and reorganizes the Storage and Within-Component layers into five independent abstractions:
          </p>

          <div className="space-y-6">
            {/* Layer 1 - Content */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">(External) Content Layer</h3>
                  <p className="text-gray-600 mb-3">
                    All content is external to the model. Raw storage of text, images, video, audio, even
                    physical items (tangible interfaces, augmented reality objects). No restrictions on
                    what constitutes content.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Extends Amsterdam's external multimedia references to ALL content types
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 2 - Inventory */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-paradise-blue">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Inventory Layer</h3>
                  <p className="text-gray-600 mb-3">
                    Indexing service buffering content from semantics. <strong>Media Elements</strong> reference
                    external content with properties (size, resolution, format). <strong>Formatted Media Elements</strong>
                    specify presentation form (fonts, text-to-speech voice). Handles transient content (AJAX updates).
                  </p>
                  <div className="bg-blue-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Example:</strong> A bullet-point image used multiple times has ONE inventory entry
                      but multiple semantic meanings: "bullet point" and "bullet style option in toolbar"
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-paradise-blue font-semibold">
                    → Paradise's DOMModel (element catalog)
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 3 - Semantics */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-paradise-purple">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-purple text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Semantics Layer</h3>
                  <p className="text-gray-600 mb-3">
                    Rule-based meta-model capturing <em>meaning</em>, similar to Prolog. Components:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                    <li><strong>Ontologies:</strong> Domain groupings (Container, Menu, Media, Coordinate System)</li>
                    <li><strong>Nouns:</strong> Entities (Menu, Menu Item, Title, Viewport)</li>
                    <li><strong>Verbs:</strong> Relationships (is a, contains, scopes, expands upon, follows)</li>
                    <li><strong>Rules:</strong> Abstract noun-verb-noun (e.g., "Menu contains Menu Item")</li>
                    <li><strong>Notions:</strong> Concrete instances (e.g., "Google Maps" is a Site Title)</li>
                    <li><strong>Statements:</strong> Concrete notion-verb-notion relationships</li>
                  </ul>
                  <div className="bg-purple-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Conditional Multiple Inheritance:</strong> A Menu is <em>sometimes</em> a List,
                      <em>sometimes</em> a Grid (iPhone top menu). Enables flexible semantic adaptation.
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-paradise-purple font-semibold">
                    → Paradise's ARIA Analysis (semantic meaning)
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 4 - Navigation */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-paradise-purple">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-paradise-purple text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Navigation Layer</h3>
                  <p className="text-gray-600 mb-3">
                    Core navigation structure (closest to Dexter Storage Layer). Components:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                    <li><strong>Nodes:</strong> Something user can navigate to/from (Dexter Component)</li>
                    <li><strong>Edges:</strong> Navigable paths between nodes (Dexter Link Component)</li>
                    <li><strong>Views:</strong> Collections of nodes presented contemporaneously</li>
                  </ul>
                  <div className="bg-purple-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Key Insight:</strong> JavaScript event handlers aren't just code - they're
                      <strong> navigation mechanisms</strong>. A click handler creates an Edge in the Navigation Layer.
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Views:</strong> Represent "chunks" (web pages, chapters, scrollpanes). Multiple Edges
                      can exist between nodes (back button vs hyperlink have different navigation semantics).
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-paradise-purple font-semibold">
                    → Paradise's ActionLanguageModel ← ActionLanguage lives here!
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 5 - Adaptation */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  5
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Adaptation Layer</h3>
                  <p className="text-gray-600 mb-3">
                    Instances and triggers for adaptation. <strong>Instance</strong> = transaction of
                    add/modify/delete to other layers. <strong>Event Triggers</strong> cause instance realization.
                    Bridges to ALL other layers.
                  </p>
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>Passive Documents:</strong> No new instances during session (newspaper, static HTML)<br />
                      <strong>Dynamic Documents:</strong> New instances during session (JavaScript, onMouseOver, AJAX)
                    </p>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 font-semibold">
                    → Paradise's confidence scoring, progressive analysis
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bridges */}
        <div id="bridges" className="max-w-4xl mx-auto mb-16 scroll-mt-8">
          <h2 className="text-4xl font-bold mb-8 text-blue-600">Bridges & Counterparts</h2>
          <p className="text-lg text-gray-600 mb-6">
            Adjacent layers connect through <strong>bridges</strong> - models expressing relationships.
            Bridges describe <strong>counterparts</strong>: "Notion A exists when we have Node B", not identity.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-paradise-blue">
              <h3 className="text-xl font-bold mb-3">Inventory ↔ Semantics Bridge</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Element in Noun</li>
                <li>• Element in Notion</li>
                <li>• Cue in Notion</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3 italic">
                Text "Google Maps" maps to notion "Site Title". Multiple elements can map to same notion.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-paradise-purple">
              <h3 className="text-xl font-bold mb-3">Semantics ↔ Navigation Bridge</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Notion in Node</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3 italic">
                Notion "Google Maps" maps to View node "Google Maps Application"
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400 md:col-span-2">
              <h3 className="text-xl font-bold mb-3">Adaptation Bridges</h3>
              <p className="text-gray-700 text-sm mb-2">
                Connect Adaptation Layer to ALL other layers. Each element instance maps to specific
                Adaptation Instance. "Shadow" elements reference instances (like <code>extern</code> in C/C++).
              </p>
              <p className="text-sm text-gray-600 italic">
                Example: All "Default User" info maps to "Default" instance. Changes for "Low Vision User"
                map to "Default to Low Vision" instance.
              </p>
            </div>
          </div>
        </div>

        {/* Abstract User Interface */}
        <div id="abstract-ui" className="max-w-4xl mx-auto mb-16 scroll-mt-8">
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Abstract User Interface</h2>
            <p className="text-lg mb-6 text-white/90">
              CISNA's five layers describe content, semantics, and navigation <strong>independent of rendering</strong>.
              Development System creates abstract model; Runtime System renders to concrete form (visual, sonic, haptic).
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-bold mb-2 text-white/80">ABSTRACT MODEL</div>
                <div className="text-xl font-bold mb-2">5 CISNA Layers</div>
                <div className="text-sm text-white/90">Content, Inventory, Semantics, Navigation, Adaptation</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-bold mb-2 text-white/80">BRIDGES</div>
                <div className="text-xl font-bold mb-2">Relationships</div>
                <div className="text-sm text-white/90">Connect layers, enable cross-model analysis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm font-bold mb-2 text-white/80">CONCRETE RENDERING</div>
                <div className="text-xl font-bold mb-2">Design Spaces</div>
                <div className="text-sm text-white/90">Visual, sonic (TTS), haptic adaptation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype */}
        <div id="prototype" className="max-w-4xl mx-auto mb-16 scroll-mt-8">
          <h2 className="text-4xl font-bold mb-8 text-purple-600">Google Maps Prototype</h2>
          <p className="text-lg text-gray-600 mb-6">
            The 2008 paper presented a fully working Java prototype analyzing a fragment of Google Maps'
            top menu (Web, Images, Maps, more ▼):
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-50 px-4 py-2 rounded font-mono text-sm">
                Web | Images | Maps | more ▼
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Technologies</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Java implementation</li>
                  <li>• XML-based notation for layers</li>
                  <li>• FreeTTS text-to-speech</li>
                  <li>• Database-like model storage</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2">User Profiles</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Default User (visual only)</li>
                  <li>• Low Vision User (visual + TTS)</li>
                  <li>• Instant profile switching</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded p-4">
              <div className="text-sm font-bold mb-2">Output Example:</div>
              <p className="text-sm text-gray-700 font-mono">
                "Application Google Maps. Menu Start. Item Web. Item Images. Item More. End menu."
              </p>
            </div>
          </div>

          <p className="text-gray-600 italic">
            The prototype validated that CISNA can express real web interfaces and adapt them between
            user profiles using XML transactions (instances).
          </p>
        </div>

        {/* Key Insights */}
        <div id="insights" className="max-w-4xl mx-auto mb-16 scroll-mt-8">
          <h2 className="text-4xl font-bold mb-8 text-emerald-600">Key Insights That Shaped Paradise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-paradise-blue/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧭</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Interactions Are Navigation</h3>
              <p className="text-gray-600">
                JavaScript event handlers create Edges in the Navigation Layer. A click handler is a
                navigation path, just like a hyperlink. This lets us analyze accessibility of interaction patterns.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-paradise-purple/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Layer Separation</h3>
              <p className="text-gray-600">
                Content → Inventory → Semantics → Navigation → Adaptation. Each layer handles one concern.
                Bridges connect layers. Paradise mirrors this with DOM, ActionLanguage, ARIA models.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-paradise-blue/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Bridges Enable Cross-Model Analysis</h3>
              <p className="text-gray-600">
                CISNA bridges (Inventory↔Semantics, Semantics↔Navigation) inspired Paradise's cross-file
                analysis: link DOM elements to handlers, detect orphaned handlers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-paradise-purple/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Instances as Transactions</h3>
              <p className="text-gray-600">
                Adaptation as add/modify/delete transactions. Paradise expresses fixes as transformations.
                Potential to measure accessibility as "distance" (Levenshtein Distance).
              </p>
            </div>
          </div>
        </div>

        {/* Modern Relevance */}
        <div id="modern-relevance" className="max-w-4xl mx-auto mb-16 scroll-mt-8">
          <h2 className="text-4xl font-bold mb-8 text-orange-600">Modern Relevance (2025)</h2>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 border-l-4 border-red-500 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">The Problems Persist</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span>AJAX and script-intensive pages still opaque to screen readers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span>Modern SPAs (React, Vue, Angular) create same issues as 2008 Google Select</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span>JavaScript interactions still invisible to assistive technology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-1">•</span>
                <span>Mobile + complex interactions = accessibility challenges</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 border-l-4 border-paradise-blue">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Paradise Extends CISNA</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-paradise-blue font-bold mt-1">✓</span>
                <span>Babel AST parsing replaces XML notation for modern JS/TS/JSX</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paradise-blue font-bold mt-1">✓</span>
                <span>Multi-model architecture (DOM, ActionLanguage, CSS, ARIA) mirrors CISNA layers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paradise-blue font-bold mt-1">✓</span>
                <span>Cross-file pattern detection catches split handlers (CISNA bridges)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-paradise-blue font-bold mt-1">✓</span>
                <span>Confidence scoring handles incomplete information (CISNA adaptation)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Conclusion */}
        <div id="more-than-linter" className="max-w-4xl mx-auto scroll-mt-8">
          <div className="bg-gradient-to-br from-pink-600 via-pink-700 to-pink-600 rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">More Than a Linter</h2>
            <p className="text-xl mb-6 text-white/90 leading-relaxed">
              Paradise isn't just a linter - it's the practical implementation of 15+ years of research
              on accessible adaptive hypermedia. The ActionLanguage concept, grounded in CISNA's Navigation Layer,
              provides the theoretical foundation for understanding JavaScript interactions as navigational
              behaviors that must be accessible to all users.
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              The 2008 Carnforth Model demonstrated that JavaScript interactions can be abstracted as
              Navigation Layer edges, semantic meaning can be separated from presentation, and accessibility
              differences can be formally modeled. Paradise extends these ideas with modern parsing,
              real-world scalability, and automatic pattern detection.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              By standing on these academic foundations, Paradise understands the <strong>semantics</strong> of
              web interactions - not just syntax - and can detect when those semantics are inaccessible.
            </p>
          </div>
        </div>

        {/* References */}
        <div id="references" className="max-w-4xl mx-auto mt-16 scroll-mt-8">
          <h2 className="text-3xl font-bold mb-6 text-violet-600">References</h2>
          <div className="bg-gray-50 rounded-lg p-8 space-y-4 text-sm">
            <div>
              <div className="font-bold text-gray-900 mb-1">Primary Source:</div>
              <p className="text-gray-700">
                Dodd, R., Green, S., & Pearson, E. (2008). "The Carnforth Model of Accessible Adaptive Hypermedia."
                <em> Proceedings of the 2008 International Cross-Disciplinary Conference on Web Accessibility (W4A)</em>,
                Beijing, China.
              </p>
            </div>
            <div>
              <div className="font-bold text-gray-900 mb-1">Foundational Models:</div>
              <p className="text-gray-700 mb-2">
                Halasz, F., & Schwartz, M. (1994). "The Dexter Hypertext Reference Model."
                <em> Communications of the ACM</em>, 37(2), 30-39.
              </p>
              <p className="text-gray-700 mb-2">
                Hardman, L., Bulterman, D. C. A., & van Rossum, G. (1994). "The Amsterdam Hypermedia Model:
                Adding Time and Context to the Dexter Model." <em> Communications of the ACM</em>, 37(2), 50-62.
              </p>
              <p className="text-gray-700">
                Nesbitt, K. V. (2001). "Modeling the Multi-Sensory Design Space."
                <em> In Australian symposium on Information visualization, Volume 9 (CRPITS'01)</em>.
                Australian Computer Society.
              </p>
            </div>
            <div>
              <div className="font-bold text-gray-900 mb-1">Related Standards:</div>
              <p className="text-gray-700 mb-1">W3C HTML 5 Working Draft (2008)</p>
              <p className="text-gray-700 mb-1">W3C XForms Specification Version 1.0 (2006)</p>
              <p className="text-gray-700 mb-1">W3C Synchronized Multimedia (SMIL)</p>
              <p className="text-gray-700">ISO Prolog Standard ISO/IEC 13211-1:1995</p>
            </div>
            <div>
              <div className="font-bold text-gray-900 mb-1">Modern Context:</div>
              <p className="text-gray-700 mb-1">Web Content Accessibility Guidelines (WCAG) 2.1 and 2.2</p>
              <p className="text-gray-700 mb-1">WAI-ARIA 1.2 Specification</p>
              <p className="text-gray-700">React and Modern JavaScript Framework Accessibility Patterns</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
