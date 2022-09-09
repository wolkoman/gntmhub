import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from "~~/utils/supabase";
import { getRandomValues } from "./registerData";
import { webAuthn } from '../../../utils/fido';

export default defineEventHandler(async (event) => {
    const challenge = await webAuthn.createAuthenticationChallenge();
    await supabase.from('registrations').insert({id: challenge.challengeId, challenge: challenge.challenge})
    return challenge;
});