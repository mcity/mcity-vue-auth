<script>
import queryString from 'query-string'
import { defineComponent, onMounted, ref, render } from 'vue'
import { useAuthStore } from '../store/session'
import { computed } from '@vue/reactivity'
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'

export default defineComponent({
  name: 'AuthComponent',
  setup() {
    const authStore = useAuthStore()
    const user = ref(authStore.user)
    const url = ref(authStore.oAuthServer)
    const accessToken = ref(authStore.accessToken)
    const params = ref(null)

    function saveToken() {
      params.value = queryString.parse(this.$route.hash)
      setAccessToken(params.value.access_token)
    }

    // TODO: Method not being used. could remove
    function scheduleRefresh() {
      if (this.params.access_token && this.params.expires_in) {
        setTimeout(() => {
          setShowIframe(true)
          // Sets timeout value to 10 mins before expires_in
        }, (params.expires_in - 10 * 60) * 1000)
      }
    }

    function fetchRoles() {
      return axios.get(`${url.value}api/roles`)
        .then(response => {
          const roles = response.data.roles
          const adminStatus = roles.includes(authStore.adminRole)
          setUserRoles(roles)
          setIsUserAdmin(adminStatus)
        })
      .catch(e => this.logError(e)) //logError Does not exists
    }

    function fetchUser() {
      return axios.get(`${url.value}api/me`)
      .then(response => {
        this.setUser(response.data)
        setIsUserLoading(false)
        if (process.env.NODE_ENV === 'production') {
          this.$ma.setUserProperties({name: user.value.username})
          this.$ma.identify({userId: user.value.username})
        }
      })
      .catch(e => this.logError(e))
    }

    function setAccessToken() {
      this.authStore.setAccessToken()
    }
    function setUserRoles() {
      this.authStore.setUserRoles()
    }
    function setIsUserAdmin() {
      this.authStore.setIsUserAdmin()
    }
    function setUser() {
      this.authStore.setUser()
    }
    function setIsUserLoading() {
      this.authStore.setIsUserLoading()
    }
    function setShowIframe() {
      this.authStore.setShowIframe()
    }

    onMounted(() => {
      saveToken()
      if (accessToken) {
        Promise.all([fetchRoles(), fetchUser()])
          .then(() => {
            if (localStorage.getItem(params.value.state)) {
              let destination = localStorage.getItem(params.value.state)
              localStorage.removeItem(params.value.state)
              this.$router.push(destination) //TODO: need  $router here
            }
            else {
              this.$router.push('/')
            }
          })
      }
    })

    return {
      authStore,
      user,
      url,
      accessToken
    }
  },
  render() {
    return this.$slots.default
  }
})

// const old =  {
//   render() {
//     return this.$slots.default
//   },
//   data () {
//     return {
//       params: null
//     }
//   },
//   computed: {
//     ...mapGetters([
//       'getUser'
//     ]),
//     url () {
//       return this.$store.getters.getOAuthServer
//     },
//     accessToken () {
//       return this.$store.getters.getAccessToken
//     }
//   },
//   mounted () {
//     this.saveToken()
//     if (this.accessToken) {
//       Promise.all([this.fetchRoles(), this.fetchUser()])
//         .then(() => {
//           if (localStorage.getItem(this.params.state)) {
//             let destination = localStorage.getItem(this.params.state)
//             localStorage.removeItem(this.params.state)
//             this.$router.push(destination)
//           }
//           else {
//             this.$router.push('/')
//           }
//         })
//     }
    
//   },
//   methods: {
//     ...mapMutations([
//       'logError',
//       'setUserRoles',
//       'setIsUserAdmin',
//       'setUser',
//       'setIsUserLoading',
//       'setShowIframe'
//     ]),
//     saveToken () {
//       this.params = queryString.parse(this.$route.hash)
//       this.$store.commit('setAccessToken', this.params.access_token)
//     },
//     scheduleRefresh () {
//       if (this.params.access_token && this.params.expires_in) {
//         setTimeout(() => {
//           this.$store.commit('setShowIframe', true)
//           // Sets timeout value to 10 mins before expires_in
//         }, (params.expires_in - 10 * 60) * 1000)
//       }
//     },
//     fetchRoles () {
//       return axios.get(`${this.url}api/roles`)
//         .then(response => {
//           const roles = response.data.roles
//           const adminStatus = roles.includes(this.$store.state.adminRole)
//           this.setUserRoles(roles)
//           this.setIsUserAdmin(adminStatus)
//         })
//       .catch(e => this.logError(e))
//     },
//     fetchUser () {
//       return axios.get(`${this.url}api/me`)
//       .then(response => {
//         this.setUser(response.data)
//         this.setIsUserLoading(false)
//         if (process.env.NODE_ENV === 'production') {
//           this.$ma.setUserProperties({name: this.getUser.username})
//           this.$ma.identify({userId: this.getUser.username})
//         }
//       })
//       .catch(e => this.logError(e))
//     }
//   }
// }
</script>

<style>

</style>
