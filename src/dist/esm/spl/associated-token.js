import { PublicKey } from "@solana/web3.js";
import { Program } from "../program/index.js";
import { SplAssociatedTokenCoder } from "../coder/spl-associated-token/index.js";
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
export function program(provider) {
    return new Program(IDL, ASSOCIATED_TOKEN_PROGRAM_ID, provider, coder());
}
export function coder() {
    return new SplAssociatedTokenCoder(IDL);
}
export const IDL = {
    version: "0.1.0",
    name: "spl_associated_token",
    instructions: [
        {
            name: "create",
            accounts: [
                {
                    name: "authority",
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: "associatedAccount",
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: "owner",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "mint",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "systemProgram",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "tokenProgram",
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: "rent",
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
    ],
};
//# sourceMappingURL=associated-token.js.map