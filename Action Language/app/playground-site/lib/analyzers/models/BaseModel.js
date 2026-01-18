"use strict";
/**
 * Base Model Interface for Paradise Multi-Model Architecture
 *
 * This file defines the foundational interfaces for all model types in Paradise.
 * Models represent different aspects of UI code (DOM, ActionLanguage, CSS, etc.)
 * in a unified way that enables cross-model accessibility analysis.
 *
 * Key concepts:
 * - All models share a common interface (Model)
 * - All nodes within models share common properties (ModelNode)
 * - Source locations are preserved for precise error reporting
 * - Models can validate themselves and serialize back to source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailedError = exports.ParseError = void 0;
/**
 * Error thrown when model parsing fails.
 */
class ParseError extends Error {
    constructor(message, location, code) {
        super(message);
        this.location = location;
        this.code = code;
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
/**
 * Error thrown when model validation fails.
 */
class ValidationFailedError extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
        this.name = 'ValidationFailedError';
    }
}
exports.ValidationFailedError = ValidationFailedError;
