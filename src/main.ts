import * as core from '@actions/core';
import * as crypto from "crypto";
import { getHandler } from 'azure-actions-webclient/lib/AuthorizationHandlerFactory';
import { IAuthorizationHandler } from 'azure-actions-webclient/lib/AuthHandler/IAuthorizationHandler';
import { KeyVaultActionParameters } from './KeyVaultActionParameters';
import { KeyVaultHelper } from './KeyVaultHelper';


async function run() {
    const prefix = process.env.AZURE_HTTP_USER_AGENT ?? "";
    try {
        const usrAgentRepo = crypto.createHash('sha256').update(process.env.GITHUB_REPOSITORY).digest('hex');
        const actionName = 'GetKeyVaultSecrets';
        const userAgentString = `${prefix ? `${prefix}+` : ''}GITHUBACTIONS_${actionName}_${usrAgentRepo}`;
        const actionParameters = new KeyVaultActionParameters().getKeyVaultActionParameters();
        const handler: IAuthorizationHandler = await getHandler();
        const keyVaultHelper = new KeyVaultHelper(handler, 100, actionParameters);  
        
        core.exportVariable('AZURE_HTTP_USER_AGENT', userAgentString);
        
        if (!handler) {
            throw('Could not login to Azure');
        }       
                 
        keyVaultHelper.downloadSecrets();

    } catch (error) {
        if ((error.indexOf('401') > 0) || (error.indexOf('login') > 0)) {
            core.setFailed("Could not login to Azure.");
        } else {       
            core.debug(`Get secret failed with error:  ${error}`);
            core.setFailed(error ?? "Error occurred in fetching the secrets.");
        }
    }
    finally {
        core.exportVariable('AZURE_HTTP_USER_AGENT', prefix);
    }
}

run();