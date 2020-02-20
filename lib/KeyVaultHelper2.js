"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const KeyVaultClient2_1 = require("./KeyVaultClient2");
class AzureKeyVaultSecret2 {
}
exports.AzureKeyVaultSecret2 = AzureKeyVaultSecret2;
class KeyVaultHelper2 {
    constructor(keyVaultActionParameters) {
        this.keyVaultActionParameters = keyVaultActionParameters;
        this.keyVaultClient2 = new KeyVaultClient2_1.KeyVaultClient2(keyVaultActionParameters.keyVaultUrl);
    }
    downloadSecrets() {
        var downloadAllSecrets = false;
        if (this.keyVaultActionParameters.secretsFilter && this.keyVaultActionParameters.secretsFilter.length === 1 && this.keyVaultActionParameters.secretsFilter[0] === "*") {
            downloadAllSecrets = true;
        }
        if (downloadAllSecrets) {
            return this.downloadAllSecrets();
        }
        else {
            return this.downloadSelectedSecrets(this.keyVaultActionParameters.secretsFilter);
        }
    }
    downloadAllSecrets() {
        return new Promise((resolve, reject) => {
            this.keyVaultClient2.getSecrets("");
        });
    }
    downloadSelectedSecrets(secretsFilter) {
        let selectedSecrets = [];
        if (secretsFilter) {
            selectedSecrets = secretsFilter.split(',');
        }
        return new Promise((resolve, reject) => {
            var getSecretValuePromises = [];
            selectedSecrets.forEach((secretName) => {
                getSecretValuePromises.push(this.downloadSecretValue(secretName));
            });
            Promise.all(getSecretValuePromises).then(() => {
                return resolve();
            }, error => {
                return reject(new Error("Downloading selected secrets failed"));
            });
        });
    }
    downloadSecretValue(secretName) {
        secretName = secretName.trim();
        return new Promise((resolve, reject) => {
            this.keyVaultClient2.getSecretValue(secretName);
        });
    }
    setVaultVariable(secretName, secretValue) {
        if (!secretValue) {
            return;
        }
        core.setSecret(secretValue);
        core.exportVariable(secretName, secretValue);
        core.setOutput(secretName, secretValue);
    }
    getError(error) {
        core.debug(JSON.stringify(error));
        if (error && error.message) {
            return error.message;
        }
        return error;
    }
}
exports.KeyVaultHelper2 = KeyVaultHelper2;
