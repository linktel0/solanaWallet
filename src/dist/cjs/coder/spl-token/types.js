"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplTokenTypesCoder = void 0;
class SplTokenTypesCoder {
    constructor(_idl) { }
    encode(_name, _type) {
        throw new Error("SPL token does not have user-defined types");
    }
    decode(_name, _typeData) {
        throw new Error("SPL token does not have user-defined types");
    }
}
exports.SplTokenTypesCoder = SplTokenTypesCoder;
//# sourceMappingURL=types.js.map