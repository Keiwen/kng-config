<template>
  <div>
    <b-form-group id="fg_pattern"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label="Pattern"
                  label-for="fi_pattern">
      <div class="row">
        <v-select :options="Object.keys(item.components)"
                  v-model="item.pattern" multiple
                  class="col-md-12"></v-select>
      </div>
    </b-form-group>

    <b-form-group id="fg_components"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label-for="fi_components">
      <span slot="label">Components to use <b-badge pill variant="dark">{{ componentCount }}</b-badge></span>
      <div class="row componentBuildRow" v-for="(componentBuild, index) in componentsBuild" :key="index">
        <b-form-input v-model="componentBuild.key" type="text"
                      class="col-sm-4" :state="componentBuild.key.length > 0"
                      placeholder="Composition part key"></b-form-input>
        <v-select :options="Object.keys(components)"
                  v-model="componentBuild.component"
                  class="col-sm-7 col-md-5 offset-md-1"></v-select>
        <b-button variant="outline-secondary"
                  @click="removeBuild(index)"
                  class="col-sm-1 offset-md-1"><icon name="trash"></icon></b-button>
      </div>
      <b-button variant="outline-primary" id="addComponentBuild"
                @click="addBuild()"><icon name="plus-circle"></icon> Add component</b-button>
    </b-form-group>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VSelect from 'vue-select'

export default {
  name: 'ComponentEditor',
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
      componentsBuild: [{ key: '', component: '' }]
    }
  },
  watch: {
    item () {
      this.reloadItem()
    },
    componentsBuild: {
      handler () {
        this.buildToComponent()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['compositions', 'components']),
    componentCount () {
      return Object.keys(this.item.components).length
    }
  },
  mounted () {
    this.reloadItem()
  },
  methods: {
    reloadItem () {
      // reloading attribute is used for watchers to ignore this modification
      this.item._reloading = true
      this.componentToBuild()
      this.$nextTick(() => { this.item._reloading = false })
    },
    addBuild () {
      this.componentsBuild.push({ key: '', component: '' })
    },
    removeBuild (index) {
      this.componentsBuild.splice(index, 1)
    },
    componentToBuild () {
      if (this.componentCount === 0) {
        this.componentsBuild = [{ key: '', component: '' }]
      } else {
        let componentsBuild = []
        const itemComponents = this.item.components
        Object.keys(this.item.components).forEach(function (partKey) {
          componentsBuild.push({ key: partKey, component: itemComponents[partKey] })
        })
        this.componentsBuild = componentsBuild
      }
    },
    buildToComponent () {
      let componentsCheck = {}
      const components = this.components
      this.componentsBuild.forEach(function (toCheck) {
        if (toCheck.key.length > 0 && typeof components[toCheck.component] !== 'undefined') {
          componentsCheck[toCheck.key] = toCheck.component
        }
      })
      this.item.components = componentsCheck
    }
  }
}
</script>

<style lang="scss">

  #addComponentBuild {
    margin-top: 1rem;
  }

  .componentBuildRow {
    margin-bottom: 0.2em;
  }

</style>
