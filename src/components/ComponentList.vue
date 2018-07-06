<template>
  <div>
    <h1>Components</h1>
    <div>
      <editor-page category="components"
                   :items="components"
      >
      </editor-page>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditorPage from './EditorPage'

export default {
  name: 'Components',
  components: { EditorPage },
  computed: {
    ...mapGetters(['components'])
  }
}
</script>

<style lang="scss">

</style>
