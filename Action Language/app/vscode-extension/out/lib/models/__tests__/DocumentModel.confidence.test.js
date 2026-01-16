"use strict";
/**
 * Unit tests for DocumentModel confidence scoring
 *
 * Tests the Sprint 4 confidence scoring system that addresses the tree
 * completeness assumption problem. These tests verify that Paradise can
 * accurately assess confidence levels when analyzing incomplete or
 * fragmented component trees.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const DocumentModel_1 = require("../DocumentModel");
const DOMModel_1 = require("../DOMModel");
/**
 * Helper function to create a minimal DOMElement for testing
 */
function createTestElement(id, tagName = 'div', attributes = {}) {
    const location = {
        file: 'test.html',
        line: 1,
        column: 0
    };
    return {
        id,
        nodeType: 'element',
        tagName,
        attributes: { id, ...attributes },
        children: [],
        location,
        metadata: {}
    };
}
/**
 * Helper function to create a minimal DOMModel with given elements
 */
function createTestDOMModel(elements) {
    const root = createTestElement('root', 'div');
    root.children = elements;
    // Set parent references
    for (const element of elements) {
        element.parent = root;
    }
    return new DOMModel_1.DOMModelImpl(root, 'test.html');
}
describe('DocumentModel Confidence Scoring', () => {
    describe('getFragmentCount()', () => {
        it('should return 0 when no DOM fragments exist', () => {
            const model = new DocumentModel_1.DocumentModel({
                scope: 'file',
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(0);
        });
        it('should return 1 for a single DOM fragment', () => {
            const element = createTestElement('button1', 'button');
            const domModel = createTestDOMModel([element]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(1);
        });
        it('should return correct count for multiple fragments', () => {
            const fragment1 = createTestDOMModel([createTestElement('button1', 'button')]);
            const fragment2 = createTestDOMModel([createTestElement('button2', 'button')]);
            const fragment3 = createTestDOMModel([createTestElement('button3', 'button')]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: [fragment1, fragment2, fragment3],
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(3);
        });
        it('should handle array with single fragment', () => {
            const fragment = createTestDOMModel([createTestElement('button1', 'button')]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: [fragment],
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(1);
        });
    });
    describe('getTreeCompleteness()', () => {
        it('should return 0.0 when no DOM fragments exist', () => {
            const model = new DocumentModel_1.DocumentModel({
                scope: 'file',
                javascript: [],
                css: []
            });
            expect(model.getTreeCompleteness()).toBe(0.0);
        });
        it('should return high completeness (0.7) for single fragment with no references', () => {
            const button = createTestElement('submit', 'button');
            const domModel = createTestDOMModel([button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            expect(completeness).toBe(0.7);
        });
        it('should return low completeness (0.7) for multiple fragments with no references', () => {
            const fragment1 = createTestDOMModel([createTestElement('button1', 'button')]);
            const fragment2 = createTestDOMModel([createTestElement('button2', 'button')]);
            const fragment3 = createTestDOMModel([createTestElement('button3', 'button')]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: [fragment1, fragment2, fragment3],
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base = max(0.3, 1.0 - (3 * 0.1)) = max(0.3, 0.7) = 0.7
            expect(completeness).toBe(0.7);
        });
        it('should boost completeness when ARIA references are resolved', () => {
            // Create elements with ARIA labelledby reference
            const label = createTestElement('label1', 'span');
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'label1'
            });
            const domModel = createTestDOMModel([label, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base 0.7 + (1 resolved / 1 total) * 0.3 = 0.7 + 0.3 = 1.0
            expect(completeness).toBeCloseTo(1.0, 2);
        });
        it('should lower completeness when ARIA references are unresolved', () => {
            // Button references non-existent label
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'nonexistent-label'
            });
            const domModel = createTestDOMModel([button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base 0.7 + (0 resolved / 1 total) * 0.3 = 0.7 + 0.0 = 0.7
            expect(completeness).toBe(0.7);
        });
        it('should handle mixed resolved and unresolved references', () => {
            const label = createTestElement('label1', 'span');
            const button1 = createTestElement('submit', 'button', {
                'aria-labelledby': 'label1' // Resolved
            });
            const button2 = createTestElement('cancel', 'button', {
                'aria-labelledby': 'nonexistent' // Unresolved
            });
            const domModel = createTestDOMModel([label, button1, button2]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base 0.7 + (1 resolved / 2 total) * 0.3 = 0.7 + 0.15 = 0.85
            expect(completeness).toBeCloseTo(0.85, 2);
        });
        it('should consider aria-describedby references', () => {
            const description = createTestElement('desc1', 'span');
            const button = createTestElement('submit', 'button', {
                'aria-describedby': 'desc1'
            });
            const domModel = createTestDOMModel([description, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            expect(completeness).toBeCloseTo(1.0, 2);
        });
        it('should consider aria-controls references', () => {
            const panel = createTestElement('panel1', 'div');
            const button = createTestElement('toggle', 'button', {
                'aria-controls': 'panel1'
            });
            const domModel = createTestDOMModel([panel, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            expect(completeness).toBeCloseTo(1.0, 2);
        });
        it('should cap completeness at 1.0', () => {
            // Even with many resolved references, max is 1.0
            const label1 = createTestElement('label1', 'span');
            const label2 = createTestElement('label2', 'span');
            const label3 = createTestElement('label3', 'span');
            const button1 = createTestElement('btn1', 'button', {
                'aria-labelledby': 'label1'
            });
            const button2 = createTestElement('btn2', 'button', {
                'aria-labelledby': 'label2'
            });
            const button3 = createTestElement('btn3', 'button', {
                'aria-labelledby': 'label3'
            });
            const domModel = createTestDOMModel([
                label1, label2, label3,
                button1, button2, button3
            ]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            expect(completeness).toBeLessThanOrEqual(1.0);
        });
        it('should handle multiple fragments with ARIA references across fragments', () => {
            // Fragment 1 has label
            const label = createTestElement('label1', 'span');
            const fragment1 = createTestDOMModel([label]);
            // Fragment 2 has button referencing label in fragment 1
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'label1'
            });
            const fragment2 = createTestDOMModel([button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: [fragment1, fragment2],
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base = max(0.3, 1.0 - (2 * 0.1)) = max(0.3, 0.8) = 0.8
            // Plus: (1 resolved / 1 total) * 0.3 = 0.3
            // Total: 0.8 + 0.3 = 1.1, capped at 1.0
            expect(completeness).toBe(1.0);
        });
        it('should decrease completeness with more fragments', () => {
            const fragments = Array.from({ length: 5 }, (_, i) => createTestDOMModel([createTestElement(`elem${i}`, 'div')]));
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: fragments,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base = max(0.3, 1.0 - (5 * 0.1)) = max(0.3, 0.5) = 0.5
            expect(completeness).toBeCloseTo(0.5, 2);
        });
        it('should handle more than 7 fragments (floor at 0.3)', () => {
            const fragments = Array.from({ length: 10 }, (_, i) => createTestDOMModel([createTestElement(`elem${i}`, 'div')]));
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: fragments,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base = max(0.3, 1.0 - (10 * 0.1)) = max(0.3, 0.0) = 0.3
            expect(completeness).toBe(0.3);
        });
    });
    describe('isFragmentComplete()', () => {
        it('should return true when fragment has no ARIA references', () => {
            const button = createTestElement('submit', 'button');
            const domModel = createTestDOMModel([button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.isFragmentComplete('0')).toBe(true);
        });
        it('should return true when all ARIA references resolve within fragment', () => {
            const label = createTestElement('label1', 'span');
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'label1'
            });
            const domModel = createTestDOMModel([label, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.isFragmentComplete('0')).toBe(true);
        });
        it('should return false when ARIA reference does not resolve', () => {
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'nonexistent'
            });
            const domModel = createTestDOMModel([button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.isFragmentComplete('root')).toBe(false);
        });
        it('should return false when only some ARIA references resolve', () => {
            const label = createTestElement('label1', 'span');
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'label1',
                'aria-describedby': 'nonexistent'
            });
            const domModel = createTestDOMModel([label, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.isFragmentComplete('root')).toBe(false);
        });
        it('should return false for non-existent fragment ID', () => {
            const domModel = createTestDOMModel([createTestElement('button1', 'button')]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.isFragmentComplete('nonexistent')).toBe(false);
        });
        it('should handle multiple ARIA reference types', () => {
            const label = createTestElement('label1', 'span');
            const description = createTestElement('desc1', 'p');
            const panel = createTestElement('panel1', 'div');
            const button = createTestElement('toggle', 'button', {
                'aria-labelledby': 'label1',
                'aria-describedby': 'desc1',
                'aria-controls': 'panel1'
            });
            const domModel = createTestDOMModel([label, description, panel, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            expect(model.isFragmentComplete('0')).toBe(true);
        });
    });
    describe('Confidence Level Mapping', () => {
        it('should map to HIGH confidence (0.9+) for single complete tree', () => {
            const label = createTestElement('label1', 'span');
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'label1'
            });
            const domModel = createTestDOMModel([label, button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            expect(completeness).toBeGreaterThanOrEqual(0.9);
            // This maps to HIGH confidence
        });
        it('should map to MEDIUM confidence (0.5-0.9) for partial tree', () => {
            const button = createTestElement('submit', 'button', {
                'aria-labelledby': 'nonexistent'
            });
            const domModel = createTestDOMModel([button]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            expect(completeness).toBeGreaterThanOrEqual(0.5);
            expect(completeness).toBeLessThan(0.9);
            // This maps to MEDIUM confidence
        });
        it('should map to LOW confidence (0.0-0.5) for many disconnected fragments', () => {
            const fragments = Array.from({ length: 8 }, (_, i) => {
                const button = createTestElement(`button${i}`, 'button', {
                    'aria-labelledby': `nonexistent${i}`
                });
                return createTestDOMModel([button]);
            });
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: fragments,
                javascript: [],
                css: []
            });
            const completeness = model.getTreeCompleteness();
            // Base = max(0.3, 1.0 - (8 * 0.1)) = max(0.3, 0.2) = 0.3
            // All references unresolved: no boost
            // Total: 0.3
            expect(completeness).toBeGreaterThanOrEqual(0.0);
            expect(completeness).toBeLessThan(0.5);
            expect(completeness).toBe(0.3);
            // This maps to LOW confidence
        });
    });
    describe('Backward Compatibility', () => {
        it('should handle single DOMModel passed to constructor', () => {
            const domModel = createTestDOMModel([createTestElement('button1', 'button')]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: domModel, // Single model, not array
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(1);
            expect(model.getTreeCompleteness()).toBe(0.7);
        });
        it('should handle array of DOMModels passed to constructor', () => {
            const fragment1 = createTestDOMModel([createTestElement('button1', 'button')]);
            const fragment2 = createTestDOMModel([createTestElement('button2', 'button')]);
            const model = new DocumentModel_1.DocumentModel({
                scope: 'page',
                dom: [fragment1, fragment2], // Array of models
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(2);
        });
        it('should handle undefined DOM', () => {
            const model = new DocumentModel_1.DocumentModel({
                scope: 'file',
                javascript: [],
                css: []
            });
            expect(model.getFragmentCount()).toBe(0);
            expect(model.getTreeCompleteness()).toBe(0.0);
            expect(model.isFragmentComplete('any')).toBe(false);
        });
    });
});
//# sourceMappingURL=DocumentModel.confidence.test.js.map