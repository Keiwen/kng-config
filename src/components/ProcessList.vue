<template>
  <div>
    <h1>Processes</h1>
    <div>
      <editor-page category="processes"
                   :items="processes"
      >
      </editor-page>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditorPage from './EditorPage'

export default {
  name: 'Processes',
  components: { EditorPage },
  computed: {
    ...mapGetters(['processes'])
  }
}
</script>

<style lang="scss">

</style>
