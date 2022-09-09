import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from '../../../utils/supabase';

export default  defineEventHandler(async (event) => {

    const {username} = await readBody<{username: string}>(event);

    const options = await fido.attestationOptions();
    options.user = { displayName: username, name: username, id: '' };

    const challenge = Buffer.from(options.challenge).toString('base64');
    const id = Buffer.from(getRandomValues(6)).toString('base64');
    await supabase.from('registrations').insert({id, challenge})
    return { options, challenge, id, username };
});

export function getRandomValues(length: number) {
    return Array.from({ length }).map(() => Math.floor(Math.random() * 26 + 65));
}
