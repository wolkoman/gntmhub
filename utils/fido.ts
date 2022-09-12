import * as dotenv from 'dotenv'
dotenv.config()
import { WebAuthn } from "./web-authn";

export const webAuthn = new WebAuthn({
    origin: process.env.ORIGIN,
    timeout: 60000,
    rpId: process.env.WEBAUTHN_ID,
    rpName: "GNTMHUB",
    rpIcon: "https://example.com/logo.png",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "cross-platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "discouraged"
});