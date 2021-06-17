<template>
  <div class="hello">
    <h1>KNG Configurator</h1>
    <b-button :variant="validityButton.variant"
              :disabled="validityButton.disabled"
              @click="validateEngine">{{ validityButton.text }}</b-button>
    <b-alert show variant="danger" v-if="engineErrorMsg" class="col-md-12">
      <icon name="times-circle"></icon>
      {{ engineErrorMsg }}
    </b-alert>

    <div v-if="engineValid" class="engineGeneration container">

      <b-card-group deck class="justify-content-center">

        <b-card>
          <div class="card-text">
            <b-form-group id="fg_forcedOrigin"
                          horizontal
                          :label-cols="3"
                          breakpoint="sm"
                          label="Origin"
                          label-for="fi_forcedOrigin">
              <v-select :options="originsToForce" label="title"
                        id="fi_forcedOrigin"
                        v-model="forcedOrigin">
                <template slot="option" slot-scope="option">
                  {{ option.title }}
                  <span class="originForceWeight" v-if="option.weight">(weight {{ option.weight }})</span>
                </template>
              </v-select>
            </b-form-group>

            <b-form-group id="fg_forcedComposition"
                          horizontal
                          v-if="forcedOrigin.key"
                          :label-cols="3"
                          breakpoint="sm"
                          label="Composition"
                          label-for="fi_forcedComposition">
              <v-select :options="compositionsToForce" label="title"
                        id="fi_forcedComposition"
                        v-model="forcedComposition">
                <template slot="option" slot-scope="option">
                  {{ option.title }}
                  <span class="compositionForceWeight" v-if="option.weight">(weight {{ option.weight }})</span>
                </template>
              </v-select>
            </b-form-group>

            <b-button @click="generate" variant="primary" class="generateButton">Generate detailed name</b-button>
            <b-button @click="generateMultiple" variant="primary" class="generateButton">Generate 10 names</b-button>

            <div v-if="generatedName">
              <h3>{{ generatedName.plain }}</h3>
              <name-detail :generatedName="generatedName"></name-detail>
            </div>
            <div v-if="generatedNameMultiple">
              <div v-for="(generatedName, index) in generatedNameMultiple" :key="index">
                <div class="nameMultiple hvr-underline-from-center" @click="openNameDetail(generatedName)">{{ generatedName.plain }}</div>
              </div>
            </div>
            <b-alert show variant="danger" v-if="generatedError">
              <icon name="times-circle"></icon>
              {{ generatedError }}
            </b-alert>
          </div>
        </b-card>
      </b-card-group>

      <b-button @click="exportEngine" variant="warning" class="exportButton">This configuration is great, I want to keep it!</b-button>
      <sweet-modal ref="modalExportEngine" modal-theme="dark" title="Export editor" id="modalExportEngine">

        <p>
          Below are JSON data used for your configuration. You can copy this text and store it,
          you'll just have to re-import it later to reload your configuration.
        </p>
        <b-button variant="secondary" id="clipboardCopyButton"
                  v-clipboard:copy="getEngineExport"
                  v-clipboard:success="onClipboardSuccess">
          Copy to clipboard
        </b-button>
        <b-form-textarea id="exportEngine" disabled
                         v-model="getEngineExport"
                         :rows="6">
        </b-form-textarea>

      </sweet-modal>

      <sweet-modal ref="modalNameDetail" modal-theme="dark" :title="nameDetailPlain" id="modalNameDetail" v-if="generatedNameMultiple">
        <name-detail :generatedName="nameDetail"></name-detail>
      </sweet-modal>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VSelect from 'vue-select'
import { SweetModal } from 'sweet-modal-vue'
import NameDetail from './NameDetail'

