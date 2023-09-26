import { useSessionStore } from "../store/session";

export function checkRequiresAuth(to, from, next) {
  const sessionStore = useSessionStore();
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (sessionStore.accessToken) {
      if (to.matched.some((route) => route.meta.requiresApproved)) {
        if (
          sessionStore.getUserRoles.includes("UNAPPROVED") ||
          sessionStore.getUserRoles.includes("BANNED")
        ) {
          location.href = sessionStore.unapprovedURL;
        } else {
          next();
        }
      }
    } else {
      localStorage.setItem(sessionStore.oAuthState, to.fullPath);
      location.href = sessionStore.getAuthURL;
    }
  } else {
    next();
  }
}
