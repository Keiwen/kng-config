<template>
  <div>
    <b-form-group id="fg_process"
                  horizontal
                  :label-cols="3"
                  breakpoint="sm"
                  label="Process"
                  label-for="fi_process">
      <v-select :options="Object.keys(processes)" v-model="item.process" :onChange="selectChange()"></v-select>
    </b-form-group>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VSelect from 'vue-select'

export default {
  name: 'ProcessEditor',
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
    }
  },
  watch: {
    item () {
      this.reloadItem()
    }
  },
  computed: {
    ...mapGetters(['components', 'processes'])
  },
  mounted () {
    this.reloadItem()
  },
  methods: {
    reloadItem () {
      // reloading attribute is used for watchers to ignore this modification
      this.item._reloading = true
      this.$nextTick(() => { this.item._reloading = false })
    },
    selectChange () {
      // we use this overProcess to activate this.item watch.
      // Otherwise, change is detected only if process had a value and change for another
      // I had trouble when default value was empty, setting smthg from dropdown did not
      // activate item watch.
      this.item._overProcess = this.item.process
    }
  }
}
</script>

<style lang="scss">
</style>
