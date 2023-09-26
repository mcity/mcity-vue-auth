import { defineStore } from "pinia";
import { uuidv4 } from "../utils";

export const useSessionStore = defineStore("session", {
  state: () => ({
    user: {},
    userRoles: process.env.VUE_APP_TESTING === "true" ? ["MCITY"] : [],
    accessToken: process.env.VUE_APP_TESTING === "true" ? "test" : null,
    oAuthServer: process.env.VUE_APP_OAUTH_SERVER,
    oAuthKey: process.env.VUE_APP_OAUTH_KEY,
    redirectURI: process.env.VUE_APP_REDIRECT_URI,
    silentRedirectURI: `${process.env.VUE_APP_HOST}/refresh.html`,
    oAuthScope: process.env.VUE_APP_OAUTH_SCOPE,
    oAuthState: uuidv4(),
    iframeRef: null,
    showIframe: false,
    unapprovedURL: process.env.VUE_APP_UNAPPROVED_URL,
  }),
  /* 
    some getters can be replaced by accessing the value directly via sessionStore.[state_key]
    pinia supports accessing state this way. The getters that can be replaced will be marked
    with a 'TODO: DONT USE'. Access directly. Any code that uses this style of getters, will
    have to be updated.
  */
  getters: {
    getUser: (state) => state.user, // TODO: DONT USE
    getFullName: (state) => `${state.user.first_name} ${state.user.last_name}`,
    getUserRoles: (state) => {
      return !state.userRoles ? [] : state.userRoles;
    },
    getAccessToken: (state) => state.accessToken, // TODO: DONT USE
    getAuthURL: ({
      oAuthServer,
      oAuthKey,
      redirectURI,
      oAuthScope,
      oAuthState,
    } = state) => {
      return `${oAuthServer}oauth/authorize?response_type=token&client_id=${oAuthKey}&redirect_uri=${redirectURI}&scope=${oAuthScope}&state=${oAuthState}`;
    },
    getUnapprovedURL: (state) => state.unapprovedURL, // TODO: DONT USE
    getOAuthState: (state) => state.oAuthState, // TODO: DONT USE
    getOAuthServer: (state) => state.oAuthServer, // TODO: DONT USE
    getRefreshAuthURL: ({
      oAuthServer,
      oAuthKey,
      silentRedirectURI,
      oAuthScope,
      oAuthState,
    } = state) => {
      return `${oAuthServer}oauth/authorize?response_type=token&client_id=${oAuthKey}&redirect_uri=${silentRedirectURI}&scope=${oAuthScope}&state=${oAuthState}`;
    },
    getIframeRef: (state) => state.iframeRef, // TODO: DONT USE
    getShowIframe: (state) => state.showIframe, // TODO: DONT USE
    getSilentRedirect: (state) => state.silentRedirectURI, // TODO: DONT USE
  },
  actions: {
    setUser(payload) {
      this.user = payload;
    },
    setUserRoles(payload) {
      this.userRoles = payload;
    },
    setAccessToken(payload) {
      this.accessToken = payload;
    },
    setIframeRef(payload) {
      this.iframeRef = payload;
    },
    setShowIframe(payload) {
      this.showIframe = payload;
    },
  },
});
