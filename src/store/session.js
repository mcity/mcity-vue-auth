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

  getters: {
    getFullName: (state) => `${state.user.first_name} ${state.user.last_name}`,
    getUserRoles: (state) => {
      return !state.userRoles ? [] : state.userRoles;
    },
    getAuthURL: ({
      oAuthServer,
      oAuthKey,
      redirectURI,
      oAuthScope,
      oAuthState,
    } = state) => {
      return `${oAuthServer}oauth/authorize?response_type=token&client_id=${oAuthKey}&redirect_uri=${redirectURI}&scope=${oAuthScope}&state=${oAuthState}`;
    },
    getRefreshAuthURL: ({
      oAuthServer,
      oAuthKey,
      silentRedirectURI,
      oAuthScope,
      oAuthState,
    } = state) => {
      return `${oAuthServer}oauth/authorize?response_type=token&client_id=${oAuthKey}&redirect_uri=${silentRedirectURI}&scope=${oAuthScope}&state=${oAuthState}`;
    },
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
