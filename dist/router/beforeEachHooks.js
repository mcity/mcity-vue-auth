"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkRequiresAuth=checkRequiresAuth;function checkRequiresAuth(a,b,c){a.matched.some(function(a){return a.meta.requiresAuth})?(console.log("checking if user is authenticated"),this.$store.getters.getAccessToken?a.matched.some(function(a){return a.meta.requiresApproved})&&(console.log("checking if user is approved"),console.log(this.$store.getters.getUserRoles),this.$store.getters.getUserRoles.includes("UNAPPROVED")||this.$store.getters.getUserRoles.includes("BANNED")?(console.log("user is not approved"),location.href=this.$store.getters.getUnapprovedURL):(console.log("user is approved"),c())):(localStorage.setItem(this.$store.getters.getOAuthState,a.fullPath),location.href=this.$store.getters.getAuthURL)):c()}