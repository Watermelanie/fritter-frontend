<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      url: '/api/freets/warning',
      method: 'POST',
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
    async createFreet() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: this.$store.state.freetContent
      };

      try {
        const r = await fetch(this.url, options);
        this.$store.commit('setFreetContent', null)
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
        const text = await r.text();
        const res = text ? JSON.parse(text) : {user: null};
        this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshFreets) {
        this.$store.commit('refreshFreets');
        }

        if (this.callback) {
        this.callback();
        }
        this.turnOffWarning();
                
      } catch (e) {
        this.turnOffWarning();
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    turnOffWarning() {
      this.$store.commit('showWarning', false);
    }
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <!-- <div class="modal-header">
            <slot name="header">Freet </slot>
          </div> -->

          <div class="modal-body">
            <slot name="body">{{$store.state.filteredContent}}</slot>
            words that may have triggered warning: 
            <span v-for="word in $store.state.filteredContent">
                {{word}}
            </span>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button
                class="modal-default-button"
                @click="turnOffWarning"
              >No</button>
              <button
                class="modal-default-button"
                @click="createFreet"
              >Yes, continue</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>