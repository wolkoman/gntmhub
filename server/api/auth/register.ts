import { ExpectedAttestationResult } from "fido2-lib";
import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from "~~/utils/supabase";
import { RegistrationCredential } from '../../../utils/web-authn';
import { webAuthn } from '../../../utils/fido';

export default defineEventHandler(async (event) => {
    const credentials = await readBody<RegistrationCredential>(event);

    const {data: [{challenge}]} = await supabase.from('registrations').delete().eq('id', credentials.userId);
    const regResult = await webAuthn.verifyRegistrationCredentials(credentials, challenge, "http://localhost:3000");
    await supabase.from('users').insert({
        credId: regResult.credId,
        publicKey: regResult.publicKey,
        userHandle: credentials.userId
    })
    return {regResult};

});