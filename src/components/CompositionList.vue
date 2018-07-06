<template>
  <div>
    <h1>Compositions</h1>
    <div>
      <editor-page category="compositions"
                   :items="compositions"
      >
      </editor-page>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditorPage from './EditorPage'

export default {
  name: 'Compositions',
  components: { EditorPage },
  computed: {
    ...mapGetters(['compositions'])
  }
}
</script>

<style lang="scss">

</style>
