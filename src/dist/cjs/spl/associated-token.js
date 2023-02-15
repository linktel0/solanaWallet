"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = exports.coder = exports.program = void 0;
const web3_js_1 = require("@solana/web3.js");
const index_js_1 = require("../program/index.js");
const index_js_2 = require("../coder/spl-associated-token/index.js");
const ASSOCIATED_TOKEN_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
function program(provider) {
    return new index_js_1.Program(exports.IDL, ASSOCIATED_TOKEN_PROGRAM_ID, provider, coder());
}
exports.program = program;
function coder() {
    return new index_js_2.SplAssociatedTokenCoder(exports.IDL);
}
exports.coder = coder;
exports.IDL = {
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