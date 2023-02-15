"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplAssociatedTokenAccountsCoder = void 0;
const common_1 = require("../common");
class SplAssociatedTokenAccountsCoder {
    constructor(idl) {
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    // TODO: this won't use the appendData.
    memcmp(accountName, _appendData) {
        switch (accountName) {
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        var _a;
        return (_a = (0, common_1.accountSize)(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0;
    }
}
exports.SplAssociatedTokenAccountsCoder = SplAssociatedTokenAccountsCoder;
//# sourceMappingURL=accounts.js.map