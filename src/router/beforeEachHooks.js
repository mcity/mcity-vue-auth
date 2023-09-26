import { useUserStore } from "src/stores/userStore";

export function checkRequiresAuth(to, from, next) {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && to.meta.authorized === undefined) {
    if (userStore.session.accessToken) {
      next();
    } else {
      localStorage.setItem(userStore.session.oAuthState, to.fullPath);
      location.href = userStore.getAuthURL;
    }
  } else {
    next();
  }
}
