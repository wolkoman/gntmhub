import { supabase } from "~~/utils/supabase";
import { defineEventHandler } from "h3";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export default defineEventHandler(async (event) => {
    const { username } = await readBody<{ username: string }>(event);
    const { data: [user] } = await supabase.from('users').select('*').eq('name', username);
    if (user === null) throw new Error("User does not exist");
    const { data: authenticators } = await supabase.from('authenticators').select('*').eq('user', user.id);

    const options = generateAuthenticationOptions({
        allowCredentials: authenticators.map(authenticator => ({
            id: Buffer.from(authenticator.id, 'base64'),
            type: 'public-key',
        })),
        userVerification: 'preferred',
    });

    await supabase.from('users').update({ currentChallenge: options.challenge }).eq('id', user.id)
    return {options, userId: user.id};
});