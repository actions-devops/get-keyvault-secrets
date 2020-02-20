import util = require("util");
import * as core from '@actions/core';

export class KeyVaultActionParameters {

    public keyVaultName: string;
    public secretsFilter: string;
    public keyVaultUrl: string;
    public track: string;
    public cloud: string;

    public getKeyVaultActionParameters() : KeyVaultActionParameters {
        this.keyVaultName = core.getInput("keyvault");
        this.secretsFilter = core.getInput("secrets");
        this.track = core.getInput("apiversion")

        if (!this.keyVaultName) {
            core.setFailed("Vault name not provided.");
        }

        if (!this.secretsFilter) {
            core.setFailed("Secret filter not provided.");
        }

        var azureKeyVaultDnsSuffix = "vault.azure.net";
        if (this.track == "v2")
        {
            this.cloud = core.getInput("cloud")

            if (this.cloud == "AzureUSGovernment")
            {
                azureKeyVaultDnsSuffix = "vault.usgovcloudapi.net"
            }
        } 
        else
        {

        }

        
        this.keyVaultUrl = util.format("https://%s.%s", this.keyVaultName, azureKeyVaultDnsSuffix);
        return this;
    }
}