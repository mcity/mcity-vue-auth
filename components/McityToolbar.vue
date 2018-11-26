<template>
  <div>
    <v-navigation-drawer
      persistent
      v-model="drawer"
      :clipped="true"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, ind) in sidebarLinks"
          :key="ind"
          :href="(isUserAdmin || !item.lock) ? item.link : ''"
          target="_blank"
        >
          <v-list-tile-action>
            <v-icon color="primary">{{item.lock ? 'fa-lock' : item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content color="primary--text">
            {{item.text}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      dark 
      color="primary"
      :clipped-left="true"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/">
        <blockM></blockM>
      </router-link>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <slot name="buttons"></slot>
        
        <v-menu 
          left
          v-model="avatarMenu"
          :close-on-content-click="false"
        >
          <v-icon slot="activator">fa-user-circle</v-icon>
          <v-card>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    <a href="https://keys.um.city" 
                      target="_blank">
                      {{ fullname }}
                    </a>
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ username }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat
                    href="https://keys.um.city/password">
                    Change Password
                    <v-icon right>fa-fingerprint</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn flat
                    href="https://keys.um.city/logout">
                    Logout
                    <v-icon right>fa-sign-out-alt</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>

        <v-menu 
          open-on-hover 
          class="ml-3"
        >
          <v-icon slot="activator">fa-ellipsis-v</v-icon>
          <v-list>
            <v-list-tile
              @click="updatePresentationMode()">
              <v-list-tile-title>
                <v-icon>fa-text-height</v-icon>
                {{ presentationText }}
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile
              @click="getHelp">
              <v-list-tile-title>
                <v-icon>fa-question-circle</v-icon>
                Help
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import blockM from './BlockM.vue'
export default {
  components: {
    blockM
  },
  props: {
    fullname: {
      required: true,
      type: String
    },
    username: {
      required: true,
      type: String
    },
    presentationText: {
      required: true,
      type: String
    },
    isUserAdmin: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    getHelp () {
      window.location.href = 'mailto:mcity-engineering@umich.edu'
    }
  },
  data () {
    return {
      drawer: false,
      clipped: false,
      title: 'Project Tracking',
      avatarMenu: false,
      sidebarLinks: [
        {
          icon: 'fa-key',
          link: 'https://keys.um.city/',
          text: 'Login/Keys',
          lock: false
        },
        {
          icon: 'fa-home',
          link: 'https://members.um.city/',
          text: 'Member Portal',
          lock: true
        },
        {
          icon: 'fa-chart-line',
          link: 'https://projects.um.city',
          text: 'Project Dashboard',
          lock: false
        },
        {
          icon: 'fa-calendar-alt',
          link: 'https://calendar.um.city/',
          text: 'Track Scheduling',
          lock: true
        },
        {
          icon: 'fa-traffic-light',
          link: 'https://mcity-control-frontend.herokuapp.com/',
          text: 'Track Control',
          lock: true
        },
        {
          icon: 'fa-shuttle-van',
          link: 'https://mcity.doublemap.com/map/',
          text: 'Shuttle Tracker',
          lock: false
        },
        {
          icon: 'fa-database',
          link: 'https://gauge.um.city/',
          text: 'Data Guage',
          lock: true
        }
      ]
    }
  }
}
</script>

<style>

</style>
