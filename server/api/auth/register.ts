import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { defineEventHandler } from "h3";
import { supabase } from "~~/utils/supabase";
import { webAuthnOptions } from '../../../utils/fido';

export default defineEventHandler(async (event) => {
    const { userId, credentials } = await readBody(event);

    const { data: [user] } = await supabase.from('users').select('*').eq('id', userId);

    if (user === null) throw new Error("User does not exist");

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            credential: credentials,
            expectedChallenge: user.currentChallenge,
            expectedOrigin: webAuthnOptions.origin,
            expectedRPID: webAuthnOptions.rpID,
        });
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }

    const { verified, registrationInfo } = verification;
    console.log(await supabase.from('authenticators').insert({
        id: Buffer.from(registrationInfo.credentialID).toString('base64'),
        counter: registrationInfo.counter,
        public_key: Buffer.from(registrationInfo.credentialPublicKey).toString('base64'),
        user: userId,
        backed_up: registrationInfo.credentialBackedUp,
        device_type: registrationInfo.credentialDeviceType,
    }));
    return verification;

});