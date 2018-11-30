# vue-common-files
Common vue files used across Mcity projects.

# Usage
## App Setup
  - After the default router view in the `App.vue` template, add a named router view to `App.vue` with `<router-view name="auth"/>`
  - Import `authRefresh` component with 
  `import authRefresh from 'mcity-vue-auth/components/RefreshAuthiFrame.vue'`
  - In the template of `App.vue`, after the router-view, add the imported `authRefresh` component
  ```
  <auth-refresh
    v-if="getShowIframe"
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
