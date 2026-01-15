# Background: Origins of ActionLanguage

## Historical Context

Paradise's ActionLanguage concept has deep academic roots dating back to 2008 research on accessible adaptive hypermedia. The core ideas were first presented at the W4A (Web for All) conference in Beijing, 2008, in a paper titled "The Carnforth Model of Accessible Adaptive Hypermedia" by Robert Dodd, Dr Steve Green, and Dr. Elaine Pearson from the University of Teesside, UK.

## The Problem: AJAX and Screen Reader Opacity

In 2008, the web was undergoing a transformation with script-intensive pages using AJAX technology. While these applications provided rich, interactive experiences for visual users, they created significant accessibility barriers. As the paper documented:

> "New versions of well-known websites, including for example Google Select, which is an AJAX driven variant of their standard search page, are now largely opaque to screen reading technology such as Jaws."

The fundamental issue: **JavaScript interactions were invisible to screen readers because they existed only in code, not in accessible semantic structures.** Screen readers like JAWS either became mute to dynamic content updates or failed to notice subsequent changes after the first display.

## The CISNA Model

To address these challenges, the research team developed the **CISNA model** (Content, Inventory, Semantics, Navigation, Adaptation) - a five-layer document representation that extends classical hypertext models (Dexter and Amsterdam) with accessibility and adaptation capabilities.

### Evolution from Dexter and Amsterdam Models

The CISNA model builds on two foundational hypertext models:

#### Dexter Hypertext Model (1994)
- Three-layer architecture: Storage Layer, Within-Component Layer, Runtime Layer
- Node-and-link paradigm for hypertext structure
- Components connected by Links (hyperlinks)
- Presentation Specifications providing rendering hints
- CISNA extends this by separating concerns into five independent layers

#### Amsterdam Hypermedia Model (1994)
- Extended Dexter with time-based media (video, audio)
- Synchronization Arcs for temporal relationships
- Channels for presentation grouping
- Foundation for SMIL (Synchronized Multimedia Integration Language)
- CISNA builds on this with semantic meaning and adaptation

#### Multi-Sensory Design Space (Nesbitt, 2001)
- Modeling the multi-sensory design space for cross-modal interaction
- Foundational concepts for adaptation between sensory modalities
- Abstractions for visual, sonic, and haptic representations
- Directly informed CISNA's Adaptation Layer approach
- Enabled reasoning about adapting content between design spaces (visual → sonic for screen readers)

### The Five CISNA Layers

The CISNA model peels the Dexter Runtime Layer apart and reorganizes the Storage and Within-Component layers into five independent but related abstractions:

#### 1. (External) Content Layer
- **All content is external to the model**
- Raw storage of text, images, video, audio
- Includes physical items (tangible interfaces, augmented reality objects)
- No restrictions on what constitutes content
- Separation enables content reuse and alternative storage (databases, web resources)

#### 2. Inventory Layer
- **Indexing service buffering content from semantics**
- Media Elements reference external content with properties (size, resolution, format)
- Formatted Media Elements specify presentation form (fonts, text-to-speech voice)
- Handles transient content (dynamic updates, AJAX responses)
- Associates Anchors with individual inventory elements
- Example: Same bullet-point image used multiple times has one inventory entry

**Key Insight**: The Inventory Layer enables the same content to have multiple semantic meanings. A bullet point image can be both "a bullet point" and "a bullet style option" in different semantic contexts.

#### 3. Semantics Layer
- **Rule-based meta-model capturing meaning**
- Components:
  - **Ontologies**: Domain-specific concept groupings (Container, Coordinate System, Media, Menu)
  - **Nouns**: Named entities within ontologies (Menu, Menu Item, Title, Viewport)
  - **Verbs**: Relationship types (is a, contains, scopes, expands upon, follows)
  - **Rules**: Abstract noun-verb-noun relationships (e.g., "Menu contains Menu Item")
  - **Notions**: Concrete instances of nouns (e.g., "Google Maps" is a Site Title)
  - **Statements**: Concrete notion-verb-notion relationships

**Conditional Multiple Inheritance**: A Menu is sometimes a List, sometimes a Grid (like iPhone top-level menu). This flexibility allows semantic adaptation.

**Graphical Notation**: The paper introduces a visual notation for semantic rules:
- Rectangular boxes = nouns or notions
- Solid arrows = "A is a B" (inheritance)
- Dashed arrows = "A is sometimes a B" (conditional inheritance)
- Labeled arrows = other verbs with multiplicity

