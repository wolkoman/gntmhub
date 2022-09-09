import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from '../../../utils/supabase';
import { webAuthn } from '../../../utils/fido';

export default  defineEventHandler(async (event) => {

    const {username} = await readBody<{username: string}>(event);

    const challenge = await webAuthn.createRegistrationChallenge(username);
    await supabase.from('registrations').insert({id: challenge.user.id, challenge: challenge.challenge})
    return challenge;
});

export function getRandomValues(length: number) {
    return Array.from({ length }).map(() => Math.floor(Math.random() * 26 + 65));
}
