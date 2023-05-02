<template>
  <slot />
</template>

<script>
import queryString from 'query-string'
import { defineComponent, getCurrentInstance, onMounted, ref, render } from 'vue'
import { useAuthStore } from '../store/session'
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'
// import { computed } from '@vue/reactivity'
// import { mapGetters, mapMutations } from 'vuex'

export default defineComponent({
  name: 'AuthComponent',
  props: {
    route: Object,
    router: Object,
    $props: String
  },
  setup(props, context) {
    console.log({props})
    const router = props.router
    const route = props.route
    const testRoute = useRoute().fullPath
    console.log({testRoute})
    const instance = getCurrentInstance()
    const authStore = useAuthStore()
    const user = ref(authStore.user)
    const url = ref(authStore.oAuthServer)
    const accessToken = ref(authStore.accessToken)
    const params = ref(null)

    function saveToken() {
      // console.log('SAVE ACCESS TOKEN ROUTE:', route)
      params.value = queryString.parse(route.hash)
      authStore.accessToken = params.value.access_token
    }

    // TODO: Method not being used. could remove
    function scheduleRefresh() {
      if (this.params.access_token && this.params.expires_in) {
        setTimeout(() => {
          authStore.showIframe = true
          // setShowIframe(true)
          // Sets timeout value to 10 mins before expires_in
        }, (params.expires_in - 10 * 60) * 1000)
      }
    }

    function fetchRoles() {
      console.log('URL', url.value)
      return axios.get(`${url.value}api/roles`)
        .then(response => {
          console.log('INSIDE')
          const roles = response.data.roles
          const adminStatus = roles.includes(authStore.adminRole)
          authStore.userRoles = roles
          // setUserRoles(roles)
          setIsUserAdmin(adminStatus)
        })
      .catch(e => console.error('Fetch Roles Error:', e)) //logError Does not exists
    }

    function fetchUser() {
      return axios.get(`${url.value}api/me`)
      .then(response => {
        authStore.user = response.data
        // setUser(response.data)
        setIsUserLoading(false)
        if (process.env.NODE_ENV === 'production') {
          this.$ma.setUserProperties({name: user.value.username})
          this.$ma.identify({userId: user.value.username})
        }
      })
      .catch(e => {console.log('ERROR AUTH', e)})
    }

    // function setUserRoles(roles) {
    //   authStore.setUserRoles(roles)
    // }
    function setIsUserAdmin(isAdmin) {
      authStore.setIsUserAdmin(isAdmin)
    }
    // function setUser(user) {
    //   authStore.setUser(user)
    // }
    function setIsUserLoading(loadingStatus) {
      authStore.setIsUserLoading(loadingStatus)
    }
    function setShowIframe(showIframe) {
      authStore.setShowIframe(showIframe)
    }
    // render(() => context.slots)

    onMounted(() => {
      saveToken()
      if (accessToken) {
        Promise.all([fetchRoles(), fetchUser()])
          .then(() => {
            if (localStorage.getItem(params.value.state)) {
              let destination = localStorage.getItem(params.value.state)
              localStorage.removeItem(params.value.state)
              router.push(destination) //TODO: need  $router here
            }
            else {
              router.push('/')
            }
          })
      }
    })

  }
})

</script>

<style>

</style>
