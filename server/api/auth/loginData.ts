import { supabase } from "~~/utils/supabase";
import { defineEventHandler } from "h3";
import { webAuthn } from '../../../utils/fido';

export default defineEventHandler(async (event) => {
    const challenge = await webAuthn.createAuthenticationChallenge();
    await supabase.from('challenges').insert({id: challenge.challengeId, challenge: challenge.challenge})
    return challenge;
});