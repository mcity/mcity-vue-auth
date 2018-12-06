# vue-common-files
Common vue files used across Mcity projects.

# Usage
## Env Setup
  - Create file `.env.local` if it does not already exist.
  - Add the following variables to this file.
  ```
  VUE_APP_API_URL=http://localhost:5000
  VUE_APP_MIXPANEL_TOKEN=value
  VUE_APP_OAUTH_KEY=value
  VUE_APP_HOST=http://localhost:8080
  VUE_APP_OAUTH_SERVER=https://keys.um.city/
  VUE_APP_REDIRECT_URI=http://localhost:8080/authorized
  VUE_APP_OAUTH_SCOPE=email+roles
  ```

## App Setup
  - After the default router view in the `App.vue` template, add a named router view to `App.vue` with `<router-view name="auth"/>`
  - Import `authRefresh` component with 
  `import authRefresh from 'mcity-vue-auth/components/RefreshAuthiFrame.vue'`
  - In the template of `App.vue`, after the router-view, add the imported `authRefresh` component
  ```
  <auth-refresh
    v-if="getShowIframe"
    adminRole="PROJECTADMIN"
  >
  </auth-refresh>
  ```

## Router Setup
  - Import `AuthComponent` into the Vue Router `index.js` file with `import 'AuthComponent' from 'mcity-vue-auth/components/AuthComponent.vue'`
  - Add a new top-level route, `/authorized`
  ```
  {
    path: '/authorized',
    name: 'OverviewAuth',
    components: {
      auth: AuthComponent
    },
    meta: {
      authorized: true
    }
  },
  ```
  - Import the `checkRequiresAuth` function into the Vue router `index.js` file with 
  `import { checkRequiresAuth } from 'mcity-vue-auth/router/beforeEachHooks'`
  - If it is not already there, import the vuex store into the router. 
  `import store from '../store'`
  - Add the following line before the export of the router: 
  `router.beforeEach(checkRequiresAuth.bind({ $store: store }))`

## Vuex Setup
  - Add the `session` Vuex module to the store.
  ```
  import session from 'mcity-vue-auth/store/session'

  export default new Vuex.Store({
    modules: {
      session
    },
  }
  ```

# Adding Changes
## Babel Transpilation
  - After making code changes, rerun babel by running `npm run build`
  - Make sure to commit these built files.