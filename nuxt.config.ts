import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    runtimeConfig: {
        SUPABASE_SECRET: process.env.SUPABASE_SECRET
    }
})
