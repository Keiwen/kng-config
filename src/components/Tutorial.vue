<template>
  <div class="container tuto">
    <h1>Tutorial</h1>

    <ul>
      <li><a href="#tuto_simple">Simple english names</a></li>
      <li><a href="#tuto_mix">Mix with spanish names</a></li>
      <li><a href="#tuto_further">Going further</a></li>
      <li><a href="#tuto_fantasy">Fantasy case</a></li>
    </ul>

    <h2 id="tuto_simple">Simple english names</h2>
    <p>
      Let's say I want to build an american name. My origin will be 'usa'.
      Names are simply composed of a first and last name.
      In this sample, i will simply pick a random name among a given list
      of standard english first and last names.
    </p>

    <b-alert variant="info" show>
      <icon name="lightbulb-o"></icon>
      I'm thinking from origin to component (global to detail),
      but I will create from component to origin as global include detail.
    </b-alert>

    <p>
      I create 'efn' (english first name) and 'eln' (english last name) components.
      I'm using the simple 'RawList' process for both, providing standard names.
      For example, 'eln' could contain 'Smith', 'Jones', and 'Williams'.
      Of course, I will add a lot more for more variety in the final name.
    </p>

    <p>
      Then I create the 'en' (for english) composition.
      I add the 'efn' component, defining 'first name' as the part key.
      Similarly, I add the 'eln' component with 'last name' key.
      The part keys will be used for detailed name.
      I can now define the composition pattern, using defined keys:
      here it will be 'first name' then 'last name'.
    </p>

    <p>
      Finally I create the 'usa' origin.
      I add the 'en' composition with 'english' as the part key.
    </p>

    <p>
      Now I'm done with configuration.
      On main page, I can check and validate it to start using it.
      On generation, engine will pick a random origin, then a random composition in it.
      For each components of this composition, it will generate a random value according
      to the component's process.
    </p>

    <b-button @click="loadTutoConfig('tuto_en')" variant="primary" class="presetButton">Load sample configuration</b-button>

    <h2 id="tuto_mix">Mix with spanish names</h2>
    <p>
      Ok now I want to consider american people with spanish names.
      I add two components ('sfn' and 'sln') with some spanish names.
      Then I create a new 'sp' composition that use these components.
      When defining composition part keys, I will still use 'first name' and 'last name'.
      This way, detailed name will have the same parts no matter english or spanish composition.
    </p>

    <p>
      Then I can complete my 'usa' origin adding my new composition.
      I set 'spanish' as part key.
      Now, let's say that roughly 10 % of american people have spanish names.
      I set my first composition weight to 9 and my new one to 1.
      Now, 1 on 10 generated names will be spanish.
    </p>

    <p>
      When generating a detailed name, I can see that name parts are still the same
      (as defined, 'first name' and 'last name')
      but composition field can be 'english' or 'spanish'.
    </p>

    <b-button @click="loadTutoConfig('tuto_usa')" variant="primary" class="presetButton">Load sample configuration</b-button>

    <h2 id="tuto_further">Going further</h2>
    <p>
      Here I can complete my configuration again to generate a worldwide name.
      I can simply add some 'UK' and 'Spain' origin with work already done,
      and I can add some components from other countries.
    </p>
    <p>
      Nearly all names in the world are composed of a first and last name.
      However, portuguese names often use a nickname,
      so I may need to add this to the portuguese composition.
    </p>
    <p>
      Wait... What about girl names?
      I can use the same last name list, but a different first name list.
      I add another composition using female first names to my origin
      and I can adjust weights if needed.
    </p>

    <h2 id="tuto_fantasy">Fantasy case</h2>
    <p>
      Let's create a new fantasy race. Let's supposed that:
    </p>
    <ul>
      <li>They have names composed of family name first, individual name last</li>
      <li>They use following consonants: bdfgjklmnprstv</li>
      <li>They use following vowels: aeiou</li>
      <li>They use following consonants for restricted cases: dklnrst</li>
      <li>Family names are defined on 3 letters: consonant, vowel, restricted consonant</li>
      <li>Individual names are defined on 5 letters: consonant, vowel, consonant, vowel, consonant</li>
    </ul>
    <p>
      So I create a 'family_name' component with a sequence process,
      and a 'individual_name' with a char group pattern process.
      My composition will use family then individual names.
      Finally, I create a single origin using this composition.
    </p>

    <b-button @click="loadTutoConfig('tuto_fantasy')" variant="primary" class="presetButton">Load sample configuration</b-button>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Tutorial',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(['loadPresetConfig']),
    loadTutoConfig (tutoName) {
      this.loadPresetConfig(tutoName)
      this.$router.push({name: 'Homepage'})
    }
  }
}
</script>

<style lang="scss">

  .tuto {
    margin-bottom: 5rem;
    p,ul {
      text-align: justify;
    }
  }

  .presetButton {
    margin-bottom: 1rem;
  }

</style>
