<template>
  <div>
    <b-form-group id="fg_processType"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label="Process type"
                  label-for="fi_processType">
      <b-form-select id="fi_processType" v-model="item.type" :options="selectTypeOptions" class="mb-3" />
    </b-form-group>

    <b-form-group v-for="rParam in requiredParameters" :key="rParam.name"
                  :id="'fg_processRParam_' + rParam.name"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  :label="rParam.label"
                  :label-for="'fi_processRParam' + rParam.name">
      <b-form-input v-model="item.parameters[rParam.name]"
                    :id="'fi_processRParam' + rParam.name"
                    :placeholder="rParam.placeholder"
                    v-if="rParam.type === 'text'"
                    type="text"></b-form-input>
      <b-form-input v-model="item.parameters[rParam.name]"
                    :id="'fi_processRParam' + rParam.name"
                    v-if="rParam.type === 'number'"
                    type="number"></b-form-input>
    </b-form-group>

    <div v-for="(dictionaryWarning, index) in dictionaryWarnings" :key="index">
      <b-alert show dismissible variant="warning" class="col-md-9 offset-md-3">
        <icon name="exclamation-triangle"></icon>
        {{ dictionaryWarning }}
      </b-alert>
    </div>

    <b-form-group id="fg_processDictionary"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label-for="fi_processDictionary">
      <span slot="label">Dictionary <b-badge pill variant="dark">{{ dictionarySize }}</b-badge></span>
      <b-form-textarea id="fi_processDictionary"
                       v-model="dictionaryText"
                       placeholder="List names, one on each line"
                       :rows="6">
      </b-form-textarea>

    </b-form-group>

    <div class="row">
      <label class="col-md-3">Format parameters</label>
      <div class="col-md-9 row">
        <div class="col">
          <enhanced-check v-model="item.parameters.uppercaseFirst" label="Uppercase first" :animate="true" subClass="kng" />
        </div>
        <div class="col">
          <enhanced-check v-model="item.parameters.capitalize" label="Capitalize" :animate="true" subClass="kng" />
        </div>
        <div class="col">
          <enhanced-check v-model="item.parameters.minimize" label="Minimize" :animate="true" subClass="kng" />
        </div>
      </div>
    </div>

    <b-form-group v-for="sParam in specificParameters" :key="sParam.name"
                  :id="'fg_processSParam_' + sParam.name"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  :label="sParam.label"
                  :label-for="'fi_processSParam' + sParam.name">
      <b-form-input v-model="item.parameters[sParam.name]"
                    :id="'fi_processSParam' + sParam.name"
                    v-if="sParam.type === 'number'"
                    type="number"></b-form-input>
      <enhanced-toggle styleOn="success" styleOff="danger"
                       v-model="item.parameters[sParam.name]"
                       v-if="sParam.type === 'toggle'"
                       :id="'fi_processSParam' + sParam.name"></enhanced-toggle>
    </b-form-group>

    <div class="row processTest">
      <b-button variant="outline-primary" class="col-sm-3"
                @click="testProcess()">Test process</b-button>
      <div class="col-sm-9">
        <b-alert show variant="danger" v-if="processGeneratedNameError">
          <icon name="times-circle"></icon>
          {{ processGeneratedNameError }}
        </b-alert>
        <span v-else>{{ processGeneratedName }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EnhancedCheck, EnhancedToggle } from 'vue-enhanced-check'

