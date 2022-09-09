<script setup>
import { base64ToArrayBuffer, arrayBufferToBase64 } from '../utils/base64';

const state = reactive({ loading: false, username: 'wolkoman' });

const login = async () => {
  const { authnOptions, challenge, myId } = await $fetch('/api/auth/loginData');
  const response = await navigator.credentials.get({ publicKey: { ...authnOptions, challenge: base64ToArrayBuffer(challenge) } });
  console.log(response);
  await $fetch('/api/auth/login', {
    body: {
      myId, id: response.id,
      rawId: arrayBufferToBase64(response.rawId), response: {
        authenticatorData: arrayBufferToBase64(response.response.authenticatorData),
        clientDataJSON: arrayBufferToBase64(response.response.clientDataJSON),
        signature: arrayBufferToBase64(response.response.signature),
        userHandle: arrayBufferToBase64(response.response.userHandle),
      }
    }, method: 'POST',
  });

}

const register = async () => {
  state.loading = true;
  const { options, challenge, id } = await $fetch('/api/auth/registerData', {
    body: { username: state.username }, method: 'POST',
  });
  const response = await navigator.credentials.create({
    publicKey: {
      ...options,
      challenge: base64ToArrayBuffer(challenge),
      user: { ...options.user, id: base64ToArrayBuffer(id) }
    }
  });
  await $fetch('/api/auth/register', {
    body: {
      response: {
        ...response,
        authenticatorAttachment: response.authenticatorAttachment,
        id: response.id,
        type: response.type,
        rawId: arrayBufferToBase64(response.rawId),
        response: {
          attestationObject: arrayBufferToBase64(response.response.attestationObject),
          clientDataJSON: arrayBufferToBase64(response.response.clientDataJSON)
        }
      }, id
    }, method: 'POST',
  });
  state.loading = false;
}
const disabledButton = computed(() => state.loading || state.username.length < 4);
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-grow"></div>
    <div class="bg-gray-200 flex flex-col justify-center w-80 items-stretch p-10">
      <input v-model="state.username" class="px-2 py-1">
      <button @click="register" :disabled="disabledButton" class="p-1 bg-gray-600 text-white hover:bg-gray-700"
        :class="{'animate-pulse': state.loading,'pointer-events-none': disabledButton}">Register</button>
      <button @click="login" class="p-1 mt-4 bg-gray-600 text-white hover:bg-gray-700"
        :class="{'animate-pulse': state.loading,'pointer-events-none': disabledButton}">Login</button>
    </div>
  </div>
</template>
