import { Idl } from "../../idl.js";
import { Coder } from "../index.js";
import { SplAssociatedTokenInstructionCoder } from "./instruction.js";
import { SplAssociatedTokenStateCoder } from "./state.js";
import { SplAssociatedTokenAccountsCoder } from "./accounts.js";
import { SplAssociatedTokenEventsCoder } from "./events.js";
import { SplAssociatedTokenTypesCoder } from "./types.js";
/**
 * Coder for the SPL token program.
 */
export declare class SplAssociatedTokenCoder implements Coder {
    readonly instruction: SplAssociatedTokenInstructionCoder;
    readonly accounts: SplAssociatedTokenAccountsCoder;
    readonly state: SplAssociatedTokenStateCoder;
    readonly events: SplAssociatedTokenEventsCoder;
    readonly types: SplAssociatedTokenTypesCoder;
    constructor(idl: Idl);
}
//# sourceMappingURL=index.d.ts.map