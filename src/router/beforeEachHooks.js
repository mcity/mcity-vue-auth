export function checkRequiresAuth (to, from, next) {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (this.$store.getters.getAccessToken) {
      next()
    } else {
      localStorage.setItem(this.$store.getters.getOAuthState, to.fullPath)
      location.href = this.$store.getters.getAuthURL
    }
  } else {
    next()
  }
}

export function checkRequiresApproved(to, from, next) {
  if (to.matched.some(route => route.meta.requiresApproved)) {
    if (this.$store.getters.getUserRoles.includes('UNAPPROVED') || this.$store.getters.getUserRoles.includes('BANNED')) {
      location.href = this.$store.getters.getUnapprovedURL
    } else {
      next()
    }
  }
}
