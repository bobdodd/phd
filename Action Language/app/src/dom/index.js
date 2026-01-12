/**
 * DOM Simulation Module
 *
 * Provides mock DOM objects for accessibility analysis:
 * - MockElement: Simulates DOM elements with full tracking
 * - MockDocument: Simulates document with queries and focus tracking
 * - MockWindow: Simulates window with timers and events
 */

const MockElement = require('./MockElement');
const MockDocument = require('./MockDocument');
const MockWindow = require('./MockWindow');

/**
 * Create a complete DOM environment for execution
 * @returns {{ window: MockWindow, document: MockDocument }}
 */
function createDOMEnvironment() {
  const window = new MockWindow();
  return {
    window,
    document: window.document
  };
}

module.exports = {
  MockElement,
  MockDocument,
  MockWindow,
  createDOMEnvironment
};
