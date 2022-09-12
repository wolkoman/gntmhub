import { defineEventHandler } from "h3";
import { webAuthn } from '../../../utils/fido';
import { supabase } from '../../../utils/supabase';

export default  defineEventHandler(async (event) => {
    const {username} = await readBody<{username: string}>(event);
    const {data: users} = await supabase.from('users').select('*').eq('username', username);
    console.log(users);
    if(users.length !== 0){
        return {error: 'Dieser Benutzername existiert schon'}
    }
    const challenge = await webAuthn.createRegistrationChallenge(username);
    await supabase.from('challenges').insert({id: challenge.user.id, challenge: challenge.challenge})
    return challenge;
});