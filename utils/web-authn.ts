
import { AssertionResult, AttestationResult, ExpectedAssertionResult, ExpectedAttestationResult, Fido2Lib, Fido2LibOptions } from "fido2-lib";


function getRandomValues(length: number) {
    return Array.from({ length }).map(() => Math.floor(Math.random() * 26 + 65));
}
export type RegistrationChallenge = Omit<PublicKeyCredentialCreationOptions, 'challenge' | 'user'> & {
    challenge: string;
    user: {
        displayName: string;
        name: string;
        id: string;
    };
};

export type RegistrationCredential = {
    response: {
        authenticatorAttachment: string,
        id: string,
        rawId: string,
        type: string,
        response: {
            attestationObject: string,
            clientDataJSON: string
        }
    },
    userId: string,
    username: string
};

export type AuthenticationChallenge = Omit<PublicKeyCredentialRequestOptions, 'challenge'> & {
    challenge: string;
    challengeId: string;
};
export type AuthenticationCredentials = {
    challengeId: string,
    id: string,
    credId: string,
    response: {
        authenticatorData: string,
        clientDataJSON: string,
        signature: string,
        userHandle: string,
    }
}

export class WebAuthn {
    fido: Fido2Lib;
    origin: string;

    constructor(options: Fido2LibOptions & {origin: string}) {
        this.fido = new Fido2Lib(options);
        this.origin = options.origin;
    }

    async createRegistrationChallenge(username: string): Promise<RegistrationChallenge> {
        const options = await this.fido.attestationOptions();
        const challenge = Buffer.from(options.challenge).toString('base64');
        const id = Buffer.from(getRandomValues(12)).toString('base64');
        options.user = { displayName: username, name: username, id: id };
        return { ...options, challenge }
    }


    async verifyRegistrationCredentials(credential: RegistrationCredential, challenge: string) {
        const clientAttestationResponse: AttestationResult = {
            rawId: new Uint8Array(Buffer.from(credential.response.rawId, 'base64')).buffer,
            response: credential.response.response,
        };
        const attestationExpectations: ExpectedAttestationResult = {
            challenge,
            origin: this.origin,
            factor: "either"
        };
        const regResult = await this.fido.attestationResult(clientAttestationResponse, attestationExpectations);
        return {
            regResult,
            credId: Buffer.from(regResult.authnrData.get('credId')).toString('base64'),
            publicKey: regResult.authnrData.get('credentialPublicKeyPem')
        };
    }

    async createAuthenticationChallenge(): Promise<AuthenticationChallenge> {
        const authnOptions = await this.fido.assertionOptions();
        const challenge = Buffer.from(authnOptions.challenge).toString('base64');
        const challengeId = Buffer.from(getRandomValues(12)).toString('base64');
        //@ts-ignore
        return { ...authnOptions, challenge, challengeId };
    }

    async verifyAuthenticationCredentials(credential: AuthenticationCredentials, challenge: string, credId: string, publicKey: string, userId: string){
        const clientAssertionResponse: AssertionResult = {
            id: credential.id as any,
            rawId: new Uint8Array(Buffer.from(credential.credId, 'base64')).buffer,
            response: {
                authenticatorData: credential.response.authenticatorData as any,
                clientDataJSON: credential.response.clientDataJSON,
                signature: credential.response.signature,
                userHandle: credential.response.userHandle,
            }
        }
    
        const assertionExpectations: ExpectedAssertionResult = {
            challenge: challenge,
            origin: this.origin,
            factor: "either",
            publicKey: publicKey,
            prevCounter: 0,
            userHandle: userId
        };
        const authnResult = await this.fido.assertionResult(clientAssertionResponse, assertionExpectations);
        return { authnResult };
    }
}
