<template>
  <div class="w-full h-screen grid place-content-center text-blue-500">
    <form @submit.prevent="onLogin" class="px-6 py-2 border rounded-md flex flex-col gap-2 w-96">
      <h1 class="text-3xl uppercase font-extrabold text-center">Login</h1>
      <div class="flex flex-col gap-2">
        <label for="email" class="font-bold text-base">Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          class="input-primary"
          autocomplete="email"
          required
          v-model="loginData.email"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password" class="font-bold text-base">Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          class="input-primary"
          autocomplete="password"
          minlength="4"
          required
          v-model="loginData.password"
        />
      </div>
      <button class="btn-primary">Login</button>
      <p class="text-sm text-blue-700 underline text-right">Forgot your Password?</p>
      <NuxtLink to="/register"><p class="text-sm text-blue-700 underline text-right">Sign Up</p></NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useLoginStore } from '~/store/loginStore'

const loginStore = useLoginStore()
const router = useRouter()

interface LoginData {
  email: string
  password: string
}

const loginData: Ref<LoginData> = ref({
  email: '',
  password: '',
})

const onLogin = () => {
  fetch('/auth/signin', { method: 'POST', body: JSON.stringify(loginData.value) })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      if (json?.token) {
        loginStore.onLogIn(loginData.value.email, json.token)
        router.push('/home')
      } else {
        console.log(json.error)
      }
    })
}
</script>