#### 4. Navigation Layer
- **Core navigation structure (closest to Dexter Storage Layer)**
- Components:
  - **Nodes**: Something a user can navigate to/from (Dexter's Component)
  - **Edges**: Navigable paths between nodes (Dexter's Link Component)
  - **Views**: Collections of nodes presented contemporaneously
- **Views represent "chunks"**: Web pages, chapters, scrollpanes, any presentation grouping
- Multiple Edges can exist between same nodes (different navigation reasons: "back" button vs hyperlink)
- Node/Edge Attributes handle timing synchronization (multimedia validity periods)

**Critical Concept**: Views are how CISNA supports 1:M Link Components and enable flexible document decomposition beyond rigid page boundaries.

#### 5. Adaptation Layer
- **Instances and triggers for adaptation**
- Instance = transaction of add/modify/delete to other layers
- Instance Application defines order (instances are sequential)
- Event Triggers cause instance realization
- Bridges to ALL other layers

**Passive vs Dynamic Documents**:
- Passive: No new instances during user session (newspaper, static HTML)
- Dynamic: New instances realized during session (JavaScript, onMouseOver, AJAX)

The paper's model addresses passive documents. Dynamic adaptation (Actions, scripting) uses an Adaptivity Subsystem treating procedures as Directed Graphs.

## Bridges and Counterparts

Adjacent layers connect through **bridges** - models expressing relationships:

### Inventory & Semantics Bridge
- Element in Noun
- Element in Notion
- Cue in Notion

Example: Text "Google Maps" maps to notion "Site Title". Multiple elements can map to same notion (different languages, media types like Rebus symbols).

### Semantics & Navigation Bridge
- Notion in Node

Example: Notion "Google Maps" maps to View node "Google Maps Application". Describes **counterparts**: "Notion A exists when we have Node B", not identity.

### Adaptation Bridges
- Connect Adaptation Layer to all other layers
- Each element instance in core layers maps to specific Adaptation Instance
- Example: All "Default User" information maps to "Default" instance
- "Shadow" elements reference instances (like extern in C/C++)

## Abstract User Interface

A key concept in CISNA is the **Abstract User Interface (AUI)** - complete separation of interaction logic from presentation:

The five-layer CISNA model describes content, semantics, and navigation independent of rendering. The Development System creates the abstract model; the Runtime System renders it to concrete form (visual, sonic, haptic). This is analogous to XForms but extends to all aspects of document structure, not just forms.

**Practical Benefit**: By abstracting content from presentation, the same document can adapt between design spaces (visual → sonic for screen readers, visual → haptic for touch interfaces) while preserving semantic meaning.

## Prototype: Google Maps Fragment

The paper presents a fully working Java prototype analyzing a fragment of Google Maps' top menu (Web, Images, Maps, more ▼). The prototype demonstrates:

1. **XML-based notation** for expressing each layer and bridge
2. **FreeTTS text-to-speech** rendering
3. **Two-profile adaptation**: Default User and Low Vision User
4. **Abstract output**: Database table dump showing resolved model
5. **Concrete output**: Visual rendering + spoken text: "Application Google Maps. Menu Start. Item Web. Item Images. Item More. End menu."

The prototype validates that CISNA can express real web interfaces and adapt them between user profiles.

## From Research to Paradise

The original 2008 prototype was built in Java with XML-based notation for each CISNA layer. It used FreeTTS for text-to-speech and demonstrated adaptation between user profiles.

**Paradise represents the modern evolution of these ideas:**

- **ActionLanguage Parsing**: Extracts JavaScript interaction behaviors (Navigation Layer concepts)
- **Multi-Model Architecture**: Separates DOM (Inventory), JavaScript (Navigation), CSS (Presentation), and ARIA (Semantics)
- **Cross-Model Analysis**: Detects when interaction patterns violate accessibility principles
- **Semantic Understanding**: Maps low-level events (click, keydown) to high-level interaction patterns

## Key Insights That Shaped Paradise

### 1. Interactions Are Navigation
JavaScript event handlers aren't just code - they're **navigation mechanisms**. In CISNA terms, event handlers create Edges in the Navigation Layer. A click handler is a navigation path, just like a hyperlink. This perspective allows us to analyze accessibility issues in interaction patterns.

### 2. Separation of Concerns
The CISNA model's five-layer separation directly maps to Paradise's architecture:
- **Content Layer** → External storage (databases, files)
- **Inventory Layer** → DOMModel (element catalog with properties)
- **Semantics Layer** → ARIA Analysis (roles, relationships, meaning)
- **Navigation Layer** → ActionLanguageModel (interaction behaviors)
- **Adaptation Layer** → Confidence scoring, progressive analysis

### 3. Accessibility Through Abstraction
By abstracting JavaScript into ActionLanguage nodes, we can:
- Detect patterns (mouse-only clicks, focus traps, ARIA mismatches)
- Generate fixes that preserve semantics
- Adapt interactions to alternative modalities
- Reason about accessibility independently of presentation

### 4. Bridges Enable Cross-Model Analysis
CISNA's bridges between layers inspired Paradise's cross-model analysis:
- Link DOM elements to JavaScript handlers (Inventory ↔ Navigation)
- Link JavaScript behaviors to semantic meaning (Navigation ↔ Semantics)
- Detect mismatches (handler without element, element without ARIA)

### 5. Instances as Adaptation Mechanism
CISNA's Instance concept (add/modify/delete transactions) inspired Paradise's approach to fixes:
- Express accessibility fixes as transformations
- Track what changes are needed for different user needs
- Potentially measure accessibility as "distance" between instances (Levenshtein Distance)

## Technical Contributions

The CISNA paper made several technical contributions relevant to Paradise:

### Validatable Models
Rules in Semantics Layer can be validated like XML with DTDs:
- Statements must reference valid Rules
- Notions must inherit from Nouns with matching attributes
- Multiplicity in Statements must be stricter than Rules
- No duplicate attributes allowed

### Graphical Notation
Simple, drawable semantic notation with rectangular boxes (nouns), arrows (relationships), and rounded boxes (attributes). Designed for hand-drawing and tool validation.

### Transient Content Handling
CISNA explicitly models transient content (AJAX updates, dynamic changes) as Media Elements with validity periods. Critical for assistive technology synchronization.

### Text Granularity Definition
Working definition for text Media Elements:
> "The largest block of text content possible that contains within it no semantic detail of interest to the Semantics Layer"

This informs Paradise's approach to text node analysis.

## Modern Relevance

While the web has evolved significantly since 2008 (React, TypeScript, modern frameworks), the core problems remain:

### The Problems Persist

- **Opacity of JavaScript interactions**: Screen readers still struggle with complex JavaScript behaviors
- **AJAX and dynamic content**: Still largely opaque to assistive technology
- **Semantic gap**: Gap between visual interaction and assistive technology perception
- **Script-intensive pages**: Modern SPAs create same issues as 2008 AJAX sites
- **Mobile device accessibility**: Small screens + complex interactions = accessibility challenges

### Paradise Addresses These Challenges

1. **Parsing modern JavaScript/TypeScript/JSX**: Babel-based AST analysis for contemporary frameworks
2. **Multi-model understanding**: Combining DOM, JavaScript, CSS, and ARIA (CISNA layers)
3. **Pattern detection**: Identifying accessibility anti-patterns automatically
4. **Actionable fixes**: Generating concrete remediation guidance
5. **Cross-file analysis**: Understanding split handlers and navigation patterns

## Academic Impact and Future Work

### Measuring Accessibility
The paper proposes measuring accessibility as the "distance" between user profiles using Levenshtein Distance on XML representations. This could provide formal, quantitative accessibility metrics.

### Dynamic Adaptation
The full CISNA model includes an Adaptivity Subsystem treating Actions (procedures/scripts) as Directed Graphs. Since Shlaer-Mellor Information Models express Directed Graphs, Actions can be expressed in the same notation. **This is ongoing work** that could enable Paradise to reason about dynamic JavaScript behaviors.

### Formal Language of Accessibility
By expressing user interface differences precisely in abstract terms (content, semantics, navigation changes), CISNA provides "one small step on the road to creating a formal language of accessibility."

## Conclusion

Paradise isn't just a linter - it's the practical implementation of 15+ years of research on accessible adaptive hypermedia. The ActionLanguage concept, first formalized in the CISNA model in 2008, provides the theoretical foundation for understanding JavaScript interactions as navigational behaviors that must be accessible to all users.

**The Carnforth Model demonstrated**:
- JavaScript interactions can be abstracted as Navigation Layer edges
- Semantic meaning can be separated from presentation
- Content adaptation can be expressed as transactions (instances)
- Accessibility differences can be formally modeled

**Paradise extends these ideas**:
- Babel AST parsing replaces XML notation for modern web
- File-based analysis scales to real projects
- Cross-model pattern detection catches accessibility issues
- Confidence scoring handles incomplete information

By standing on these academic foundations, Paradise can provide more than syntax checking - it understands the **semantics** of web interactions and can detect when those semantics are inaccessible.

---

## References

**Primary Source:**
- Dodd, R., Green, S., & Pearson, E. (2008). "The Carnforth Model of Accessible Adaptive Hypermedia." *Proceedings of the 2008 International Cross-Disciplinary Conference on Web Accessibility (W4A)*, Beijing, China.

**Foundational Models:**
- Halasz, F., & Schwartz, M. (1994). "The Dexter Hypertext Reference Model." *Communications of the ACM*, 37(2), 30-39.
- Hardman, L., Bulterman, D. C. A., & van Rossum, G. (1994). "The Amsterdam Hypermedia Model: Adding Time and Context to the Dexter Model." *Communications of the ACM*, 37(2), 50-62.
- Nesbitt, K. V. (2001). "Modeling the Multi-Sensory Design Space." In *Australian symposium on Information visualization, Volume 9 (CRPITS'01)*. Australian Computer Society.

**Related Standards:**
- W3C HTML 5 Working Draft (2008)
- W3C XForms Specification Version 1.0 (2006)
- W3C Synchronized Multimedia (SMIL)
- ISO Prolog Standard ISO/IEC 13211-1:1995

**Modern Context:**
- Web Content Accessibility Guidelines (WCAG) 2.1 and 2.2
- WAI-ARIA 1.2 Specification
- React and Modern JavaScript Framework Accessibility Patterns
