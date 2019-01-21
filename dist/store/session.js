"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.mutations=void 0;var _utils=require("../utils"),state={user:{},userRoles:"true"===process.env.VUE_APP_TESTING?["MCITY"]:null,accessToken:"true"===process.env.VUE_APP_TESTING?"test":null,oAuthServer:process.env.VUE_APP_OAUTH_SERVER,oAuthKey:process.env.VUE_APP_OAUTH_KEY,redirectURI:process.env.VUE_APP_REDIRECT_URI,silentRedirectURI:"".concat(process.env.VUE_APP_HOST,"/refresh.html"),oAuthScope:process.env.VUE_APP_OAUTH_SCOPE,oAuthState:(0,_utils.uuidv4)(),iframeRef:null,showIframe:!1},mutations={setUser:function c(a,b){a.user=b},setUserRoles:function c(a,b){a.userRoles=b},setAccessToken:function c(a,b){a.accessToken=b},setIframeRef:function c(a,b){a.iframeRef=b},setShowIframe:function c(a,b){a.showIframe=b}};exports.mutations=mutations;var getters={getUser:function b(a){return a.user},getFullName:function b(a){return"".concat(a.first_name," ").concat(a.last_name)},getUserRoles:function b(a){return a.userRoles},getAccessToken:function b(a){return a.accessToken},getAuthURL:function g(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:state,b=a.oAuthServer,c=a.oAuthKey,d=a.redirectURI,e=a.oAuthScope,f=a.oAuthState;return"".concat(b,"oauth/authorize?response_type=token&client_id=").concat(c,"&redirect_uri=").concat(d,"&scope=").concat(e,"&state=").concat(f)},getOAuthState:function b(a){return a.oAuthState},getOAuthServer:function b(a){return a.oAuthServer},getRefreshAuthURL:function g(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:state,b=a.oAuthServer,c=a.oAuthKey,d=a.silentRedirectURI,e=a.oAuthScope,f=a.oAuthState;return"".concat(b,"oauth/authorize?response_type=token&client_id=").concat(c,"&redirect_uri=").concat(d,"&scope=").concat(e,"&state=").concat(f)},getIframeRef:function b(a){return a.iframeRef},getShowIframe:function b(a){return a.showIframe},getSilentRedirect:function b(a){return a.silentRedirectURI}},_default={state:state,getters:getters,mutations:mutations};exports.default=_default;