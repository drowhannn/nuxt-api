<template>
  <div class="w-full h-screen grid place-content-center text-blue-500">
    <form class="px-6 py-2 border rounded-md flex flex-col shadow-md gap-2 w-96" @submit.prevent="onSignUp">
      <h1 class="text-3xl uppercase font-extrabold text-center">Sign Up</h1>
      <div class="flex flex-col gap-2">
        <label for="text" class="font-bold text-base">Name:</label>
        <input type="name" pattern="^[a-zA-Z]+\s[a-zA-Z]+$" placeholder="Enter your Name" class="input-primary"
          v-model="registerData.name" required autocomplete="name" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="email" class="font-bold text-base">Email:</label>
        <input type="email" placeholder="Enter your email" class="input-primary" v-model="registerData.email" required
          autocomplete="email" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password" class="font-bold text-base">Password(min 4 charecters) :</label>
        <input type="password" minlength="4" placeholder="Enter password" class="input-primary"
          v-model="registerData.password" required />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password" class="font-bold text-base">Confirm Password:</label>
        <input type="password" minlength="4" placeholder="Confirm password" class="input-primary"
          v-model="confirmPassword" required />
      </div>
      <p class="h-8 w-full text-red-500 text-sm">{{ errorMessage }}</p>
      <button class="btn-primary" :disabled="disableSignUpButton">Sign Up</button>
      <NuxtLink to="/">
        <p class="text-sm text-blue-700 underline text-right">Already have an account? Log In</p>
      </NuxtLink>
    </form>
    <Modal v-if="showOTPModal">
      <div class="flex flex-col gap-10 items-center">
        <h1 class="text-xl font-bold">Verify your email</h1>
        <div class="flex flex-col gap-2">
          <label for="otp">Enter OTP:</label>
          <input type="text" class="input-primary" v-model="otp">
        </div>
        <div class="w-full flex gap-2">
          <button class="w-full bg-gray-500 text-white py-4 hover:bg-gray-700" :disabled="disableOTPButtons"
            @click="resendCode">Resend</button>
          <button class="w-full bg-blue-500 text-white py-4 hover:bg-blue-700" @click="verifyCode"
            :disabled="disableOTPButtons">Verify</button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import { Ref } from 'vue'

const router = useRouter()
const { $showToast, $hideToast } = useNuxtApp()

const showOTPModal = ref(false)
const disableSignUpButton = ref(false)
const disableOTPButtons = ref(false)

const errorMessage = ref('')
const confirmPassword = ref('')
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

const otp: Ref<string> = ref('')

const onSignUp = () => {
  if (registerData.value.password !== confirmPassword.value) {
    errorMessage.value = 'Password does not match!'
    return
  }

  disableSignUpButton.value = true
  const toast = $showToast('Creating new account...', 'info', false)

  fetch('/auth/signup/', { method: 'POST', body: JSON.stringify(registerData.value) })
    .then((response) => response.json()
    ).then(json => {
      $hideToast(toast)
      if (json.status === 'success') {
        $showToast(json.message, 'success', 2000)
        showOTPModal.value = true
      } else {
        $showToast(json.message, 'error', 2000)
      }
    })
    .catch((error) => {
      $hideToast(toast)
      $showToast('Some error occured. Try Again!', 'error', 2000)
    })

  disableSignUpButton.value = false
}

const verifyCode = () => {
  disableOTPButtons.value = true
  const toast = $showToast('Verifying OTP...', 'info', false)
  fetch('/auth/verify-otp/', { method: 'POST', body: JSON.stringify({ email: registerData.value.email, code: otp.value }) })
    .then((response) => response.json()).then(json => {
      if (json.status === 'success') {
        $hideToast(toast)
        $showToast(json.message, 'success', 2000)
        router.push('/')
      } else {
        $hideToast(toast)
        $showToast(json.message, 'error', 2000)
      }
    })
    .catch((error) => {
      $hideToast(toast)
      $showToast('Some error occured. Try Again!', 'error', 2000)
    })
  disableOTPButtons.value = false
}

const resendCode = () => {
  disableOTPButtons.value = true
  const toast = $showToast('Resending OTP...', 'info', false)
  fetch('/auth/resend-otp/', { method: 'POST', body: JSON.stringify({ email: registerData.value.email }) })
    .then((response) => response.json()).then(json => {
      if (json.status === 'success') {
        $hideToast(toast)
        $showToast(json.message, 'success', 2000)
      } else {
        $hideToast(toast)
        $showToast(json.message, 'error', 2000)
      }
    })
    .catch((error) => {
      $hideToast(toast)
      $showToast('Some error occured. Try Again!', 'error', 2000)
    })
  disableOTPButtons.value = false
}

</script>
