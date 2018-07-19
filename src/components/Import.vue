<template>
  <div class="engineImport container">
    <h1>Import configuration</h1>

    <b-button @click="startNewEngine" variant="danger" class="cleanButton">Start a brand new engine</b-button>

    <b-card-group deck class="justify-content-center">

      <b-card>

        <p>
          Paste below your JSON data to import a new configuration.
          Beware that current configuration will be lost.
        </p>

        <b-button @click="checkImportEngine" variant="warning" class="importButton">Import</b-button>
        <b-alert show :variant="alertImport.variant" v-if="importStatus !== 0">
          <icon :name="alertImport.icon"></icon>
          {{ alertImport.message }}
        </b-alert>

        <b-form-textarea id="importEngine"
                         v-model="engineJson"
                         :rows="6">
        </b-form-textarea>

        <b-button @click="checkImportEngine" variant="warning" class="importButton">Import</b-button>
        <b-alert show :variant="alertImport.variant" v-if="importStatus !== 0">
          <icon :name="alertImport.icon"></icon>
          {{ alertImport.message }}
        </b-alert>

      </b-card>

    </b-card-group>

  </div>
</template>

<script>
import * as storeMut from '@/store/mutation-types'
import { mapActions } from 'vuex'

export default {
  name: 'Import',
  data () {
    return {
      engineJson: '',
      importStatus: 0,
      importMessage: ''
    }
  },
  computed: {
    alertImport () {
      return {
        icon: (this.importStatus < 0) ? 'times-circle' : 'check',
        variant: (this.importStatus < 0) ? 'danger' : 'success',
        message: this.importMessage
      }
    }
  },
  methods: {
    ...mapActions(['importEngine']),
    checkImportEngine () {
      this.importStatus = 0
      try {
        this.importEngine(this.engineJson)
        this.importStatus = 1
        this.importMessage = 'Configuration loaded and validated!'
      } catch (exception) {
        this.importStatus = -1
        this.importMessage = exception.message
      }
    },
    startNewEngine () {
      this.$store.commit(storeMut.RESET_ENGINE)
      this.$router.push({name: 'ComponentList'})
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/kngconfig.scss';

  .engineImport {
    .card {
      background-color: $bg-dark;
      color: $text-light;
    }
  }

  #importEngine {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .cleanButton {
    margin-bottom: 1rem;
  }

</style>
