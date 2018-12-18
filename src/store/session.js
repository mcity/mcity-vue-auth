import { uuidv4 } from '../utils'

const state = {
  user: {},
  userRoles: process.env.VUE_APP_TESTING === 'true' ? ['MCITY'] : null,
  accessToken: process.env.VUE_APP_TESTING === 'true' ? 'test' : null,
  oAuthServer: process.env.VUE_APP_OAUTH_SERVER,
  oAuthKey: process.env.VUE_APP_OAUTH_KEY,
  redirectURI: process.env.VUE_APP_REDIRECT_URI,
  silentRedirectURI: `${process.env.VUE_APP_HOST}/refresh.html`,
  oAuthScope: process.env.VUE_APP_OAUTH_SCOPE,
  oAuthState: uuidv4(),
  iframeRef: null,
  showIframe: false
}

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  },
  setUserRoles (state, payload) {
    state.userRoles = payload
  },
  setAccessToken (state, payload) {
    state.accessToken = payload
  },
  setIframeRef (state, payload) {
    state.iframeRef = payload
  },
  setShowIframe (state, payload) {
    state.showIframe = payload
  }
}

const getters = {
  getUser: state => state.user,
  getUserRoles: state => state.userRoles,
  getAccessToken: state => state.accessToken,
  getAuthURL: ({ oAuthServer, oAuthKey, redirectURI, oAuthScope, oAuthState } = state) => {
    return `${oAuthServer}oauth/authorize?response_type=token&client_id=${oAuthKey}&redirect_uri=${redirectURI}&scope=${oAuthScope}&state=${oAuthState}`
  },
  getOAuthState: state => state.oAuthState,
  getOAuthServer: state => state.oAuthServer,
  getRefreshAuthURL: ({ oAuthServer, oAuthKey, silentRedirectURI, oAuthScope, oAuthState } = state) => {
    return `${oAuthServer}oauth/authorize?response_type=token&client_id=${oAuthKey}&redirect_uri=${silentRedirectURI}&scope=${oAuthScope}&state=${oAuthState}`
  },
  getIframeRef: state => state.iframeRef,
  getShowIframe: state => state.showIframe,
  getSilentRedirect: state => state.silentRedirectURI
}

export default {
  state,
  getters,
  mutations
}