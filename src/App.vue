<template>
  <div id="app">
    <kng-config-menu></kng-config-menu>
    <div class="row buildProgress" v-if="showBuildProgress">
      <div class="col-sm-4 buildProgressPart" @click="clickComponent">
        <build-status :buildStatus="getBuildStatuses.components"></build-status>
      </div>
      <div class="col-sm-4 buildProgressPart" @click="clickComposition">
        <build-status :buildStatus="getBuildStatuses.compositions"></build-status>
      </div>
      <div class="col-sm-4 buildProgressPart" @click="clickOrigin">
        <build-status :buildStatus="getBuildStatuses.origins"></build-status>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import KngConfigMenu from '@/components/Menu'
import BuildStatus from '@/components/BuildStatus'
import { RawListKngProcess, KngNameComposition, KngOrigin, KngEngine, KngSerializer } from 'kng-engine'

export default {
  name: 'App',
  components: { KngConfigMenu, BuildStatus },
  computed: {
    ...mapGetters(['getBuildStatuses']),
    showBuildProgress () {
      return (this.$route.meta && this.$route.meta.buildRoute)
    },
    generatedName () {
      let fnfComponent = new RawListKngProcess('fnf')
      fnfComponent.addListToDictionary(['Pierre', 'Nicolas', 'Jean'])
      let lnfComponent = new RawListKngProcess('lnf')
      lnfComponent.addListToDictionary(['Duchemin', 'Delacour', 'Desjardins'])
      let fneComponent = new RawListKngProcess('fne')
      fneComponent.addListToDictionary(['Michael', 'Andrew', 'Ryan'])
      let lneComponent = new RawListKngProcess('lne')
      lneComponent.addListToDictionary(['Smith', 'Jones', 'Williams'])
      let frfrComposition = new KngNameComposition('frfr', ['first', 'last'])
      frfrComposition.addNameComponent(fnfComponent, 'first')
      frfrComposition.addNameComponent(lnfComponent, 'last')
      let frenComposition = new KngNameComposition('fren', ['first', 'last'])
      frenComposition.addNameComponent(fneComponent, 'first')
      frenComposition.addNameComponent(lnfComponent, 'last')
      let enenComposition = new KngNameComposition('enen', ['first', 'last'])
      enenComposition.addNameComponent(fneComponent, 'first')
      enenComposition.addNameComponent(lneComponent, 'last')
      let enfrComposition = new KngNameComposition('enfr', ['first', 'last'])
      enfrComposition.addNameComponent(fnfComponent, 'first')
      enfrComposition.addNameComponent(lneComponent, 'last')
      let frOrigin = new KngOrigin('fr')
      frOrigin.addNameComposition(frfrComposition, 'fr', 9)
      frOrigin.addNameComposition(frenComposition, 'en', 1)
      let enOrigin = new KngOrigin('usa')
      enOrigin.addNameComposition(enenComposition, 'en', 9)
      enOrigin.addNameComposition(enfrComposition, 'fr', 1)
      let engine = new KngEngine()
      engine.addOrigin(frOrigin, 2)
      engine.addOrigin(enOrigin, 1)
      // console.log('engine', engine)
      // console.log('serialProcess', KngSerializer.jsonEncode(KngSerializer.serializeProcess(fnfProcess)))
      // console.log('serialComponent', KngSerializer.jsonEncode(KngSerializer.serializeComponent(fnfComponent)))
      // console.log('serialComposition', KngSerializer.jsonEncode(KngSerializer.serializeComposition(frfrComposition)))
      // console.log('serialOrigin', KngSerializer.jsonEncode(KngSerializer.serializeOrigin(frOrigin)))
      // console.log('serialEngine', KngSerializer.jsonEncode(KngSerializer.serializeEngine(engine)))
      let importEngine = KngSerializer.parseEngine(KngSerializer.jsonDecode('{"processes":{"fnf":{"type":"RawList","parameters":{},"dictionary":["Pierre","Nicolas","Jean"]},"lnf":{"type":"RawList","parameters":{},"dictionary":["Duchemin","Delacour","Desjardins"]},"fne":{"type":"RawList","parameters":{},"dictionary":["Michael","Andrew","Ryan"]},"lne":{"type":"RawList","parameters":{},"dictionary":["Smith","Jones","Williams"]}},"compositions":{"frfr":{"pattern":["first","last"],"components":{"first":"fnf","last":"lnf"}},"fren":{"pattern":["first","last"],"components":{"first":"fne","last":"lnf"}},"enen":{"pattern":["first","last"],"components":{"first":"fne","last":"lne"}},"enfr":{"pattern":["first","last"],"components":{"first":"fnf","last":"lne"}}},"origins":{"fr":{"weight":2,"compositions":{"fr":{"composition":"frfr","weight":9},"en":{"composition":"fren","weight":1}}},"usa":{"weight":1,"compositions":{"en":{"composition":"enen","weight":9},"fr":{"composition":"enfr","weight":1}}}}}'))
      // console.log('parseEngine', importEngine)
      // console.log('serialEngine rebuilt', KngSerializer.jsonEncode(KngSerializer.serializeEngine(importEngine)))
      return importEngine.generateName()
    }
  },
  methods: {
    clickComponent() {
      this.$router.push({name: 'ComponentList'})
    },
    clickComposition () {
      this.$router.push({name: 'CompositionList'})
    },
    clickOrigin () {
      this.$router.push({name: 'OriginList'})
    }
  }
}
</script>

<style lang="scss">
  @import './assets/kngconfig.scss';

  #app {
    margin-top: 50px;
  }

  .buildProgressPart {
    cursor: pointer;
  }

  .v-select {
    text-align: justify;
    background-color: white;
    padding: 0;
    &.single.searchable input {
      // html element created with style attribute with witdh auto
      // issue with span containing selected value and following input to select
      // a new one, as this overflow on a second line
      width: 0 !important;
    }
  }

</style>
