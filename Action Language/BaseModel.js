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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationFailedError = exports.ParseError = void 0;
/**
 * Error thrown when model parsing fails.
 */
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError(message, location, code) {
        var _this = _super.call(this, message) || this;
        _this.location = location;
        _this.code = code;
        _this.name = 'ParseError';
        return _this;
    }
    return ParseError;
}(Error));
exports.ParseError = ParseError;
/**
 * Error thrown when model validation fails.
 */
var ValidationFailedError = /** @class */ (function (_super) {
    __extends(ValidationFailedError, _super);
    function ValidationFailedError(message, errors) {
        var _this = _super.call(this, message) || this;
        _this.errors = errors;
        _this.name = 'ValidationFailedError';
        return _this;
    }
    return ValidationFailedError;
}(Error));
exports.ValidationFailedError = ValidationFailedError;
//# sourceMappingURL=BaseModel.js.map