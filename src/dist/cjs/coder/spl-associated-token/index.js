"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenCoder = void 0;
const instruction_js_1 = require("./instruction.js");
const state_js_1 = require("./state.js");
const accounts_js_1 = require("./accounts.js");
const events_js_1 = require("./events.js");
const types_js_1 = require("./types.js");
/**
 * Coder for the SPL token program.
 */
class SplAssociatedTokenCoder {
    constructor(idl) {
        this.instruction = new instruction_js_1.SplAssociatedTokenInstructionCoder(idl);
        this.accounts = new accounts_js_1.SplAssociatedTokenAccountsCoder(idl);
        this.events = new events_js_1.SplAssociatedTokenEventsCoder(idl);
        this.state = new state_js_1.SplAssociatedTokenStateCoder(idl);
        this.types = new types_js_1.SplAssociatedTokenTypesCoder(idl);
    }
}
exports.SplAssociatedTokenCoder = SplAssociatedTokenCoder;
//# sourceMappingURL=index.js.map