<script>
import queryString from 'query-string'
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
export default {
  render() {
    return this.$slots.default
  },
  data () {
    return {
      params: null
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    url () {
      return this.$store.getters.getOAuthServer
    },
    accessToken () {
      return this.$store.getters.getAccessToken
    }
  },
  mounted () {
    this.saveToken()
    if (this.accessToken) {
      Promise.all([this.fetchRoles(), this.fetchUser()])
        .then(() => {
          if (localStorage.getItem(this.params.state)) {
            let destination = localStorage.getItem(this.params.state)
            localStorage.removeItem(this.params.state)
            this.$router.push(destination)
          }
          else {
            this.$router.push('/')
          }
        })
    }
    
  },
  methods: {
    ...mapMutations([
      'logError',
      'setUserRoles',
      'setIsUserAdmin',
      'setUser',
      'setIsUserLoading',
      'setShowIframe'
    ]),
    saveToken () {
      this.params = queryString.parse(this.$route.hash)
      this.$store.commit('setAccessToken', this.params.access_token)
    },
    scheduleRefresh () {
      if (this.params.access_token && this.params.expires_in) {
        setTimeout(() => {
          this.$store.commit('setShowIframe', true)
          // Sets timeout value to 10 mins before expires_in
        }, (params.expires_in - 10 * 60) * 1000)
      }
    },
    fetchRoles () {
      return axios.get(`${this.url}api/roles`)
        .then(response => {
          const roles = response.data.roles
          const adminStatus = roles.includes(this.$store.state.adminRole)
          this.setUserRoles(roles)
          this.setIsUserAdmin(adminStatus)
        })
      .catch(e => this.logError(e))
    },
    fetchUser () {
      return axios.get(`${this.url}api/me`)
      .then(response => {
        this.setUser(response.data)
        this.setIsUserLoading(false)
        if (process.env.NODE_ENV === 'production') {
          this.$ma.setUserProperties({name: this.getUser.username})
          this.$ma.identify({userId: this.getUser.username})
        }
      })
      .catch(e => this.logError(e))
    }
  }
}
</script>

<style>

</style>
