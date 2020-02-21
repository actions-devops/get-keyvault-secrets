import util = require("util");
import * as core from '@actions/core';
import { FormatType, SecretParser } from 'actions-secret-parser';

export class KeyVaultActionParameters {

    public keyVaultName: string;
    public secretsFilter: string;
    public keyVaultUrl: string;
    public apiVersion: string;
    public cloud: string;
    public authorityHost: string;
    public creds: string;

    public getKeyVaultActionParameters() : KeyVaultActionParameters {
        this.secretsFilter = core.getInput("secrets");
        this.apiVersion = core.getInput("apiversion");
    
        if (!this.secretsFilter) {
            core.setFailed("Secret filter not provided.");
        }

        if (this.apiVersion == "v2")
        {
            // v2
            let creds = core.getInput('creds', { required: false });
            if (creds)
            {
                let secrets = new SecretParser(creds, FormatType.JSON);
                let servicePrincipalId = secrets.getSecret("$.clientId", false);
                //    console.log(`servicePrincipalId:{}`,servicePrincipalId );
                let servicePrincipalKey = secrets.getSecret("$.clientSecret", true);
                let tenantId = secrets.getSecret("$.tenantId", false);
                //    console.log(`tenantId:{}`,tenantId );
                let subscriptionId = secrets.getSecret("$.subscriptionId", false);
                //    console.log(`subscriptionId:{}`,subscriptionId );
                let activeDirectoryEndpointUrl = secrets.getSecret("$.activeDirectoryEndpointUrl", false);
                //    console.log(`activeDirectoryEndpointUrl:{}`,activeDirectoryEndpointUrl );
                let resourceManagerEndpointUrl =  secrets.getSecret("$.resourceManagerEndpointUrl", false);
                //    console.log(`resourceManagerEndpointUrl:{}`,resourceManagerEndpointUrl );
    
                this.authorityHost =  activeDirectoryEndpointUrl;
                //   console.log(`resourceManagerEndpointUrl:{}`,resourceManagerEndpointUrl );
    
                var re = /https:\/\/management/gi; 
                var str = resourceManagerEndpointUrl;
                var newstr = str.replace(re, "vault"); 
    
                azureKeyVaultDnsSuffix = newstr;
                //    console.log(`azureKeyVaultDnsSuffix:{}`,azureKeyVaultDnsSuffix );
    
                if (!servicePrincipalId || !servicePrincipalKey || !tenantId || !subscriptionId) {
                    throw new Error("Not all values are present in the creds object. Ensure clientId, clientSecret, tenantId and subscriptionId are supplied.");
                }
    
                process.env.AZURE_TENANT_ID = tenantId;
                process.env.AZURE_CLIENT_ID = servicePrincipalId;
                process.env.AZURE_CLIENT_SECRET = servicePrincipalKey;
                this.keyVaultUrl = core.getInput('keyvaulturl', { required: true });
            }
            else{
                // If no creds, try MSI
                this.keyVaultUrl = core.getInput('keyvaulturl', { required: true });
            }
            return this;
        } 
        else
        {
            //v1
            this.keyVaultName = core.getInput("keyvault");
            if (!this.keyVaultName) {
                core.setFailed("Vault name not provided.");
            }
            var azureKeyVaultDnsSuffix = "vault.azure.net";
            this.keyVaultUrl = util.format("https://%s.%s", this.keyVaultName, azureKeyVaultDnsSuffix);
            return this;
        }

        

    }
}