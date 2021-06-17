<template>
  <div v-if="generatedName">
      <strong>Origin:</strong> {{ generatedName.origin }}
      <br/>
      <strong>Composition:</strong> {{ generatedName.composition }}
      <b-table bordered small responsive hover :items="generatedNameSplitTable"></b-table>
  </div>
</template>

<script>

export default {
  name: 'NameDetail',
  props: {
    generatedName: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    generatedNameSplitTable () {
      let splitTable = []
      if (!this.generatedName) return splitTable
      const split = this.generatedName.split
      Object.keys(split).forEach(function (compKey) {
        splitTable.push({namePart: compKey, value: split[compKey]})
      })
      return splitTable
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/kngconfig.scss';

</style>
