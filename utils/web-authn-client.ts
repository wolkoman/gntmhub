import { AuthenticationChallenge, AuthenticationCredentials, RegistrationChallenge, RegistrationCredential } from "./web-authn";

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}
function arrayBufferToBase64(arrayBuffer) {
    return window.btoa(
        new Uint8Array(arrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}



export class WebAuthnClient {

    static async register(challenge: RegistrationChallenge): Promise<RegistrationCredential> {
        const credential: any = await navigator.credentials.create({
            publicKey: {
                ...challenge,
                challenge: base64ToArrayBuffer(challenge.challenge),
                user: { ...challenge.user, id: base64ToArrayBuffer(challenge.user.id) }
            }
        });
        const info = {
            response: {
                authenticatorAttachment: credential.authenticatorAttachment,
                id: credential.id,
                rawId: arrayBufferToBase64(credential.rawId),
                type: credential.type,
                response: {
                    attestationObject: arrayBufferToBase64(credential.response.attestationObject),
                    clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON)
                }
            },
            userId: challenge.user.id,
            username: challenge.user.name
        };
        return info;
    }

    static async authenticate(challenge: AuthenticationChallenge): Promise<AuthenticationCredentials> {
        const response: any = await navigator.credentials.get({
            publicKey:
                { ...challenge, challenge: base64ToArrayBuffer(challenge.challenge) }
        });
        return {
            challengeId: challenge.challengeId,
            id: response.id,
            credId: arrayBufferToBase64(response.rawId),
            response: {
                authenticatorData: arrayBufferToBase64(response.response.authenticatorData),
                clientDataJSON: arrayBufferToBase64(response.response.clientDataJSON),
                signature: arrayBufferToBase64(response.response.signature),
                userHandle: arrayBufferToBase64(response.response.userHandle),
            }
        };
    }

}
