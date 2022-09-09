import { Fido2Lib, Fido2LibOptions } from "fido2-lib";
import { WebAuthn } from "./web-authn";


const options: Fido2LibOptions = {
    timeout: 42,
    rpId: "localhost",
    rpName: "GNTMHUB",
    rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "required"
};

export const webAuthn = new WebAuthn(options);
export const fido = new Fido2Lib(options);