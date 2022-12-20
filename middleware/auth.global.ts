import { useLoginStore } from '~/store/loginStore'

export default defineNuxtRouteMiddleware((to) => {
  const loginStore = useLoginStore()
  if (!loginStore.isLoggedIn && to.path !== '/' && to.path !== '/register') {
    navigateTo('/')
  } else if (loginStore.isLoggedIn && (to.path === '/' || to.path === '/register')) {
    navigateTo('/home')
  }
})
