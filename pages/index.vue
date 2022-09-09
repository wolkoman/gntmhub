<script setup lang="ts">
import { arrayBufferToBase64, base64ToArrayBuffer } from '../utils/base64';
import { AuthenticationChallenge } from '../utils/web-authn';
import { WebAuthnClient } from '../utils/web-authn-client';

const state = reactive({ loading: false, username: 'wolkoman' });

const login = async () => {
  const challenge = await $fetch('/api/auth/loginData');
  const credentials = await WebAuthnClient.authenticate(challenge);
  await $fetch('/api/auth/login', { body: credentials, method: 'POST', });

}

const register = async () => {
  state.loading = true;
  const challenge = await $fetch('/api/auth/registerData', { body: { username: state.username }, method: 'POST' });
  const credentials = await WebAuthnClient.register(challenge);
  await $fetch('/api/auth/register', {
    body: credentials, method: 'POST',
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
