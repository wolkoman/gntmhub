import { ExpectedAttestationResult } from "fido2-lib";
import { defineEventHandler } from "h3";
import { fido } from "~~/utils/fido";
import { supabase } from "~~/utils/supabase";

export default defineEventHandler(async (event) => {
    const { response, id } = await readBody(event);

    const clientAttestationResponse = {
        ...response,
        rawId: new Uint8Array(Buffer.from(response.rawId, 'base64')).buffer,
        response: {
            attestationObject: response.response.attestationObject,
            clientDataJSON: response.response.clientDataJSON,
        }
    }; 
    const {data: [{challenge}]} = await supabase.from('registrations').delete().eq('id', id);
    const attestationExpectations: ExpectedAttestationResult = {
        challenge,
        origin: "http://localhost:3000",
        factor: "either"
    };
    const regResult = await fido.attestationResult(clientAttestationResponse, attestationExpectations);
    await supabase.from('users').insert({
        credId: Buffer.from(regResult.authnrData.get('credId')).toString('base64'),
        publicKey: regResult.authnrData.get('credentialPublicKeyPem'),
        userHandle: id
    })
    console.log({regResult})
    return {regResult};

});