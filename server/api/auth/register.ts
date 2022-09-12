import { defineEventHandler } from "h3";
import { supabase } from "~~/utils/supabase";
import { webAuthn } from '../../../utils/fido';
import { RegistrationCredential } from '../../../utils/web-authn';

export default defineEventHandler(async (event) => {
    const credentials = await readBody<RegistrationCredential>(event);

    const {data: [{challenge}]} = await supabase.from('challenges').delete().eq('id', credentials.userId);
    const result = await webAuthn.verifyRegistrationCredentials(credentials, challenge);
    await supabase.from('users').insert({
        id: result.credId,
        publicKey: result.publicKey,
        userId: credentials.userId,
        username: credentials.username
    })
    return {regResult: result};

});