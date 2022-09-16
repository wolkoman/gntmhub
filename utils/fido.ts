import * as dotenv from 'dotenv';
dotenv.config()

export const webAuthnOptions = {
    rpName: "GNTMHUB",
    rpID: process.env.WEBAUTHN_ID,
    origin: `http${process.env.WEBAUTHN_ID === "localhost" ? "" : "s"}://${process.env.WEBAUTHN_ID}:3000`,
}