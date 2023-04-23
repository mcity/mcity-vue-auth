import { useAuthStore } from "../store/session"

export function checkRequiresAuth (to, from, next) {
  const authStore = useAuthStore()
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (authStore.accessToken) {
      next()
    } else {
      localStorage.setItem(authStore.oAuthState, to.fullPath)
      location.href = authStore.getAuthURL()
    }
  } else {
    next()
  }
}
