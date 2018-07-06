<template>
  <div>
    <b-form-group id="fg_weight"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label="Weight"
                  label-for="fi_weight">
      <div class="row">
        <b-form-input v-model="item.weight" class="col-md-12"
                      id="fi_weight" type="number"></b-form-input>
      </div>
    </b-form-group>

    <b-form-group id="fg_compositions"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label-for="fi_compositions">
      <span slot="label">Compositions to use <b-badge pill variant="dark">{{ compositionCount }}</b-badge></span>
      <div class="row compositionBuildRow" v-for="(compositionBuild, index) in compositionsBuild" :key="index">
        <b-form-input v-model="compositionBuild.key" type="text"
                      class="col-sm-3 col-md-4" :state="compositionBuild.key.length > 0"
                      placeholder="Origin part key"></b-form-input>
        <v-select :options="Object.keys(compositions)"
                  v-model="compositionBuild.composition"
                  class="col-sm-7 col-md-5"></v-select>
        <b-form-input v-model="compositionBuild.weight" class="col-md-2 col-sm-1"
                      type="number" placeholder="weight"></b-form-input>
        <b-button variant="outline-secondary"
                  @click="removeBuild(index)"
                  class="col-sm-1"><icon name="trash"></icon></b-button>
      </div>
      <b-button variant="outline-primary" id="addCompositionBuild"
                @click="addBuild()"><icon name="plus-circle"></icon> Add composition</b-button>
    </b-form-group>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VSelect from 'vue-select'

export default {
  name: 'OriginEditor',
  components: { VSelect },
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
      compositionsBuild: [{ key: '', composition: '', weight: '' }]
    }
  },
  watch: {
    item () {
      this.reloadItem()
    },
    compositionsBuild: {
      handler () {
        this.buildToComposition()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['origins', 'compositions']),
    compositionCount () {
      return Object.keys(this.item.compositions).length
    }
  },
  mounted () {
    this.reloadItem()
  },
  methods: {
    reloadItem () {
      // reloading attribute is used for watchers to ignore this modification
      this.item._reloading = true
      this.compositionToBuild()
      this.$nextTick(() => { this.item._reloading = false })
    },
    addBuild () {
      this.compositionsBuild.push({ key: '', composition: '', weight: '' })
    },
    removeBuild (index) {
      this.compositionsBuild.splice(index, 1)
    },
    compositionToBuild () {
      if (this.compositionCount === 0) {
        this.compositionsBuild = [{ key: '', composition: '', weight: '' }]
      } else {
        let compositionsBuild = []
        const itemCompositions = this.item.compositions
        Object.keys(this.item.compositions).forEach(function (partKey) {
          compositionsBuild.push(
            { key: partKey, composition: itemCompositions[partKey].composition, weight: itemCompositions[partKey].weight }
          )
        })
        this.compositionsBuild = compositionsBuild
      }
    },
    buildToComposition () {
      let compositionsCheck = {}
      const compositions = this.compositions
      this.compositionsBuild.forEach(function (toCheck) {
        if (toCheck.key.length > 0 && typeof compositions[toCheck.composition] !== 'undefined') {
          if (toCheck.weight < 1) toCheck.weight = 1
          compositionsCheck[toCheck.key] = {
            composition: toCheck.composition,
            weight: toCheck.weight
          }
        }
      })
      this.item.compositions = compositionsCheck
    }
  }
}
</script>

<style lang="scss">

  #addCompositionBuild {
    margin-top: 1rem;
  }

  .compositionBuildRow {
    margin-bottom: 0.2em;
  }

</style>
