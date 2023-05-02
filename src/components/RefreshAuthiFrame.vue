<template>
  <iframe
    id="auth-iframe"
    width="600"
    height="600"
    :src="url"
  >
  </iframe>
</template>

<script>

import { defineComponent, onMounted, ref } from 'vue'
import queryString from 'query-string'
import { computed } from '@vue/reactivity'
import { useAuthStore } from '../store/session'

export default defineComponent({
  name: 'RefreshAuthiFrame',
  setup() {
    const authStore = useAuthStore()
    const iframeRef = ref(authStore.iframeRef)
    const url = ref(null)
    
    const getSilentRedirect = ref(authStore.silentRedirectURI)
    const getRefreshAuthURL = ref(authStore.getRefreshAuthURL)


    const setAccessToken = ref(authStore.setAccessToken)
    const setShowIframe = ref(authStore.setShowIframe)

    const pollIframe = (redirectUri, { contentWindow: iframe }) => {
      return new Promise((resolve, reject) => {
        const redirectUriPath = queryString.parseUrl(redirectUri).url

        let pollingInterval = setInterval(() => {
          const iframePath = queryString.parseUrl(iframe.location.href).url
          try {
            if (iframePath === redirectUriPath) {
              if (iframe.location.hash) {
                // Extracts url params from hash segment
                const params = queryString.parse(iframe.location.hash)

                if (params.error) {
                  reject(new Error(params.error))
                } else {
                  resolve(params)
                }
              } else {
                reject(new Error('OAuth redirect has occurred but no query or hash parameters were found.'))
              }
              clearInterval(pollingInterval)
              pollingInterval = null
            }
          } catch (e) {
            // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
          }
        }, 250)
      })
    }

    onMounted(() => {
      iframeRef.value = document.getElementById('auth-iframe')
      url.value = getRefreshAuthURL.value
      pollIframe(getSilentRedirect.value, iframeRef.value)
        .then(({access_token, expires_in}) => {
          setAccessToken(access_token)
          setShowIframe(false)

          setTimeout(() => {
            setShowIframe(true)
            // Sets timeout value to 10 mins before expires_in
          }, (expires_in - 10 * 60) * 1000)
        })
        .catch(err => { 
          console.error(err)
        })
    })
    return {url}
  }
})

</script>

<style scoped>
iframe {
  display: none;
}

</style>
