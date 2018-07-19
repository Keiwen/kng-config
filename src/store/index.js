
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from '../../node_modules/vuex/dist/logger'
import * as types from './mutation-types'
import persistedState from 'vuex-persistedstate'
import { KngSerializer } from 'kng-engine'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const persistOptions = {
  key: 'kngconfig'
}

export default new Vuex.Store({
  state: {
    VALIDITY: {
      ERROR: -1,
      UNKNOWN: 0,
      OK: 1
    },
    engine: {
      components: {},
      compositions: {},
      origins: {}
    },
    processTypes: [
      {
        key: 'RawList',
        name: 'Raw list'
      },
      {
        key: 'WeightedList',
        name: 'Weighted list'
      },
      {
        key: 'Sequence',
        name: 'Sequence'
      },
      {
        key: 'CharGroup',
        name: 'Char group pattern'
      },
      {
        key: 'Markov',
        name: 'Markov'
      }
    ],
    defaultComponent: {
      type: 'RawList',
      parameters: {
        defaultWeight: 1,
        order: 1,
        minLength: 1,
        maxLength: -1,
        maxAttempts: 25,
        allowDuplicates: true,
        allowSubDuplicates: true
      },
      dictionary: []
    },
    defaultComposition: {
      components: {},
      pattern: []
    },
    defaultOrigin: {
      weight: 1,
      compositions: {}
    },
    engineErrorMsg: '',
    engineValid: false
  },
  getters: {
    engineValid: state => state.engineValid,
    engineErrorMsg: state => state.engineErrorMsg,
    processTypes: state => state.processTypes,
    validity: state => state.VALIDITY,
    engine: state => state.engine,
    components: state => state.engine.components,
    compositions: state => state.engine.compositions,
    origins: state => state.engine.origins,
    defaultComponent: state => state.defaultComponent,
    defaultComposition: state => state.defaultComposition,
    defaultOrigin: state => state.defaultOrigin,
    component: state => (key) => {
      if (typeof state.engine.components[key] === 'undefined') return {}
      return state.engine.components[key]
    },
    composition: state => (key) => {
      if (typeof state.engine.compositions[key] === 'undefined') return {}
      return state.engine.compositions[key]
    },
    origin: state => (key) => {
      if (typeof state.engine.origins[key] === 'undefined') return {}
      return state.engine.origins[key]
    },
    componentsCount: (state, getters) => {
      return Object.keys(getters.components).length
    },
    compositionsCount: (state, getters) => {
      return Object.keys(getters.compositions).length
    },
    originsCount: (state, getters) => {
      return Object.keys(getters.origins).length
    },
    hasComponent: (state, getters) => {
      return getters.componentsCount > 0
    },
    hasComposition: (state, getters) => {
      return getters.compositionsCount > 0
    },
    hasOrigin: (state, getters) => {
      return getters.originsCount > 0
    },
    hasEngineParts: (state, getters) => {
      return getters.hasComponent && getters.hasComposition && getters.hasOrigin
    },
    getBuildStatus: (state) => (items) => {
      let status = { ok: 0, unknown: 0, error: 0, total: 0 }
      Object.keys(items).forEach(function (key) {
        status.total++
        switch (items[key]._validity) {
          case state.VALIDITY.ERROR:
            status.error++
            break
          case state.VALIDITY.OK:
            status.ok++
            break
          default:
            status.unknown++
            break
        }
      })
      return status
    },
    getBuildStatuses: (state, getters) => {
      return {
        components: getters.getBuildStatus(getters.components),
        compositions: getters.getBuildStatus(getters.compositions),
        origins: getters.getBuildStatus(getters.origins)
      }
    },
    getKngProcess: (state, getters) => (key) => {
      if (typeof state.engine.components[key] === 'undefined') throw new Error('Component ' + key + ' not defined')
      return KngSerializer.parseProcess(state.engine.components[key], key)
    },
    getKngComposition: (state, getters) => (key) => {
      if (typeof state.engine.compositions[key] === 'undefined') throw new Error('Composition ' + key + ' not defined')
      const composition = state.engine.compositions[key]
      let kngComponents = {}
      Object.keys(composition.components).forEach(function (partKey) {
        let componentKey = composition.components[partKey]
        kngComponents[componentKey] = getters.getKngProcess(componentKey)
      })
      return KngSerializer.parseComposition(state.engine.compositions[key], key, kngComponents)
    },
    getKngOrigin: (state, getters) => (key) => {
      if (typeof state.engine.origins[key] === 'undefined') throw new Error('Origin ' + key + ' not defined')
      const origin = state.engine.origins[key]
      let kngCompositions = {}
      Object.keys(origin.compositions).forEach(function (partKey) {
        let compositionKey = origin.compositions[partKey].composition
        kngCompositions[compositionKey] = getters.getKngComposition(compositionKey)
      })
      return KngSerializer.parseOrigin(state.engine.origins[key], key, kngCompositions)
    },
    getKngEngine: (state) => {
      // cannot keep kngEngine object directly in store. After mutation,
      // store go through JSON.Stringify (cause by persistance?)
      // and throw error for circular reference
      // This is due to markov process as neighbors contains same objects
      return KngSerializer.parseEngine(state.engine)
    },
    getValidatedPayload: (state) => (key) => {
      return { key: key, error: '', validity: state.VALIDITY.OK }
    },
    generateName: (state, getters) => (plain) => {
      return getters.getKngEngine.generateName(plain)
    },
    generateNameFromOrigin: (state, getters) => (originKey, plain) => {
      return getters.getKngEngine.generateNameFromOrigin(originKey, plain)
    },
    getEngineExport: (state, getters) => {
      return JSON.stringify(KngSerializer.serializeEngine(getters.getKngEngine), null, 4)
    },
    checkItemsToImport: (state) => (itemList, category, partItems) => {
      if (typeof itemList !== 'object') throw new Error(category + ' not found')
      let kngItems = {}
      Object.keys(itemList).forEach(function (itemKey) {
        let item = itemList[itemKey]
        item._key = itemKey
        let defaultItem = null
        switch (category) {
          case 'components': defaultItem = state.defaultComponent; break
          case 'compositions': defaultItem = state.defaultComposition; break
          case 'origins': defaultItem = state.defaultOrigin; break
          default: throw new Error('undefined category ' + category)
        }
        defaultItem = JSON.parse(JSON.stringify(defaultItem))
        // attribute in default that are undefined in import will be added in import
        if (category === 'components') item.parameters = Object.assign(defaultItem.parameters, item.parameters)
        item = Object.assign(defaultItem, item)
        try {
          switch (category) {
            case 'components': kngItems[itemKey] = KngSerializer.parseProcess(item, itemKey); break
            case 'compositions': kngItems[itemKey] = KngSerializer.parseComposition(item, itemKey, partItems); break
            case 'origins': kngItems[itemKey] = KngSerializer.parseOrigin(item, itemKey, partItems); break
          }
        } catch (exception) {
          throw new Error('Error in ' + category + ', key ' + itemKey + ': ' + exception.message)
        }
        itemList[itemKey] = item
      })
      return kngItems
    }
  },
  actions: {
    validateComponent ({state, getters, commit}, key) {
      let validPayload = getters.getValidatedPayload(key)
      try {
        let kngProcess = getters.getKngProcess(key)
        kngProcess.checkReadyForGeneration()
        commit(types.VALID_COMPONENT, validPayload)
      } catch (exception) {
        validPayload.validity = state.VALIDITY.ERROR
        validPayload.error = exception.message
        commit(types.VALID_COMPONENT, validPayload)
      }
    },
    validateComposition ({state, getters, dispatch, commit}, key) {
      let validPayload = getters.getValidatedPayload(key)
      let subComponents = getters.composition(key).components
      Object.keys(subComponents).forEach(function (partKey) {
        dispatch('validateComponent', subComponents[partKey])
      })
      try {
        let kngComposition = getters.getKngComposition(key)
        kngComposition.isValid()
      } catch (exception) {
        validPayload.validity = state.VALIDITY.ERROR
        validPayload.error = exception.message
        commit(types.VALID_COMPOSITION, validPayload)
        return
      }
      commit(types.VALID_COMPOSITION, validPayload)
    },
    validateOrigin ({state, getters, dispatch, commit}, key) {
      let validPayload = getters.getValidatedPayload(key)
      let subCompositions = getters.origin(key).compositions
      Object.keys(subCompositions).forEach(function (partKey) {
        dispatch('validateComposition', subCompositions[partKey].composition)
      })
      try {
        let kngOrigin = getters.getKngOrigin(key)
        kngOrigin.isValid()
      } catch (exception) {
        validPayload.validity = state.VALIDITY.ERROR
        validPayload.error = exception.message
        commit(types.VALID_ORIGIN, validPayload)
        return
      }
      commit(types.VALID_ORIGIN, validPayload)
    },
    validateEngine ({state, getters, dispatch, commit}) {
      Object.keys(getters.origins).forEach(function (originKey) {
        dispatch('validateOrigin', originKey)
      })
      let kngEngine = null
      try {
        kngEngine = getters.getKngEngine
        kngEngine.isValid()
      } catch (exception) {
        commit(types.SET_ERROR_ENGINE, exception.message)
        return
      }
      commit(types.VALID_ENGINE)
    },
    importEngine ({state, getters, dispatch, commit}, jsonEngine) {
      commit(types.RESET_ENGINE)

      if (typeof jsonEngine !== 'string') throw new Error('Engine to import must be a string')
      let engineToImport = null
      try {
        engineToImport = JSON.parse(jsonEngine)
      } catch (exception) {
        throw new Error('Engine to import is not a valid JSON string')
      }
      let kngProcesses = getters.checkItemsToImport(engineToImport.components, 'components')
      Object.keys(engineToImport.components).forEach(function (processKey) {
        commit(types.ADD_COMPONENT, engineToImport.components[processKey])
      })
      let kngCompositions = getters.checkItemsToImport(engineToImport.compositions, 'compositions', kngProcesses)
      Object.keys(engineToImport.compositions).forEach(function (compositionKey) {
        commit(types.ADD_COMPOSITION, engineToImport.compositions[compositionKey])
      })
      getters.checkItemsToImport(engineToImport.origins, 'origins', kngCompositions)
      Object.keys(engineToImport.origins).forEach(function (originKey) {
        commit(types.ADD_ORIGIN, engineToImport.origins[originKey])
      })
      dispatch('validateEngine')
    },
    loadPresetConfig ({state, getters, dispatch, commit}, filename) {
      console.log('Loading preset configuration: ' + filename)
      let jsonEngine = ''
      try {
        jsonEngine = require('../../static/config/' + filename + '.json')
        jsonEngine = JSON.stringify(jsonEngine)
      } catch (exception) {
        throw new Error('Configuration not found')
      }
      dispatch('importEngine', jsonEngine)
    }
  },
  mutations: {
    [types.ADD_COMPONENT] (state, process) {
      if (typeof process._key === 'undefined') process._key = ''
      process._validity = state.VALIDITY.UNKNOWN
      process._validityError = ''
      const processCreation = JSON.parse(JSON.stringify(process))
      Vue.set(state.engine.components, processCreation._key, processCreation)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.ADD_COMPOSITION] (state, composition) {
      if (typeof composition._key === 'undefined') composition._key = ''
      composition._validity = state.VALIDITY.UNKNOWN
      composition._validityError = ''
      const compositionCreation = JSON.parse(JSON.stringify(composition))
      Vue.set(state.engine.compositions, compositionCreation._key, compositionCreation)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.ADD_ORIGIN] (state, origin) {
      if (typeof origin._key === 'undefined') origin._key = ''
      origin._validity = state.VALIDITY.UNKNOWN
      origin._validityError = ''
      const originCreation = JSON.parse(JSON.stringify(origin))
      Vue.set(state.engine.origins, originCreation._key, originCreation)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.REMOVE_COMPONENT] (state, key) {
      Vue.delete(state.engine.components, key)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.REMOVE_COMPOSITION] (state, key) {
      Vue.delete(state.engine.compositions, key)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.REMOVE_ORIGIN] (state, key) {
      Vue.delete(state.engine.origins, key)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.VALID_COMPONENT] (state, payload) {
      if (typeof state.engine.components[payload.key] === 'undefined') return
      state.engine.components[payload.key]._validity = payload.validity
      state.engine.components[payload.key]._validityError = payload.error
    },
    [types.VALID_COMPOSITION] (state, payload) {
      if (typeof state.engine.compositions[payload.key] === 'undefined') return
      state.engine.compositions[payload.key]._validity = payload.validity
      state.engine.compositions[payload.key]._validityError = payload.error
    },
    [types.VALID_ORIGIN] (state, payload) {
      if (typeof state.engine.origins[payload.key] === 'undefined') return
      state.engine.origins[payload.key]._validity = payload.validity
      state.engine.origins[payload.key]._validityError = payload.error
    },
    [types.VALID_ENGINE] (state) {
      state.engineValid = true
      state.engineErrorMsg = ''
    },
    [types.SET_ERROR_ENGINE] (state, msg) {
      state.engineErrorMsg = msg
    },
    [types.IMPORT_ENGINE] (state, importEngine) {
      state.engine = importEngine
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.RESET_ENGINE] (state) {
      state.engineValid = false
      state.engineErrorMsg = ''
      state.engine = {
        components: {},
        compositions: {},
        origins: {}
      }
    }
  },
  strict: debug,
  plugins: debug ? [createLogger(), persistedState(persistOptions)] : [persistedState(persistOptions)]
})