export default {
  name: 'Homepage',
  components: { VSelect, SweetModal, NameDetail },
  data () {
    return {
      generatedName: null,
      generatedNameMultiple: [],
      generatedError: '',
      forcedOrigin: { key: '', weight: 0, title: '[All origins]', compositions: [] },
      forcedComposition: { key: '', weight: 0, title: '[All compositions]' },
      nameDetail: null,
      nameDetailPlain: '',
      copiedClipboard: false
    }
  },
  watch: {
    forcedOrigin () {
      this.forcedComposition = { key: '', weight: 0, title: '[All compositions]' }
    }
  },
  computed: {
    ...mapGetters([
      'engineValid', 'engineErrorMsg', 'hasEngineParts', 'generateNameFromComposition',
      'origins', 'getEngineExport'
    ]),
    validityButton () {
      let buttonData = {
        variant: 'secondary',
        disabled: !this.hasEngineParts,
        text: 'Check configuration'
      }
      if (this.engineValid) {
        buttonData = {
          variant: 'success',
          disabled: true,
          text: 'Your configuration has been validated!'
        }
      }
      return buttonData
    },
    originsToForce () {
      let list = []
      list.push({ key: '', weight: 0, title: '[All origins]', compositions: [] })
      const origins = this.origins
      Object.keys(origins).forEach(function (originKey) {
        list.push({
          key: originKey,
          title: originKey,
          weight: origins[originKey].weight,
          compositions: origins[originKey].compositions
        })
      })
      return list
    },
    compositionsToForce () {
      let list = []
      list.push({ key: '', weight: 0, title: '[All compositions]' })
      const compositions = this.forcedOrigin.compositions
      Object.keys(compositions).forEach(function (compositionKey) {
        list.push({
          key: compositionKey,
          title: compositionKey,
          weight: compositions[compositionKey].weight
        })
      })
      return list
    },
    generatedNameSplitTable () {
      let splitTable = []
      if (!this.generatedName) return splitTable
      const split = this.generatedName.split
      Object.keys(split).forEach(function (compKey) {
        splitTable.push({namePart: compKey, value: split[compKey]})
      })
      return splitTable
    }
  },
  methods: {
    ...mapActions(['validateEngine']),
    generate () {
      this.generatedError = ''
      const originKey = (this.forcedOrigin.key) ? this.forcedOrigin.key : ''
      const compositionKey = (this.forcedComposition.key) ? this.forcedComposition.key : ''
      try {
        this.generatedName = this.generateNameFromComposition(compositionKey, originKey)
        this.$ga.event('generate', 'single', this.generatedName.plain + ' (' + this.generatedName.origin + ')')
      } catch (exception) {
        this.generatedName = ''
        this.generatedError = exception.message
      }
      this.generatedNameMultiple = []
    },
    generateMultiple () {
      this.generatedError = ''
      const originKey = (this.forcedOrigin.key) ? this.forcedOrigin.key : ''
      const compositionKey = (this.forcedComposition.key) ? this.forcedComposition.key : ''
      this.generatedNameMultiple = []
      let errorCount = 0
      for (let i = 0; i < 10; i++) {
        try {
          const generatedName = this.generateNameFromComposition(compositionKey, originKey, false)
          this.generatedNameMultiple.push(generatedName)
        } catch (exception) {
          errorCount++
          this.generatedError = exception.message
        }
      }
      if (errorCount) {
        this.generatedError = errorCount + ' errors. Last one is: ' + this.generatedError
      }
      this.$ga.event('generate', 'multiple', this.generatedNameMultiple.join(';'))
      this.generatedName = ''
    },
    exportEngine () {
      const exportEngine = JSON.parse(this.getEngineExport)
      for (let componentName in exportEngine.components) {
        if (exportEngine.components.hasOwnProperty(componentName)) {
          this.$ga.event('export', 'componentType', exportEngine.components[componentName].type)
        }
      }
      let origins = []
      for (let originName in exportEngine.origins) {
        if (exportEngine.origins.hasOwnProperty(originName)) {
          origins.push(originName)
        }
      }
      this.$ga.event('export', 'valid',
        '[' + origins.join(';') + ']' +
        ' ' + Object.keys(exportEngine.origins).length + ' origins' +
        ' ' + Object.keys(exportEngine.compositions).length + ' compositions' +
        ' ' + Object.keys(exportEngine.components).length + ' components'
      )
      this.$refs.modalExportEngine.open()
    },
    onClipboardSuccess () {
      this.copiedClipboard = true
    },
    openNameDetail (generatedName) {
      this.nameDetail = generatedName
      this.nameDetailPlain = generatedName.plain
      this.$refs.modalNameDetail.open()
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/kngconfig.scss';

  .originForceWeight,.compositionForceWeight {
    font-style: italic;
  }
  .engineGeneration {
    margin-top: 2rem;
    .card {
      background-color: $bg-dark;
      color: $text-light;
      .generateButton {
        margin-bottom: 2rem;
      }
    }
  }

  #clipboardCopyButton {
    margin-bottom: 0.5rem;
  }

  #modalExportEngine .sweet-modal {
    max-height: 90%;
  }

  .exportButton {
    margin-top: 0.5rem;
  }

  .nameMultiple {
    margin: 5px 0;
    cursor: pointer;
    &:before {
      background-color: $main-color;
    }
  }

</style>
