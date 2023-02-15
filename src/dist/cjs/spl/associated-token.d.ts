import { Program } from "../program/index.js";
import Provider from "../provider.js";
import { SplAssociatedTokenCoder } from "../coder/spl-associated-token/index.js";
export declare function program(provider?: Provider): Program<SplAssociatedToken>;
export declare function coder(): SplAssociatedTokenCoder;
/**
 * SplAssociatedToken IDL.
 */
export declare type SplAssociatedToken = {
    version: "0.1.0";
    name: "spl_associated_token";
    instructions: [
        {
            name: "create";
            accounts: [
                {
                    name: "authority";
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: "associatedAccount";
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: "owner";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "mint";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "systemProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "tokenProgram";
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: "rent";
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [];
        }
    ];
};
export declare const IDL: SplAssociatedToken;
//# sourceMappingURL=associated-token.d.ts.map