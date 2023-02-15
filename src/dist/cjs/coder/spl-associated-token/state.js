"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenStateCoder = void 0;
class SplAssociatedTokenStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SPL associated token does not have state");
    }
    decode(_ix) {
        throw new Error("SPL associated token does not have state");
    }
}
exports.SplAssociatedTokenStateCoder = SplAssociatedTokenStateCoder;
//# sourceMappingURL=state.js.map