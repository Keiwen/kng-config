<template>
  <div>
    <h1>Origins</h1>
    <div>
      <editor-page category="origins"
                   :items="origins"
      >
      </editor-page>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditorPage from './EditorPage'

export default {
  name: 'Origins',
  components: { EditorPage },
  computed: {
    ...mapGetters(['origins'])
  }
}
</script>

<style lang="scss">

</style>
