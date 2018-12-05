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
import { mapMutations, mapGetters } from 'vuex'
import queryString from 'query-string'
export default {
  data () {
    return {
      iframeRef: null,
      url: null
    }
  },
  computed: {
    ...mapGetters([
      'getIframeRef',
      'getSilentRedirect',
      'getRefreshAuthURL'
    ])
  },
  methods: {
    ...mapMutations([
      'setAccessToken',
      'setShowIframe'
    ]),
    pollIframe (redirectUri, { contentWindow: iframe }) {
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
  },
  mounted () {
    this.iframeRef = document.getElementById('auth-iframe')
    this.url = this.getRefreshAuthURL
    this.pollIframe(this.getSilentRedirect, this.iframeRef)
      .then(({access_token, expires_in}) => {
        this.setAccessToken(access_token)
        this.setShowIframe(false)

        setTimeout(() => {
          this.setShowIframe(true)
          // Sets timeout value to 10 mins before expires_in
        }, (expires_in - 10 * 60) * 1000)
      })
      .catch(err => { 
        console.log(err)
      })
  }
}
</script>

<style scoped>
iframe {
  display: none;
}

</style>
