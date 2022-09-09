import { AssertionResult, ExpectedAssertionResult } from "fido2-lib";
import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
    const response = await readBody(event);

    const clientAssertionResponse: AssertionResult = {
        id: response.id,
        rawId: new Uint8Array(Buffer.from(response.rawId, 'base64')).buffer,
        response: {
            authenticatorData: response.response.authenticatorData,
            clientDataJSON: response.response.clientDataJSON,
            signature: response.response.signature,
            userHandle: response.response.userHandle,
        }
    }

    const { data: [login] } = await supabase.from('registrations').select('*').eq('id', response.myId);
    const { data: [user] } = await supabase.from('users').select('*').eq('credId', response.rawId);
    console.log({login, user});

    const assertionExpectations: ExpectedAssertionResult = {
        challenge: login.challenge,
        origin: "http://localhost:3000",
        factor: "either",
        publicKey: user.publicKey,
        prevCounter: 0,
        userHandle: user.userHandle
    };
    const authnResult = await fido.assertionResult(clientAssertionResponse, assertionExpectations); // will throw on error
    console.log({authnResult});
    return { authnResult };
});