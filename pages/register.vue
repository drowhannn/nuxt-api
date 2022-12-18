<template>
  <div class="w-full h-screen grid place-content-center text-blue-500">
    <form class="px-6 py-2 border rounded-md flex flex-col gap-2 w-96" @submit.prevent="onSignUp">
      <h1 class="text-3xl uppercase font-extrabold text-center">Sign Up</h1>
      <div class="flex flex-col gap-2">
        <label for="text" class="font-bold text-base">Name:</label>
        <input
          type="name"
          pattern="^[a-zA-Z]+\s[a-zA-Z]+$"
          placeholder="Enter your Name"
          class="input-primary"
          v-model="registerData.name"
          required
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="email" class="font-bold text-base">Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          class="input-primary"
          v-model="registerData.email"
          required
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password" class="font-bold text-base">Password(min 4 charecters) :</label>
        <input
          type="password"
          minlength="4"
          placeholder="Enter password"
          class="input-primary"
          v-model="registerData.password"
          required
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password" class="font-bold text-base">Confirm Password:</label>
        <input
          type="password"
          minlength="4"
          placeholder="Confirm password"
          class="input-primary"
          v-model="confirmPassword"
          required
        />
      </div>
      <p class="h-8 w-full text-red-500 text-sm">{{ errorMessage }}</p>
      <button class="btn-primary">Sign Up</button>
      <p class="text-sm text-blue-700 underline text-right">Forgot your Password?</p>
      <NuxtLink to="/register"><p class="text-sm text-blue-700 underline text-right">Sign Up</p></NuxtLink>
    </form>
  </div>
</template>
<script setup lang="ts">
import { Ref } from 'vue'

const errorMessage: Ref<string> = ref('')
const confirmPassword: Ref<string> = ref('')
const registerData: Ref<RegisterData> = ref({
  name: '',
  email: '',
  password: '',
})

interface RegisterData {
  name: string
  email: string
  password: string
}

const onSignUp = () => {
  if (registerData.value.password !== confirmPassword.value) {
    errorMessage.value = 'Password does not match!'
    return
  }
  fetch('/auth/signup/', { method: 'POST', body: JSON.stringify(registerData.value) }).then((response) => {
    console.log(response)
  })
}
</script>
