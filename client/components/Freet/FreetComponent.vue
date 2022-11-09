<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <p v-if="$store.state.username !== freet.author && counts.misinformationCount >= 20">This freet may contain inaccurate information.</p>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
      <div v-if="$store.state.username !== freet.author">
        <button
          v-if="!reporting"
          @click="startReporting"
        >
          Report Freet
        </button>
        <button
          v-if="reporting"
          @click="submitReport"
        >
          Submit report
        </button>
        <button
          v-if="reporting"
          @click="stopReporting"
        >
          Discard report
        </button>
      </div>
    </header>
    <div v-if="reporting">
      Type:
      <select
        id="reportType"
        name="reportType"
        @input="reportType = $event.target.value">
        <option />
        <option value="offensive">Offensive</option>
        <option value="sensitive">Sensitive</option>
        <option value="misinformation">Misinformation</option>
      </select>
    </div>
    <textarea
      v-if="reporting"
      class="content"
      @input="reportContent = $event.target.value"
    />
    <textarea
      v-else-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p v-else-if="!showFreet_ && $store.state.username !== freet.author && (counts.offensiveCount >= 20 || counts.totalCount >= 10) && !$store.state.showHiddenFreet">
      This is hidden freet.
      <button @click="showFreet">Show hidden freet</button>
    </p>
    <p v-else-if="!showFreet_ && $store.state.username !== freet.author && counts.sensitiveCount >= 10 && !$store.state.showSensitiveContent">
      This freet may contain sensitive content.
      <button @click="showFreet">Show sensitive content</button>
    </p>
    <p
      v-else
      class="content"
    >
      {{ freet.content }} {{counts}}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    counts: {
      type: Object
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      reporting: false, // Whether or not this freet is in reporting mode
      reportContent: "", // content of report
      reportType: "", // type of report
      showFreet_: false
    };
  },
  methods: {
    showFreet() {
      this.showFreet_ = true;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    startReporting() {
      /**
       * Enables reporting mode on this freet.
       */
      this.reporting = true; // Keeps track of if a freet is being reported
    },
    stopReporting() {
      /**
       * Disables reporting mode on this freet.
       */
      this.reporting = false;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async submitReport() {
      /**
       * Create a report
       */
      if (!this.reportType) {
        const error = 'Error: Please choose the type of report';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const options = {
        method: 'POST',
        type: this.reportType,
        body: JSON.stringify({content: this.reportContent}),
        callback: () => {
          this.$set(this.alerts, 'Successfully created report!', 'success');
          setTimeout(() => this.$delete(this.alerts, 'Successfully created report!'), 3000);
        },
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      try {
        const r = await fetch(`/api/reports/${this.freet._id}/${this.reportType}`, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }
        this.reporting = false;

        options.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
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

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
