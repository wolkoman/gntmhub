import { generateRegistrationOptions } from "@simplewebauthn/server";
import { defineEventHandler } from "h3";
import { webAuthnOptions } from "~~/utils/fido";
import { supabase } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
    const { username } = await readBody<{ username: string }>(event);
    const userId = Math.floor(Math.random()*10000000).toString();
    const { data: users } = await supabase.from('users').select('*').eq('name', username);
    if (users.length !== 0) {
        return { error: 'Dieser Benutzername existiert schon' }
    }

    console.log("REGISTER_DATA", userId, username, {
        rpID: webAuthnOptions.rpID,
        rpName: webAuthnOptions.rpName,
        userID: userId,
        userName: username,
        attestationType: 'none',
    })
    const options = generateRegistrationOptions({
        rpID: webAuthnOptions.rpID,
        rpName: webAuthnOptions.rpName,
        userID: userId,
        userName: username,
        attestationType: 'none',
    });/*
    await supabase.from('users').insert({
        id: userId,
        name: username,
        currentChallenge: options.challenge
     });

    return {options, userId};*/
    return {hi: true};
});