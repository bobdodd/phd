export default function UnderstandingDisabilityModels() {
  return (
    <article className="prose prose-lg max-w-none">
      {/* What You'll Learn */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
        <ul className="space-y-2 text-lg">
          <li>The difference between medical and social models of disability</li>
          <li>Identity-first vs. person-first language and why it matters</li>
          <li>How disability represents human diversity, not deficiency</li>
          <li>The concept of intersectionality in disability</li>
          <li>How these models affect your approach to accessibility</li>
        </ul>
      </section>

      {/* Why This Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why This Matters</h2>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r mb-6">
          <p className="text-lg text-blue-900 mb-0">
            <strong>Your mindset shapes your code.</strong> If you view disability as something to "fix" in users, you'll build
            differently than if you view it as barriers in your design that need removing. Understanding disability models is the
            foundation for genuine accessibility work.
          </p>
        </div>
        <p className="text-lg text-gray-700">
          Many developers jump straight to WCAG checklists without understanding <em>why</em> accessibility matters or
          <em>who</em> they're building for. This leads to checkbox compliance rather than inclusive design. Starting with
          disability models gives you the context to make better decisions throughout your career.
        </p>
      </section>

      {/* The Problem */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem: Outdated Views of Disability</h2>
        <p className="text-lg text-gray-700 mb-6">
          Historically, society has viewed disability through a <strong>medical model</strong>—treating disability as a defect
          in the person that needs to be cured or fixed. This mindset still affects how many people approach accessibility:
        </p>

        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-red-900 mb-3">Medical Model Thinking (Problematic):</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">✗</span>
              <span>"Blind people can't use websites" (blames the person)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">✗</span>
              <span>"Accessibility is for disabled people" (creates an "us vs. them" divide)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">✗</span>
              <span>"We need to accommodate their limitations" (focuses on deficits)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">✗</span>
              <span>"Most users don't need this" (dismisses disability as edge case)</span>
            </li>
          </ul>
        </div>

        <p className="text-lg text-gray-700">
          This model places responsibility on disabled individuals to adapt to inaccessible environments. It's fundamentally
          incompatible with good web development.
        </p>
      </section>

      {/* The Solution */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">The Solution: Social Model of Disability</h2>
        <p className="text-lg text-gray-700 mb-6">
          The <strong>social model</strong> shifts the focus from the individual to the environment. Disability is not
          something people <em>have</em>—it's something that happens when society creates barriers.
        </p>

        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-green-900 mb-3">Social Model Thinking (Better):</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span>"Our website doesn't work with screen readers" (responsibility is ours)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span>"Accessibility benefits everyone" (universal design)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span>"We need to remove barriers in our design" (focuses on solutions)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <span>"Everyone encounters disability" (temporary, situational, permanent)</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-700 p-6 rounded-r">
          <p className="text-blue-900 mb-0">
            <strong>For developers:</strong> This means you're not "accommodating" users with disabilities—you're removing
            barriers you created. Your <code className="bg-blue-200 px-2 py-1 rounded text-sm">div onClick</code> isn't
            accessible because <em>you chose a non-semantic element</em>, not because screen reader users have limitations.
          </p>
        </div>
      </section>

      {/* Language Matters */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Language Matters: Identity-First vs. Person-First</h2>
        <p className="text-lg text-gray-700 mb-6">
          There's an ongoing discussion in the disability community about language. Both approaches are valid, and preferences
          vary by individual and community:
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-purple-300 rounded-lg p-6 bg-purple-50">
            <h3 className="text-xl font-semibold text-purple-900 mb-3">Person-First Language</h3>
            <p className="text-gray-700 mb-3">
              Emphasizes the person before their disability: "person with a disability", "person who uses a wheelchair"
            </p>
            <p className="text-sm text-purple-800">
              <strong>Often preferred by:</strong> People with intellectual disabilities, medical professionals, many older
              organizations
            </p>
          </div>

          <div className="border-2 border-indigo-300 rounded-lg p-6 bg-indigo-50">
            <h3 className="text-xl font-semibold text-indigo-900 mb-3">Identity-First Language</h3>
            <p className="text-gray-700 mb-3">
              Embraces disability as part of identity: "disabled person", "blind person", "autistic person"
            </p>
            <p className="text-sm text-indigo-800">
              <strong>Often preferred by:</strong> Deaf community, blind community, autistic community, disability rights
              activists
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r mb-6">
          <h4 className="font-semibold text-yellow-900 mb-2">What should you use in documentation?</h4>
          <p className="text-yellow-800 mb-3">
            When writing about accessibility, use both approaches or follow the preferences of the communities you're discussing.
            In general documentation, "disabled people" or "people with disabilities" are both acceptable. The key is:
          </p>
          <ul className="space-y-2 text-yellow-800 ml-6">
            <li>• Avoid euphemisms like "differently abled" or "special needs"</li>
            <li>• Don't use "suffers from" or "afflicted with"</li>
            <li>• Don't use outdated terms like "handicapped"</li>
            <li>• When possible, be specific: "screen reader users" not "the disabled"</li>
          </ul>
        </div>
      </section>

      {/* Disability as Diversity */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Disability as Human Diversity</h2>
        <p className="text-lg text-gray-700 mb-6">
          Just as humans vary in height, language, culture, and background, we also vary in ability. Disability is part of human
          diversity—not a defect, not abnormal, but a natural variation in the human experience.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Permanent</h4>
            <p className="text-sm text-gray-700">
              Born without sight, lifelong mobility impairment, genetic conditions
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2">Temporary</h4>
            <p className="text-sm text-gray-700">Broken arm, eye surgery recovery, concussion, ear infection</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Situational</h4>
            <p className="text-sm text-gray-700">Bright sunlight, noisy environment, holding a baby, wearing gloves</p>
          </div>
        </div>

        <p className="text-lg text-gray-700">
          When you build accessible websites, you're designing for human diversity. Everyone benefits from clear language, good
          contrast, keyboard navigation, and semantic structure.
        </p>
      </section>

      {/* Intersectionality */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Intersectionality of Disability</h2>
        <p className="text-lg text-gray-700 mb-6">
          Disability doesn't exist in isolation. People have multiple, intersecting identities—race, gender, age, language,
          socioeconomic status—that affect their experiences with both disability and technology.
        </p>

        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-purple-900 mb-3">Consider these overlapping factors:</h4>
          <ul className="space-y-2 text-gray-700 ml-6">
            <li>• A blind person who doesn't speak English navigating an English-only screen reader</li>
            <li>• An elderly person with arthritis who also has limited tech literacy</li>
            <li>• A deaf person from a culture where sign language is their primary language</li>
            <li>• Someone with ADHD who also has dyslexia</li>
            <li>• A wheelchair user in a country with limited access to assistive technology</li>
          </ul>
        </div>

        <p className="text-lg text-gray-700">
          Good accessibility considers these intersections. Don't assume all screen reader users are tech-savvy, or that everyone
          has the latest assistive technology, or that English is everyone's first language.
        </p>
      </section>

      {/* Impact on Development */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How This Affects Your Development Work</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded-r">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">1. Take Responsibility for Barriers</h3>
            <p className="text-gray-700">
              When you write <code className="bg-blue-200 px-2 py-1 rounded text-sm">onClick</code> on a div, you created a
              barrier. When you skip alt text, you created a barrier. Own it, fix it, learn from it.
            </p>
          </div>

          <div className="border-l-4 border-green-600 pl-6 py-4 bg-green-50 rounded-r">
            <h3 className="text-xl font-semibold text-green-900 mb-2">2. Design for Diversity from the Start</h3>
            <p className="text-gray-700">
              Don't treat accessibility as retrofitting for "special users." Build flexible interfaces that work for many input
              methods, many output methods, many cognitive approaches.
            </p>
          </div>

          <div className="border-l-4 border-purple-600 pl-6 py-4 bg-purple-50 rounded-r">
            <h3 className="text-xl font-semibold text-purple-900 mb-2">3. Use Respectful Language</h3>
            <p className="text-gray-700">
              In your commit messages, documentation, and comments, avoid language that pathologizes disability. Say "keyboard
              users" not "people who can't use a mouse."
            </p>
          </div>

          <div className="border-l-4 border-orange-600 pl-6 py-4 bg-orange-50 rounded-r">
            <h3 className="text-xl font-semibold text-orange-900 mb-2">4. Remember: This Is About People</h3>
            <p className="text-gray-700">
              Behind every WCAG success criterion is a real person trying to use your website. Every time you implement ARIA
              correctly, you're helping someone navigate their world.
            </p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Social model over medical model:</strong> Disability is created by barriers in our design, not
                limitations in people
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Language matters:</strong> Use respectful, current terminology and avoid euphemisms or outdated terms
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Disability is diversity:</strong> Everyone encounters disability—permanent, temporary, or situational
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>Intersectionality exists:</strong> Consider overlapping identities and varying contexts when designing
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✓</span>
              <span>
                <strong>You're responsible:</strong> Take ownership of accessibility barriers you create through code choices
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Next Steps</h2>
        <p className="text-lg text-gray-700 mb-6">
          Now that you understand the foundation, you're ready to learn about specific disabilities and how people use assistive
          technology to interact with the web.
        </p>
        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Recommended next modules:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Module 2: Visual Disabilities</strong> - Learn about blindness, low vision, and color blindness</li>
            <li>• <strong>Module 10: Screen Readers Deep Dive</strong> - Understand how screen readers work</li>
            <li>• <strong>Module 13: WCAG 2.2 Overview</strong> - Start learning the standards</li>
          </ul>
        </div>
      </section>
    </article>
  );
}
