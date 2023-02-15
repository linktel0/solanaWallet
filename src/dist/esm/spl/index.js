import { program as associatedTokenProgram, } from "./associated-token.js";
import { program as tokenProgram } from "./token.js";
export class Spl {
    static token(provider) {
        return tokenProgram(provider);
    }
    static associatedToken(provider) {
        return associatedTokenProgram(provider);
    }
}
//# sourceMappingURL=index.js.map