export default {
  name: 'ProcessEditor',
  components: { EnhancedCheck, EnhancedToggle },
  model: {
    prop: 'item'
  },
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      dictionaryText: '',
      processGeneratedName: '',
      processGeneratedNameError: ''
    }
  },
  watch: {
    item () {
      this.reloadItem()
    },
    dictionaryText () {
      this.dictionaryTextToArray()
    }
  },
  computed: {
    ...mapGetters(['processes', 'processTypes', 'validity', 'getKngProcess']),
    selectTypeOptions () {
      let options = []
      this.processTypes.forEach(function (type) {
        options.push({ value: type.key, text: type.name })
      })
      return options
    },
    requiredParameters () {
      switch (this.item.type) {
        case 'CharGroup':
          return [
            { name: 'pattern', label: 'Pattern', type: 'text', placeholder: 'If using multiple pattern, use \';\' as separator' }
          ]
        case 'Markov':
          return [
            { name: 'order', label: 'Order', type: 'number' }
          ]
      }
      return []
    },
    dictionaryWarnings () {
      switch (this.item.type) {
        case 'WeightedList':
          return [
            'Each entry should be defined with an associated weight. Add \':\' after your entry to enter your weight (\'name:3\' for example)'
          ]
        case 'CharGroup':
          return [
            'Each entry must be defined with an associated key. Add \':\' after your entry to enter your weight (\'a:a\' for example)'
          ]
      }
      return []
    },
    specificParameters () {
      switch (this.item.type) {
        case 'WeightedList':
          return [
            { name: 'defaultWeight', label: 'Default weight', type: 'number' }
          ]
        case 'Markov':
          return [
            { name: 'minLength', label: 'Minimum length', type: 'number' },
            { name: 'maxLength', label: 'Maximum length', type: 'number' },
            { name: 'maxAttempts', label: 'Maximum attempts', type: 'number' },
            { name: 'allowDuplicates', label: 'Allow duplicates', type: 'toggle' },
            { name: 'allowSubDuplicates', label: 'Allow sub-duplicates', type: 'toggle' }
          ]
      }
      return []
    },
    dictionarySize () {
      return this.item.dictionary.length
    }
  },
  mounted () {
    this.reloadItem()
  },
  methods: {
    reloadItem () {
      this.processGeneratedName = ''
      this.processGeneratedNameError = ''
      // reloading attribute is used for watchers to ignore this modification
      this.item._reloading = true
      this.dictionaryArrayToText()
      this.$nextTick(() => { this.item._reloading = false })
    },
    dictionaryArrayToText () {
      if (this.dictionarySize === 0) {
        this.dictionaryText = ''
      } else {
        let textBuild = ''
        const processType = this.item.type
        let cumulWeight = 0
        this.item.dictionary.forEach(function (toString) {
          if (typeof toString !== 'string') {
            switch (processType) {
              case 'WeightedList':
                cumulWeight += Number(toString[1])
                break
            }
            toString = toString.join(':')
          }
          textBuild += toString + '\n'
        })
        this.dictionaryText = textBuild
        this.weightedListCumul = cumulWeight
      }
    },
    dictionaryTextToArray () {
      let dictionaryCheck = []
      const processType = this.item.type
      this.dictionaryText.split('\n').forEach(function (toCheck) {
        let entryToCheck = toCheck.trim()
        let entryParam = ''
        if (entryToCheck.includes(':')) {
          [entryToCheck, entryParam] = entryToCheck.split(':', 2)
          switch (processType) {
            case 'WeightedList':
              if (isNaN(entryParam) || entryParam < 1) entryParam = this.item.parameters.defaultWeight
              entryToCheck = [entryToCheck, Number(entryParam)]
              break
            case 'CharGroup':
              entryToCheck = [entryToCheck, entryParam]
              break
          }
        }
        if (entryToCheck.length > 0) dictionaryCheck.push(entryToCheck)
      })
      this.item.dictionary = dictionaryCheck
    },
    testProcess () {
      this.processGeneratedNameError = ''
      try {
        const kngProcess = this.getKngProcess(this.item._key)
        this.processGeneratedName = kngProcess.generate()
      } catch (exception) {
        this.processGeneratedNameError = exception.message
      }
    }
  }
}
</script>

<style lang="scss">
  .processTest {
    margin-top: 1rem;
    .alert {
      margin-bottom: 0;
    }
  }
</style>
