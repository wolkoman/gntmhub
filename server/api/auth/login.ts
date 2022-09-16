import { defineEventHandler } from "h3";
import { supabase } from '../../../utils/supabase';
import jwt from 'jsonwebtoken';
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { webAuthnOptions } from '../../../utils/fido';

export default defineEventHandler(async (event) => {
    const { userId, credentials } = await readBody(event);
    const { data: [user] } = await supabase.from('users').select('*').eq('id', userId);
    if (user === null) throw new Error("User does not exist");
    const { data: [authenticator] } = await supabase.from('authenticators').select('*')
        .eq('id', credentials.id.replace("-", "+").replace("_", "/") + "=");
    if (authenticator === undefined || authenticator.user !== userId) throw new Error("Authenticator does not exist");

    let verification;
    try {
        verification = await verifyAuthenticationResponse({
            credential: credentials,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: webAuthnOptions.origin,
            expectedRPID: webAuthnOptions.rpID,
            authenticator: {
                credentialID: Buffer.from(authenticator.id, 'base64'),
                credentialPublicKey: Buffer.from(authenticator.public_key, 'base64'),
                counter: authenticator.counter
            },
        });
    } catch (error) {
        return { error: error.message };
    }
    const { verified } = verification;

    const token = jwt.sign({ username: user.username }, process.env.SECRET!, { expiresIn: 60 * 24 });
    if (!verified) throw new Error("Fails");
    return { verified: true, token, username: user.name };


});