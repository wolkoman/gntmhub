import { AssertionResult, ExpectedAssertionResult } from "fido2-lib";
import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { AuthenticationCredentials } from "~~/utils/web-authn";
import { supabase } from '../../../utils/supabase';
import { webAuthn } from '../../../utils/fido';

export default defineEventHandler(async (event) => {
    const response = await readBody<AuthenticationCredentials>(event);

    const { data: [login] } = await supabase.from('registrations').delete().eq('id', response.challengeId);
    const { data: [user] } = await supabase.from('users').select('*').eq('credId', response.rawId);
    console.log({login, user});

    const authnResult = await webAuthn.verifyAuthenticationCredentials(response, login.challenge, user.credId, user.publicKey, user.userHandle, "http://localhost:3000");
    console.log({authnResult});
    return { authnResult };
});