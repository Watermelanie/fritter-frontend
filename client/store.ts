import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    showSensitiveContent: false,
    showHiddenFreet: false,
    warning: false, // show warning if found offensive content in freet
    filteredContent: {}, // words that were filtered
    freetContent: null
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      const allFreets = [];
        for (const freet of res) {
          const url = `/api/reports/${freet._id}`
          const r = await fetch(url);
          const res = await r.json();
          if (!r.ok) {
            throw new Error(res.error);
          }
          allFreets.push([freet, res]);
          
        }
      state.freets = allFreets;
    },
    setSensitiveContentSetting(state, setting) {
      state.showSensitiveContent = setting;
    },
    setHiddenFreetSetting(state, setting) {
      state.showHiddenFreet = setting;
    },
    showWarning(state, setting) {
      state.warning = setting;
    },
    setFilteredContent(state, content) {
      state.filteredContent = content;
    },
    setFreetContent(state, content) {
      state.freetContent = content
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
