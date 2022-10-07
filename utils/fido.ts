import * as dotenv from 'dotenv';
dotenv.config()

export const webAuthnOptions = {
    rpName: "GNTMHUB",
    rpID: process.env.WEBAUTHN_ID,
    origin: `http://192.168.0.39:3000`,
}