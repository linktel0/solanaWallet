"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenTypesCoder = void 0;
class SplAssociatedTokenTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("SPL associated token does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("SPL associated token does not have user-defined types");
    }
}
exports.SplAssociatedTokenTypesCoder = SplAssociatedTokenTypesCoder;
//# sourceMappingURL=types.js.map