
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
      processes: {},
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
    defaultProcess: {
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
    defaultComponent: {
      process: '',
      _overProcess: ''
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
    processes: state => state.engine.processes,
    components: state => state.engine.components,
    compositions: state => state.engine.compositions,
    origins: state => state.engine.origins,
    defaultProcess: state => state.defaultProcess,
    defaultComponent: state => state.defaultComponent,
    defaultComposition: state => state.defaultComposition,
    defaultOrigin: state => state.defaultOrigin,
    process: state => (key) => {
      if (typeof state.engine.processes[key] === 'undefined') return {}
      return state.engine.processes[key]
    },
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
    processesCount: (state, getters) => {
      return Object.keys(getters.processes).length
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
    hasProcess: (state, getters) => {
      return getters.processesCount > 0
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
      return getters.hasProcess && getters.hasComponent && getters.hasComposition && getters.hasOrigin
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
        processes: getters.getBuildStatus(getters.processes),
        components: getters.getBuildStatus(getters.components),
        compositions: getters.getBuildStatus(getters.compositions),
        origins: getters.getBuildStatus(getters.origins)
      }
    },
    getKngProcess: (state, getters) => (key) => {
      if (typeof state.engine.processes[key] === 'undefined') throw new Error('Process ' + key + ' not defined')
      return KngSerializer.parseProcess(state.engine.processes[key], key)
    },
    getKngComponent: (state, getters) => (key) => {
      if (typeof state.engine.components[key] === 'undefined') throw new Error('Component ' + key + ' not defined')
      const component = state.engine.components[key]
      let kngProcesses = {}
      kngProcesses[component.process] = getters.getKngProcess(component.process)
      return KngSerializer.parseComponent(state.engine.components[key], key, kngProcesses)
    },
    getKngComposition: (state, getters) => (key) => {
      if (typeof state.engine.compositions[key] === 'undefined') throw new Error('Composition ' + key + ' not defined')
      const composition = state.engine.compositions[key]
      let kngComponents = {}
      Object.keys(composition.components).forEach(function (partKey) {
        let componentKey = composition.components[partKey]
        kngComponents[componentKey] = getters.getKngComponent(componentKey)
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
      // and throw error for cicular reference
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
    }
  },
  actions: {
    switchWildMode ({commit}) {
      commit(types.ADD_PROCESS)
    },
    win ({dispatch}) {
      dispatch('storeGame', true)
    },
    validateProcess ({state, getters, commit}, key) {
      let validPayload = getters.getValidatedPayload(key)
      try {
        let kngProcess = getters.getKngProcess(key)
        kngProcess.checkReadyForGeneration()
        commit(types.VALID_PROCESS, validPayload)
      } catch (exception) {
        validPayload.validity = state.VALIDITY.ERROR
        validPayload.error = exception.message
        commit(types.VALID_PROCESS, validPayload)
      }
    },
    validateComponent ({state, getters, dispatch, commit}, key) {
      let validPayload = getters.getValidatedPayload(key)
      let subProcesses = []
      subProcesses.push(getters.component(key).process)
      subProcesses.forEach(function (processKey) {
        dispatch('validateProcess', processKey)
      })
      try {
        let kngComponent = getters.getKngComponent(key)
        kngComponent.isValid()
      } catch (exception) {
        validPayload.validity = state.VALIDITY.ERROR
        validPayload.error = exception.message
        commit(types.VALID_COMPONENT, validPayload)
        return
      }
      commit(types.VALID_COMPONENT, validPayload)
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
    resetState () {
      // call this.$store.dispatch('resetState') from a component action
      localStorage.removeItem(persistOptions.key)
      location.reload()
    }
  },
  mutations: {
    [types.ADD_PROCESS] (state, process) {
      if (typeof process._key === 'undefined') process._key = ''
      process._validity = state.VALIDITY.UNKNOWN
      process._validityError = ''
      const processCreation = JSON.parse(JSON.stringify(process))
      Vue.set(state.engine.processes, processCreation._key, processCreation)
      state.engineValid = false
      state.engineErrorMsg = ''
    },
    [types.ADD_COMPONENT] (state, component) {
      if (typeof component._key === 'undefined') component._key = ''
      component._validity = state.VALIDITY.UNKNOWN
      component._validityError = ''
      const componentCreation = JSON.parse(JSON.stringify(component))
      Vue.set(state.engine.components, componentCreation._key, componentCreation)
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
    [types.REMOVE_PROCESS] (state, key) {
      Vue.delete(state.engine.processes, key)
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
    [types.VALID_PROCESS] (state, payload) {
      if (typeof state.engine.processes[payload.key] === 'undefined') return
      state.engine.processes[payload.key]._validity = payload.validity
      state.engine.processes[payload.key]._validityError = payload.error
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
    }
  },
  strict: debug,
  plugins: debug ? [createLogger(), persistedState(persistOptions)] : [persistedState(persistOptions)]
})
