"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplTokenCoder = void 0;
const instruction_js_1 = require("./instruction.js");
const state_js_1 = require("./state.js");
const accounts_js_1 = require("./accounts.js");
const events_js_1 = require("./events.js");
const types_js_1 = require("./types.js");
/**
 * Coder for the SPL token program.
 */
class SplTokenCoder {
    constructor(idl) {
        this.instruction = new instruction_js_1.SplTokenInstructionCoder(idl);
        this.accounts = new accounts_js_1.SplTokenAccountsCoder(idl);
        this.events = new events_js_1.SplTokenEventsCoder(idl);
        this.state = new state_js_1.SplTokenStateCoder(idl);
        this.types = new types_js_1.SplTokenTypesCoder(idl);
    }
}
exports.SplTokenCoder = SplTokenCoder;
//# sourceMappingURL=index.js.map