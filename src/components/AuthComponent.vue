<script setup>
import queryString from "query-string";
import { useSessionStore } from "../store/session.js";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const $route = useRoute();
const $router = useRouter();
const params = ref(null);
const sessionStore = useSessionStore();
const user = computed(() => sessionStore.user);
const url = computed(() => sessionStore.oAuthServer);
const accessToken = computed(() => sessionStore.accessToken);

function saveToken() {
  params.value = queryString.parse($route.hash);
  sessionStore.setAccessToken(params.value.access_token);
}

function scheduleRefresh() {
  if (params.value.access_token && params.value.expires_in) {
    setTimeout(() => {
      sessionStore.setShowIframe(true);
      // Sets timeout value to 10 mins before expires_in
    }, (params.value.expires_in - 10 * 60) * 1000);
  }
}

function fetchRoles() {
  return axios
    .get(`${url.value}api/roles`)
    .then((response) => {
      const roles = response.data.roles;
      const adminStatus = roles.includes(sessionStore.adminRole);
      sessionStore.setUserRoles(roles);
      sessionStore.setIsUserAdmin(adminStatus);
    })
    .catch((e) => this.logError(e));
}

function fetchUser() {
  return axios
    .get(`${url.value}api/me`)
    .then((response) => {
      sessionStore.setUser(response.data);
      sessionStore.setIsUserLoading(false);
      if (process.env.NODE_ENV === "production") {
        this.$ma.setUserProperties({ name: this.getUser.username });
        this.$ma.identify({ userId: this.getUser.username });
      }
    })
    .catch((e) => this.logError(e));
}

onMounted(() => {
  saveToken();
  if (sessionStore.accessToken) {
    Promise.all([fetchRoles(), fetchUser()]).then(() => {
      if (localStorage.getItem(params.value.state)) {
        let destination = localStorage.getItem(params.value.state);
        localStorage.removeItem(params.value.state);
        $router.push(destination);
      } else {
        $router.push("/");
      }
    });
  }
});
// methods: {
//   ...mapMutations([
//     "logError",
//     "setUserRoles",
//     "setIsUserAdmin",
//     "setUser",
//     "setIsUserLoading",
//     "setShowIframe",
//   ]),
</script>

<style></style>
