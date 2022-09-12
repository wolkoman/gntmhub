<script setup lang="ts">
import { WebAuthnClient } from '../utils/web-authn-client';
import { useUser } from '../utils/store/user';

const state = reactive({ loading: false, registering: false, username: 'wolkoman', error: "" });
const user = useUser();
watch(user, () => {
  if (user.value.loggedIn === true)
    navigateTo('/app');
})

const login = async () => (async () => {
  state.loading = true;
  state.error = "";
  const challenge = await $fetch('/api/auth/loginData');
  const credentials = await WebAuthnClient.authenticate(challenge);
  const result = await $fetch('/api/auth/login', { body: credentials, method: 'POST', });
  user.value = { ...result, loggedIn: true };
})()
  .catch(err => state.error = err)
  .finally(() => state.loading = false);

const register = () => (async () => {
  state.loading = true;
  state.error = "";
  const response = await $fetch('/api/auth/registerData', { body: { username: state.username }, method: 'POST' });
  if ('error' in response) {
    state.error = response.error;
  } else {
    const credentials = await WebAuthnClient.register(response);
    await $fetch('/api/auth/register', { body: credentials, method: 'POST', });
  }
})()
  .catch(err => state.error = err)
  .finally(() => state.loading = false);

const disabledButton = computed(() => state.loading || state.username.length < 4);
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-grow hidden md:block">
    </div>
    <div class="bg-gray-200 flex flex-col justify-center flex-grow md:flex-grow-0 md:w-80 p-10">
      <div class="flex flex-col items-stretch" v-if="state.registering">
        <input v-model="state.username" class="px-2 py-1">
        <button @click="register" :disabled="disabledButton" class="p-1 bg-gray-600 text-white hover:bg-gray-700"
          :class="{'animate-pulse': state.loading,'pointer-events-none': disabledButton}">Register</button>
        <button class="text-center text-sm underline hover:no-underline"
          @click="state.registering = !state.registering">or login</button>
        <div v-if="state.error" class="text-red-600 font-bold mt-4">{{state.error}}</div>
      </div>
      <div class="flex flex-col items-stretch" v-else="state.registering">
        <button @click="login" :disabled="disabledButton" class="p-1 mt-4 bg-gray-600 text-white hover:bg-gray-700"
          :class="{'animate-pulse': state.loading,'pointer-events-none': disabledButton}">Login</button>
        <button class="text-center text-sm underline hover:no-underline"
          @click="state.registering = !state.registering">or register</button>
        <div v-if="state.error" class="text-red-600 font-bold mt-4">{{state.error}}</div>
      </div>
    </div>
  </div>
</template>
