"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const identity_1 = require("@azure/identity");
const core = __importStar(require("@actions/core"));
class KeyVaultClient2 {
    constructor(keyVaultUrl, authorityHost) {
        this.keyVaultUrl = keyVaultUrl;
        this.authorityHost = authorityHost;
        this.credential = null;
        // DefaultAzureCredential expects the following three environment variables:
        // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
        // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
        // - AZURE_CLIENT_SECRET: The client secret for the registered application
        if (this.authorityHost) {
            var tokenOptions = {
                authorityHost: this.authorityHost
            };
            this.credential = new identity_1.DefaultAzureCredential(tokenOptions);
        }
        else {
            this.credential = new identity_1.DefaultAzureCredential();
        }
        const client = new keyvault_secrets_1.SecretClient(this.keyVaultUrl, this.credential);
        this.secretClient = client;
    }
    getSecrets() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            // List the secrets we have, by page
            console.log("Listing secrets by page");
            try {
                for (var _b = __asyncValues(this.secretClient.listPropertiesOfSecrets().byPage({ maxPageSize: 2 })), _c; _c = yield _b.next(), !_c.done;) {
                    const page = _c.value;
                    for (const secretProperties of page) {
                        if (secretProperties.enabled) {
                            const secret = yield this.secretClient.getSecret(secretProperties.name);
                            yield this.setVaultVariable(secret.name, secret.value);
                            console.log("secret: ", secret);
                        }
                    }
                    console.log("--page--");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    getSecretValue(secretName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Read the secret we created
            //const secretName = 'MySecretName';
            const secret = yield this.secretClient.getSecret(secretName);
            yield this.setVaultVariable(secretName, secret.value);
            console.log("secret: ", secret.value);
        });
    }
    setVaultVariable(secretName, secretValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!secretValue) {
                return;
            }
            core.setSecret(secretValue);
            core.exportVariable(secretName, secretValue);
            core.setOutput(secretName, secretValue);
        });
    }
}
exports.KeyVaultClient2 = KeyVaultClient2;
