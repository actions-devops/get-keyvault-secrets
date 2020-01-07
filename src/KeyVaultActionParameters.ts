import util = require("util");
import * as core from '@actions/core';

export class KeyVaultActionParameters {

    public keyVaultName: string;
    public secretsFilter: string;
    public keyVaultUrl: string;
    public cloud: string;
    public tokenArgs: string[];

    public getKeyVaultActionParameters() : KeyVaultActionParameters {
        this.keyVaultName = core.getInput("keyvault");
        this.secretsFilter = core.getInput("secrets");
        this.cloud = core.getInput("cloud");

        if (!this.keyVaultName) {
            core.setFailed("Vault name not provided.");
        }

        if (!this.secretsFilter) {
            core.setFailed("Secret filter not provided.");
        }

        var azureKeyVaultDnsSuffix = "vault.azure.net";
        this.tokenArgs = ["--resource", "https://vault.azure.net"];

        if (this.cloud.startsWith("AzureUSGovernment")){
            azureKeyVaultDnsSuffix = "vault.usgovcloudapi.net"
            this.tokenArgs = ["--resource", "https://vault.usgovcloudapi.net"];
        }

        this.keyVaultUrl = util.format("https://%s.%s", this.keyVaultName, azureKeyVaultDnsSuffix);
        return this;
    }
}