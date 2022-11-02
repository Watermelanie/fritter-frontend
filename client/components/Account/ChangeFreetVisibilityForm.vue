<template>
  <div>
    <label for="toggle_button1">
        <span v-if="$store.state.showSensitiveContent" class="toggle__label">On </span>
        <span v-if="! $store.state.showSensitiveContent" class="toggle__label">Off </span>

        <input type="checkbox" id="toggle_button1" v-model="checkedValue">
        <span class="toggle__switch"></span>
    </label>
    <label for="toggle_button2">
        <span v-if="$store.state.showHiddenFreet" class="toggle__label">On</span>
        <span v-if="! $store.state.showHiddenFreet" class="toggle__label">Off</span>

        <input type="checkbox" id="toggle_button2" v-model="checkedValue">
        <span class="toggle__switch"></span>
    </label>
  </div>
</template>
<script>
export default {
  name: 'ChangeFreetVisibilityForm',
  props: {
    // sensitivitySettings data of user
    sensitivitySettings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showSensitiveContent: false,
      showHiddenFreet: false,
      alerts: {} // Displays success/error messages
    };
  },
  methods: {
    showSensitiveContent() {
      this.showSensitiveContent = true;
    },
    hideSensitiveContent() {
      this.showSensitiveContent = false;
    },
    showHiddenFreet() {
      this.showHiddenFreet = true;
    },
    hideHiddenFreet() {
      this.showHiddenFreet = false;
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/sensitivitySettings/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>