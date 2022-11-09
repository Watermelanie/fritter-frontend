<template>
  <div>
    <section>
      <h3>Show Sensitive Content</h3>
      <label class="switch">
        <input v-if="$store.state.showSensitiveContent" type="checkbox" checked @click="hideSensitiveContent">
        <input v-else type="checkbox" @click="showSensitiveContent">
        <div class="slider round"></div>
      </label>
      <h3>Show Hidden Freet</h3>
      <label class="switch">
        <input v-if="$store.state.showHiddenFreet" type="checkbox" checked @click="hideHiddenFreet">
        <input v-else type="checkbox" @click="showHiddenFreet">
        <div class="slider round"></div>
      </label>
    </section>
  </div>
</template>
<script>
export default {
  name: 'ChangeFreetVisibilityForm',
  methods: {
    async showSensitiveContent() {
      const options = {
        method: 'PATCH', headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch('/api/sensitivitySettings/showSensitiveContent', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        } else {
          this.$store.commit('setSensitiveContentSetting', true);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async hideSensitiveContent() {
      const options = {
        method: 'PATCH', headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch('/api/sensitivitySettings/hideSensitiveContent', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        } else {
          this.$store.commit('setSensitiveContentSetting', false);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async showHiddenFreet() {
      const options = {
        method: 'PATCH', headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch('/api/sensitivitySettings/showHiddenFreet', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        } else {
          this.$store.commit('setHiddenFreetSetting', true);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async hideHiddenFreet() {
      const options = {
        method: 'PATCH', headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch('/api/sensitivitySettings/hideHiddenFreet', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        } else {
          this.$store.commit('setHiddenFreetSetting', false);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: rgb(222, 192, 243);
}

input:focus + .slider {
  box-shadow: 0 0 1px rgb(222, 192, 243);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>