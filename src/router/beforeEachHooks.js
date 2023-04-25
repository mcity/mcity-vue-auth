import { useAuthStore } from "../store/session"

export function checkRequiresAuth (to, from, next) {
  // const authStore = useAuthStore()
  // this.$store = useAuthStore()
  console.log('ROUTE', to)
  if (to.matched.some(route => route.meta.requiresAuth)) {
    
    if (this.$store.session.accessToken) {
      console.log('STORE: accessToken', this.$store.session.accessToken)
      next()
    } else {
      console.log('STORE: else accessToken', this.$store.session)
      localStorage.setItem(this.$store.session.oAuthState, to.fullPath)
      
      console.log('STORAGE ITEM', localStorage.getItem(this.$store.session.oAuthState))
      console.log('LOCATION:', this.$store.getAuthURL)

      location.href = this.$store.getAuthURL
      console.log('DONE')
    }
  } else {
    console.log('STORE: else', this.$store.session)
    next()
  }
}
