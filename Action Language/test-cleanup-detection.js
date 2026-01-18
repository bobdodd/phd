const { ReactActionLanguageExtractor } = require('./dist/parsers/ReactActionLanguageExtractor');

const withoutCleanup = `import React, { useEffect, useRef } from 'react';

function SearchInput({ isVisible }) {
  const inputRef = useRef();

  useEffect(() => {
    if (isVisible) {
      inputRef.current?.focus();
    }
  }, [isVisible]);

  return <input ref={inputRef} />;
}`;

const withCleanup = `import React, { useEffect, useRef } from 'react';

function Dialog({ isOpen }) {
  const closeButtonRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement;
      closeButtonRef.current?.focus();

      return () => {
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);

  return <button ref={closeButtonRef}>Close</button>;
}`;

const extractor = new ReactActionLanguageExtractor();

console.log('=== WITHOUT CLEANUP ===');
const model1 = extractor.parse(withoutCleanup, 'SearchInput.tsx');
console.log('Nodes:', model1.nodes.length);
model1.nodes.forEach(node => {
  console.log('- hasCleanup:', node.metadata?.hasCleanup);
});

console.log('\n=== WITH CLEANUP ===');
const model2 = extractor.parse(withCleanup, 'Dialog.tsx');
console.log('Nodes:', model2.nodes.length);
model2.nodes.forEach(node => {
  console.log('- hasCleanup:', node.metadata?.hasCleanup);
});
