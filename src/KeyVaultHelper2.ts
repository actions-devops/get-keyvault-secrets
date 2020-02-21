import * as core from '@actions/core';
import { IAuthorizationHandler } from "azure-actions-webclient/lib/AuthHandler/IAuthorizationHandler";
import { KeyVaultActionParameters } from "./KeyVaultActionParameters";
import { KeyVaultClient2 } from "./KeyVaultClient2";
import util = require("util");

export class AzureKeyVaultSecret2 {
    name: string;
    enabled: boolean;
    expires: Date | undefined;
    contentType: string;
}

export class KeyVaultHelper2 {

    private keyVaultActionParameters: KeyVaultActionParameters;
    private keyVaultClient2: KeyVaultClient2;

    constructor(keyVaultActionParameters: KeyVaultActionParameters) {
        this.keyVaultActionParameters = keyVaultActionParameters;
        this.keyVaultClient2 = new KeyVaultClient2( keyVaultActionParameters.keyVaultUrl, keyVaultActionParameters.authorityHost);
    }

    public downloadSecrets(): Promise<void> {
        var downloadAllSecrets = false;
        if (this.keyVaultActionParameters.secretsFilter && this.keyVaultActionParameters.secretsFilter.length === 1 && this.keyVaultActionParameters.secretsFilter[0] === "*") {
            downloadAllSecrets = true;
        }

        if (downloadAllSecrets) {
            return this.downloadAllSecrets();
        } else {
            return this.downloadSelectedSecrets(this.keyVaultActionParameters.secretsFilter);
        }
    }

    private downloadAllSecrets(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.keyVaultClient2.getSecrets();
        });
    }

    private downloadSelectedSecrets(secretsFilter: string): Promise<void> {
        let selectedSecrets: string[] = [];        
        if (secretsFilter) {
            selectedSecrets = secretsFilter.split(',');
        }
        
        return new Promise<void>((resolve, reject) => {
            var getSecretValuePromises: Promise<any>[] = [];
            selectedSecrets.forEach((secretName: string) => {
                getSecretValuePromises.push(this.downloadSecretValue(secretName));
            });

            Promise.all(getSecretValuePromises).then(() => {
                return resolve();
            }, error => {
                return reject(new Error("Downloading selected secrets failed"));
            });
        });
    }

    private downloadSecretValue(secretName: string): Promise<any> {
        secretName = secretName.trim();

        return new Promise<void>((resolve, reject) => {
            this.keyVaultClient2.getSecretValue(secretName);
        });
    }

    private getError(error: any): any {
        core.debug(JSON.stringify(error));

        if (error && error.message) {
            return error.message;
        }

        return error;
    }
}