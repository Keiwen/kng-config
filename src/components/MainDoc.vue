<template>
  <div class="container engine-doc">
    <h1>Documentation</h1>

    <h2>KNG Engine</h2>
    <p>
      The Keiwen Name Generator Engine aims to generate random names. It contains 3 specific parts:
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
        represents a part of a full name (first name, last name, ...). It uses a process,
        that defines rules to generate a random name, based on entries given (the 'dictionary').
        There are several types of processes, learn more in <router-link :to="{ name: 'DocProcess' }" >process documentation</router-link>.
      </dd>
    </dl>
    <h2>KNG Configurator</h2>
    <p>
      The Keiwen Name Generator Configurator is a web interface, facilitating engine build.
      By defining components, compositions and origins, you will get a configuration
      that you can export to import back later.
    </p>
    <hr/>
    <p>
      Check out <router-link :to="{ name: 'Tutorial' }" >tutorial</router-link> to learn how to use this tool.
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
