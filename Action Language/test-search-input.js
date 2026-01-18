const { ReactActionLanguageExtractor } = require('./dist/parsers/ReactActionLanguageExtractor');

const testCode = `import React, { useEffect, useRef } from 'react';

function SearchInput({ isVisible }) {
  const inputRef = useRef();

  useEffect(() => {
    if (isVisible) {
      // ISSUE: Focus without cleanup - where does focus go when hidden?
      inputRef.current?.focus();
    }
    // Missing: return () => { previousFocus?.focus(); }
  }, [isVisible]);

  return (
    <input
      ref={inputRef}
      type="search"
      placeholder="Search..."
      aria-label="Search"
    />
  );
}

export default SearchInput;`;

console.log('Testing SearchInput example...\n');

const extractor = new ReactActionLanguageExtractor();
const model = extractor.parse(testCode, 'SearchInput.tsx');

console.log('Total nodes extracted:', model.nodes.length);
console.log('\nNodes:');
model.nodes.forEach((node, i) => {
  console.log(`\n${i + 1}. ${node.actionType}`);
  console.log('   Framework:', node.metadata?.framework);
  console.log('   Hook:', node.metadata?.hook);
  console.log('   Ref:', node.metadata?.refName);
  console.log('   Element:', node.element);
});
