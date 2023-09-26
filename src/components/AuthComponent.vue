<template>
  <slot />
</template>

<script>
import queryString from "query-string";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "src/stores/userStore";

export default defineComponent({
  name: "AuthComponent",

  setup() {
    const routeHash = useRoute().hash;
    const router = useRouter();

    const userStore = useUserStore();
    const params = ref(null);

    function saveToken() {
      params.value = queryString.parse(routeHash);
      userStore.session.accessToken = params.value.access_token;
    }

    function fetchRoles() {
      return axios
        .get(`${userStore.session.oAuthServer}api/roles`, {
          headers: { Authorization: `Bearer ${userStore.session.accessToken}` },
        })
        .then((response) => {
          const roles = response.data.roles;
          userStore.session.userRoles = roles;
        })
        .catch((e) => console.error("Fetch Roles Error:", e));
    }

    function fetchUser() {
      return axios
        .get(`${userStore.session.oAuthServer}api/me`, {
          headers: { Authorization: `Bearer ${userStore.session.accessToken}` },
        })
        .then((response) => {
          userStore.session.user = response.data;
          userStore.userLoading = false;
          // if (process.env.NODE_ENV === 'production') {
          //   this.$ma.setUserProperties({name: user.value.username})
          //   this.$ma.identify({userId: user.value.username})
          // }
        })
        .catch((e) => {
          console.error("ERROR AUTH", e);
        });
    }

    onMounted(() => {
      saveToken();
      if (userStore.session.accessToken) {
        Promise.all([fetchRoles(), fetchUser()])
          .then(() => {
            if (localStorage.getItem(params.value.state)) {
              let destination = localStorage.getItem(params.value.state);
              localStorage.removeItem(params.value.state);
              router.push(destination);
            } else {
              router.push("/");
            }
          })
          .catch((err) => {
            console.error("FETCH USER AND ROLES ERROR:", err);
          });
      }
    });
  },
});
</script>
