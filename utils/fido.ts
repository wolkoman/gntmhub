import { Fido2Lib } from "fido2-lib";

export const fido = new Fido2Lib({
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
});