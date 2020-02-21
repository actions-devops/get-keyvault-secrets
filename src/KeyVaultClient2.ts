// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential, TokenCredentialOptions } from "@azure/identity";
import * as core from '@actions/core'
import { resolve } from "dns";

export class KeyVaultClient2 {    
       
    private keyVaultUrl:string;
    private authorityHost:string;
    private secretClient: SecretClient;
    private credential;

    constructor(keyVaultUrl: string, authorityHost: string) {
        this.keyVaultUrl = keyVaultUrl;
        this.authorityHost = authorityHost;
        this.credential = null;

        // DefaultAzureCredential expects the following three environment variables:
        // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
        // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
        // - AZURE_CLIENT_SECRET: The client secret for the registered application

        if (this.authorityHost)
        {
            var tokenOptions:TokenCredentialOptions = { 
                authorityHost: this.authorityHost
             }
             this.credential = new DefaultAzureCredential(tokenOptions);

        }else{
            this.credential = new DefaultAzureCredential();
        }

        const client = new SecretClient(this.keyVaultUrl, this.credential);
        this.secretClient = client;

    }
  
    public async getSecrets() {
        
        // List the secrets we have, by page
        console.log("Listing secrets by page");
        for await (const page of this.secretClient.listPropertiesOfSecrets().byPage({ maxPageSize: 2 })) {
            for (const secretProperties of page) {
                if (secretProperties.enabled) {
                    const secret = await this.secretClient.getSecret(secretProperties.name);
                    await this.setVaultVariable(secret.name, secret.value);
                    console.log("secret: ", secret);
                }
            }
            console.log("--page--");
        }
    }

    public async getSecretValue(secretName: string) {

        // Read the secret we created
        //const secretName = 'MySecretName';
        const secret = await this.secretClient.getSecret(secretName);
        await this.setVaultVariable(secretName, secret.value);
        console.log("secret: ", secret.value);
        
    }

    private async setVaultVariable(secretName: string, secretValue: string): Promise<any> {
        if (!secretValue) {
            return;
        }

        core.setSecret(secretValue);
        core.exportVariable(secretName, secretValue);
        core.setOutput(secretName, secretValue);
    }

    
}