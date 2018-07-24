<template>
  <div class="container sample">
    <h1>Samples</h1>

    <div v-if="currentSample">
      <h2>{{ samplesList[currentSample] }}</h2>

      <div v-if="currentSample === 'elite_stars'">
        <p>
          Elite is a space trading video game,
          written and developed by David Braben and Ian Bell
          and originally published by Acornsoft
          for the BBC Micro and Acorn Electron computers in September 1984.
          This game used open-ended game model and procedural generation.
        </p>
        <p>
          Star name generation pick among a predefined list 4 syllables
          to obtain the final name, like Gebete, Ormalean, or Ceisatan.
        </p>
      </div>

      <b-button @click="loadSampleConfig()" variant="primary" class="presetButton">Load sample configuration</b-button>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Samples',
  data () {
    return {
      samplesList: {
        // do not manage in store, as its save client-side
        // we need to update it without empty client data!
        'elite_stars': 'Star names in Elite game'
      }
    }
  },
  computed: {
    currentSample () {
      if (this.$route.meta && this.$route.meta.sampleRoute) {
        let sample = this.$route.meta.sampleRoute
        if (typeof this.samplesList[sample] !== 'undefined') {
          return sample
        }
      }
      return ''
    }
  },
  methods: {
    ...mapActions(['loadPresetConfig']),
    loadSampleConfig () {
      this.loadPresetConfig(this.currentSample)
      this.$router.push({name: 'Homepage'})
    }
  }
}
</script>

<style lang="scss">

  .sample {
    margin-bottom: 5rem;
    p,ul {
      text-align: justify;
    }
  }

  .presetButton {
    margin-bottom: 1rem;
  }

</style>
