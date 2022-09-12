import { WebAuthn } from "./web-authn";

export const webAuthn = new WebAuthn({
    origin: "http://localhost:3000",
    timeout: 60000,
    rpId: "localhost",
    rpName: "GNTMHUB",
    rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "cross-platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "discouraged"
});