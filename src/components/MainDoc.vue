<template>
  <div class="container engine-doc">
    <h1>Documentation</h1>

    <h2>KNG Engine</h2>
    <p>
      The Keiwen Name Generator Engine aims to generate random names. It contains 4 specific parts:
    </p>
    <dl>
      <dt>Origin:</dt>
      <dd>
        represents the origin of the name (country, race, ...). It contains one or more compositions.
      </dd>
      <dt>Composition:</dt>
      <dd>
        represents the name composition (first then last name, only a nickname, ...). It contains one or more components.
      </dd>
      <dt>Component:</dt>
      <dd>
        represents a part of a full name (first name, last name, ...). It uses a process.
      </dd>
      <dt>Process:</dt>
      <dd>
        defines rules to generate a random name, based on entries given (the 'dictionary').
        There are several types of processes, learn more in <router-link :to="{ name: 'DocProcess' }" >process documentation</router-link>.
      </dd>
    </dl>
    <h2>KNG Configurator</h2>
    <p>
      The Keiwen Name Generator Configurator is a web interface, facilitating engine build.
      By defining processes, components, compositions and origins, you will get a configuration
      that you can export to import back later.
    </p>
    <h2>Example</h2>
    <p>
      Let's say I want to build a english name. My origin will be 'english'
      (I can later add french, japanese, whatever...).
      I will use a single composition, first then last name,
      so I will create two components (first and last name).
      Each components will use the simplest process, the 'Raw list',
      that will simply pick a random name among a given list.
    </p>
    <b-alert variant="info" show>
      <icon name="lightbulb-o"></icon>
      I'm thinking from origin to process (global to detail),
      but I will create from process to origin as global include detail.
    </b-alert>
    <p>
      Engine is ready, I need to validate it to use it. Now it will pick a random origin,
      then a random composition and build the full name with all components found.
      In my case, it will build a full english name (ie first than last name).
      I can check name in details (origin, composition and all components split).
    </p>
    <p>
      Check out this sample and go further in <router-link :to="{ name: 'Tutorial' }" >tutorial</router-link>.
    </p>

  </div>
</template>

<script>
export default {
  name: 'MainDoc',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">

  .engine-doc p,dl {
    text-align: justify;
    dt {
      float: left;
      margin-right: 1rem;
    }
  }

</style>
