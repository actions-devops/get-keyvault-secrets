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
Object.defineProperty(exports, "__esModule", { value: true });
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const identity_1 = require("@azure/identity");
class KeyVaultClient2 {
    constructor(keyVaultUrl) {
        this.keyVaultUrl = keyVaultUrl;
    }
    getSecrets(secretName) {
    }
    getSecretValue(secretName) {
        return __awaiter(this, void 0, void 0, function* () {
            // DefaultAzureCredential expects the following three environment variables:
            // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
            // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
            // - AZURE_CLIENT_SECRET: The client secret for the registered application
            const credential = new identity_1.DefaultAzureCredential();
            //const vaultName = process.env["KEYVAULT_NAME"] || "<keyvault-name>";
            //const url = `https://${vaultName}.vault.azure.net`;
            //var url = this.keyVaultUrl;
            const client = new keyvault_secrets_1.SecretClient(this.keyVaultUrl, credential);
            // Read the secret we created
            //const secretName = 'MySecretName';
            const secret = yield client.getSecret(secretName);
            console.log("secret: ", secret);
        });
    }
}
exports.KeyVaultClient2 = KeyVaultClient2;
