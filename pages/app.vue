<script setup lang="ts">
import { useUser } from '../utils/store/user';

const user = useUser();
watch(user, () => {
  if(user.value.loggedIn === false)
    navigateTo('/');
})

</script>

<template>
  <div class="flex flex-col h-screen mx-auto w-80 my-12" v-if="user.loggedIn">
    <div class=" text-xl font-bold">
      Hallo {{user.username}}
    </div>
    <button @click="user = {loggedIn: false}" class="my-2 bg-gray-500 text-white">Abmelden</button>
  </div>
</template>
