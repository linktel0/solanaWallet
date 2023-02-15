import { Program, Provider } from "../index.js";
import { SplAssociatedToken } from "./associated-token.js";
import { SplToken } from "./token.js";
export { SplToken } from "./token.js";
export declare class Spl {
    static token(provider?: Provider): Program<SplToken>;
    static associatedToken(provider?: Provider): Program<SplAssociatedToken>;
}
//# sourceMappingURL=index.d.ts.map