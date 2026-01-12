/**
 * Test Runner - Runs all test files
 */

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'Action.test.js',
  'ActionTree.test.js',
  'XMLSerializer.test.js',
  'Stack.test.js',
  'Parser.test.js',
  'ExecutionEngine.test.js',
  'dom.test.js'
];

console.log('╔══════════════════════════════════════════╗');
console.log('║   ActionLanguage Transcoder Test Suite   ║');
console.log('╚══════════════════════════════════════════╝\n');

let allPassed = true;

for (const testFile of testFiles) {
  try {
    const testPath = path.join(__dirname, testFile);
    execSync(`node "${testPath}"`, { stdio: 'inherit' });
    console.log('');
  } catch (error) {
    allPassed = false;
    console.log(`\n⚠ Test file ${testFile} had failures\n`);
  }
}

console.log('═'.repeat(44));
if (allPassed) {
  console.log('✓ All test suites passed!');
  process.exit(0);
} else {
  console.log('✗ Some tests failed');
  process.exit(1);
}
