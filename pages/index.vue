<template>
  <div class="w-full h-screen grid place-content-center text-blue-500">
    <form @submit.prevent="onLogin" class="px-6 py-2 border rounded-md flex flex-col shadow-md gap-2 w-96">
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
      <button class="btn-primary" :disabled="isLoginButtonDisabled">Login</button>
      <p class="text-sm text-blue-700 underline text-right">Forgot your Password?</p>
      <NuxtLink to="/register"
        ><p class="text-sm text-blue-700 underline text-right">Don't have an account? Sign Up</p></NuxtLink
      >
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useLoginStore } from '~/store/loginStore'

const isLoginButtonDisabled = ref(false)

const { $showToast, $hideToast } = useNuxtApp()
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

const onLogin = async () => {
  isLoginButtonDisabled.value = true
  const savingToast = $showToast('Logging in...', 'info', false)
  const response = await fetch('/auth/signin', { method: 'POST', body: JSON.stringify(loginData.value) })
  const json = await response.json()
  $hideToast(savingToast)
  if (response.status === 200) {
    loginStore.onLogIn(loginData.value.email, json.token)
    $showToast('Logged in successfully', 'success', 2000)
    router.push('/home')
  } else if (response.status === 404) {
    $showToast('User with given email not found', 'error', 2000)
  } else if (response.status === 401) {
    $showToast('Incorrect password', 'error', 2000)
  }
  isLoginButtonDisabled.value = false
}
</script>
