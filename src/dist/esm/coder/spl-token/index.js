import { SplTokenInstructionCoder } from "./instruction.js";
import { SplTokenStateCoder } from "./state.js";
import { SplTokenAccountsCoder } from "./accounts.js";
import { SplTokenEventsCoder } from "./events.js";
import { SplTokenTypesCoder } from "./types.js";
/**
 * Coder for the SPL token program.
 */
export class SplTokenCoder {
    constructor(idl) {
        this.instruction = new SplTokenInstructionCoder(idl);
        this.accounts = new SplTokenAccountsCoder(idl);
        this.events = new SplTokenEventsCoder(idl);
        this.state = new SplTokenStateCoder(idl);
        this.types = new SplTokenTypesCoder(idl);
    }
}
//# sourceMappingURL=index.js.map