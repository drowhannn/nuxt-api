import { defineStore } from 'pinia'
import { Ref } from 'vue'

export const useLoginStore = defineStore(
  'login',
  () => {
    const userEmail: Ref<string> = ref('')
    const token: Ref<string> = ref('')

    const isLoggedIn = computed(() => {
      return Boolean(token.value)
    })

    const onLogIn = (email: string, t: string): void => {
      userEmail.value = email
      token.value = t
    }

    const onLogOut = (): void => {
      userEmail.value = ''
      token.value = ''
    }

    return { userEmail, token, isLoggedIn, onLogIn }
  },
  { persist: true }
)
