import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from "~~/utils/supabase";
import { getRandomValues } from "./registerData";

export default defineEventHandler(async (event) => {
    const authnOptions = await fido.assertionOptions();
    const challenge = Buffer.from(authnOptions.challenge).toString('base64');
    const myId = Buffer.from(getRandomValues(12)).toString('base64');
    await supabase.from('registrations').insert({id: myId, challenge})
    return {authnOptions, challenge, myId};
});