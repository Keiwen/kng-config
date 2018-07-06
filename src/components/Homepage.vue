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

            <b-button @click="generate" variant="primary" class="generateButton">Generate detailed name</b-button>
            <b-button @click="generateMultiple" variant="primary" class="generateButton">Generate 10 names</b-button>

            <div v-if="generatedName">
              <h3>{{ generatedName.plain }}</h3>
              <strong>Origin:</strong> {{ generatedName.origin }}
              <br/>
              <strong>Composition:</strong> {{ generatedName.composition }}
              <b-table bordered small responsive hover :items="generatedNameSplitTable"></b-table>
            </div>
            <div v-if="generatedNameMultiple">
              <div v-for="(plainName, index) in generatedNameMultiple" :key="index">
                {{ plainName }}<br/>
              </div>
            </div>
            <b-alert show variant="danger" v-if="generatedError">
              <icon name="times-circle"></icon>
              {{ generatedError }}
            </b-alert>
          </div>
        </b-card>
      </b-card-group>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VSelect from 'vue-select'

export default {
  name: 'Homepage',
  components: { VSelect },
  data () {
    return {
      generatedName: null,
      generatedNameMultiple: [],
      generatedError: '',
      forcedOrigin: null
    }
  },
  mounted () {
    this.forcedOrigin = this.originsToForce[0]
  },
  computed: {
    ...mapGetters(['engineValid', 'engineErrorMsg', 'hasEngineParts', 'generateNameFromOrigin', 'origins']),
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
      list.push({ key: '', weight: 0, title: '[All origins]' })
      const origins = this.origins
      Object.keys(origins).forEach(function (originKey) {
        list.push({
          key: originKey,
          title: originKey,
          weight: origins[originKey].weight
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
      try {
        this.generatedName = this.generateNameFromOrigin(originKey)
      } catch (exception) {
        this.generatedName = ''
        this.generatedError = exception.message
      }
      this.generatedNameMultiple = []
    },
    generateMultiple () {
      this.generatedError = ''
      const originKey = (this.forcedOrigin.key) ? this.forcedOrigin.key : ''
      this.generatedNameMultiple = []
      let errorCount = 0
      for (let i = 0; i < 10; i++) {
        try {
          const plainName = this.generateNameFromOrigin(originKey, true)
          this.generatedNameMultiple.push(plainName)
        } catch (exception) {
          errorCount++
          this.generatedError = exception.message
        }
      }
      if (errorCount) {
        this.generatedError = errorCount + ' errors. Last one is: ' + this.generatedError
      }
      this.generatedName = ''
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/kngconfig.scss';

  .originForceWeight {
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
</style>
