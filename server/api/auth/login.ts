import { defineEventHandler } from "h3";
import { AuthenticationCredentials } from "~~/utils/web-authn";
import { webAuthn } from '../../../utils/fido';
import { supabase } from '../../../utils/supabase';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const response = await readBody<AuthenticationCredentials>(event);
    const { data: [challenge] } = await supabase.from('challenges').delete().eq('id', response.challengeId);
    const { data: [user] } = await supabase.from('users').select('*').eq('id', response.credId);
    await webAuthn.verifyAuthenticationCredentials(response, challenge.challenge, user.id, user.publicKey, user.userId);
    const token = jwt.sign({username: user.username}, process.env.SECRET!, {expiresIn: 60*24});
    console.log(token)
    return { token, username: user.username };
});