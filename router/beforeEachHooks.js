export function checkRequiresAuth (to, from, next) {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (this.$store.getters.getAccessToken) {
      next()
    } else {
      location.href = this.$store.getters.getAuthURL
    }
  } else {
    next()
  }
}
