const { ReactActionLanguageExtractor } = require('./dist/parsers/ReactActionLanguageExtractor');

const testCode = `import React, { useEffect, useRef } from 'react';

function Dialog({ isOpen }) {
  const closeButtonRef = useRef();

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();

      return () => {
        document.activeElement?.blur();
      };
    }
  }, [isOpen]);

  return <div><button ref={closeButtonRef}>Close</button></div>;
}`;

console.log('Testing ReactActionLanguageExtractor...\n');

const extractor = new ReactActionLanguageExtractor();
const model = extractor.parse(testCode, 'test.tsx');

console.log('Total nodes extracted:', model.nodes.length);
console.log('\nNodes:');
model.nodes.forEach((node, i) => {
  console.log(`\n${i + 1}. ${node.actionType}`);
  console.log('   Framework:', node.metadata?.framework);
  console.log('   Hook:', node.metadata?.hook);
  console.log('   Ref:', node.metadata?.refName);
  console.log('   Element:', node.element);
});
