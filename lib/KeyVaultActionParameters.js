"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const core = __importStar(require("@actions/core"));
const actions_secret_parser_1 = require("actions-secret-parser");
class KeyVaultActionParameters {
    getKeyVaultActionParameters() {
        this.keyVaultName = core.getInput("keyvault");
        this.secretsFilter = core.getInput("secrets");
        this.apiVersion = core.getInput("apiversion");
        if (!this.keyVaultName) {
            core.setFailed("Vault name not provided.");
        }
        if (!this.secretsFilter) {
            core.setFailed("Secret filter not provided.");
        }
        var azureKeyVaultDnsSuffix = "vault.azure.net";
        if (this.apiVersion == "v2") {
            let creds = core.getInput('creds', { required: true });
            let secrets = new actions_secret_parser_1.SecretParser(creds, actions_secret_parser_1.FormatType.JSON);
            let servicePrincipalId = secrets.getSecret("$.clientId", false);
            console.log(`servicePrincipalId:{}`, servicePrincipalId);
            let servicePrincipalKey = secrets.getSecret("$.clientSecret", true);
            let tenantId = secrets.getSecret("$.tenantId", false);
            console.log(`tenantId:{}`, tenantId);
            let subscriptionId = secrets.getSecret("$.subscriptionId", false);
            console.log(`subscriptionId:{}`, subscriptionId);
            let activeDirectoryEndpointUrl = secrets.getSecret("$.activeDirectoryEndpointUrl", false);
            console.log(`activeDirectoryEndpointUrl:{}`, activeDirectoryEndpointUrl);
            let resourceManagerEndpointUrl = secrets.getSecret("$.resourceManagerEndpointUrl", false);
            console.log(`resourceManagerEndpointUrl:{}`, resourceManagerEndpointUrl);
            this.authorityHost = activeDirectoryEndpointUrl;
            console.log(`resourceManagerEndpointUrl:{}`, resourceManagerEndpointUrl);
            var re = /https:\/\/management/gi;
            var str = resourceManagerEndpointUrl;
            var newstr = str.replace(re, "vault");
            azureKeyVaultDnsSuffix = newstr;
            console.log(`azureKeyVaultDnsSuffix:{}`, azureKeyVaultDnsSuffix);
            if (!servicePrincipalId || !servicePrincipalKey || !tenantId || !subscriptionId) {
                throw new Error("Not all values are present in the creds object. Ensure clientId, clientSecret, tenantId and subscriptionId are supplied.");
            }
        }
        else {
        }
        this.keyVaultUrl = util.format("https://%s.%s", this.keyVaultName, azureKeyVaultDnsSuffix);
        return this;
    }
}
exports.KeyVaultActionParameters = KeyVaultActionParameters;
