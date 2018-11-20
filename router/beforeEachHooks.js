export function saveToken (to, from, next) {
  console.log('top token')
  if (to.matched.some(route => route.meta.authorized)) {
    const params = this.queryString.parse(to.hash)
    if (params.access_token && params.expires_in) {
      setTimeout(() => {
        this.$store.commit('setShowIframe', true)
        // Sets timeout value to 10 mins before expires_in
      }, (params.expires_in - 10 * 60) * 1000)
      this.$store.commit('setAccessToken', params.access_token)
      next('/')
    }
  }
  next()
}

export function checkRequiresAuth (to, from, next) {
  console.log('top')
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (this.$store.getters.getAccessToken) {
      console.log('test')
      next()
    } else {
      console.log('here')
      location.href = this.$store.getters.getAuthURL
      next(false)
    }
  } else {
    console.log('else')
    next()
  }
}
