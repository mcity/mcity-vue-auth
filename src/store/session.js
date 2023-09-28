import { defineStore } from "pinia";
import { uuidv4 } from "../utils";

const useSessionStore = defineStore("session", {
  state: () => ({
    user: {},
    userRoles: import.meta.env.VITE_TESTING === "true" ? ["MCITY"] : [],
    accessToken: import.meta.env.VITE_TESTING === "true" ? "test" : null,
    oAuthServer: import.meta.env.VITE_OAUTH_SERVER,
    oAuthKey: import.meta.env.VITE_OAUTH_KEY,
    redirectURI: import.meta.env.VITE_REDIRECT_URI,
    silentRedirectURI: `${import.meta.env.VITE_HOST}/refresh.html`,
    oAuthScope: import.meta.env.VITE_OAUTH_SCOPE,
    oAuthState: uuidv4(),
    iframeRef: null,
    showIframe: false,
    unapprovedURL: import.meta.env.VITE_UNAPPROVED_URL,
    isUserLoading: false,
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
    setIsUserLoading(payload) {
      this.isUserLoading = payload;
    },
  },
});

export default useSessionStore;
