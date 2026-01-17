"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailedError = exports.ParseError = void 0;
class ParseError extends Error {
    constructor(message, location, code) {
        super(message);
        this.location = location;
        this.code = code;
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
class ValidationFailedError extends Error {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
        this.name = 'ValidationFailedError';
    }
}
exports.ValidationFailedError = ValidationFailedError;
//# sourceMappingURL=BaseModel.js.map