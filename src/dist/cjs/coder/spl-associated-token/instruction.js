"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenInstructionCoder = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
class SplAssociatedTokenInstructionCoder {
    constructor(_) { }
    encode(ixName, _) {
        switch ((0, camelcase_1.default)(ixName)) {
            case "create": {
                return Buffer.alloc(0);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("SPL associated token does not have state");
    }
}
exports.SplAssociatedTokenInstructionCoder = SplAssociatedTokenInstructionCoder;
//# sourceMappingURL=instruction.js.map