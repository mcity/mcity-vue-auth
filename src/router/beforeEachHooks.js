import useSessionStore from "../store/session.js";
export function checkRequiresAuth(to, from, next) {
  const $store = useSessionStore();
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if ($store.accessToken) {
      if (to.matched.some((route) => route.meta.requiresApproved)) {
        if (
          $store.getUserRoles.includes("UNAPPROVED") ||
          $store.getUserRoles.includes("BANNED")
        ) {
          location.href = $store.unapprovedURL;
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      localStorage.setItem($store.oAuthState, to.fullPath);
      location.href = $store.getAuthURL;
    }
  } else {
    next();
  }
}
