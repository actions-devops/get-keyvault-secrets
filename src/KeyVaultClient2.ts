// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import * as core from '@actions/core'

export class KeyVaultClient2 {    
       
    private keyVaultUrl;
    constructor(keyVaultUrl: string) {
        this.keyVaultUrl = keyVaultUrl;
    }
  
    public getSecrets(secretName: string) {
      
    }

    public async getSecretValue(secretName: string) {
     
        // DefaultAzureCredential expects the following three environment variables:
        // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
        // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
        // - AZURE_CLIENT_SECRET: The client secret for the registered application
        const credential = new DefaultAzureCredential();

        //const vaultName = process.env["KEYVAULT_NAME"] || "<keyvault-name>";
        //const url = `https://${vaultName}.vault.azure.net`;
        //var url = this.keyVaultUrl;

        const client = new SecretClient(this.keyVaultUrl, credential);

        // Read the secret we created
        //const secretName = 'MySecretName';
        const secret = await client.getSecret(secretName);
        console.log("secret: ", secret);
        
    }

    
}