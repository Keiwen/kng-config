<template>
  <div>
    <b-progress class="mt-1" :max="buildStatus.total" show-value>
      <b-progress-bar :value="buildStatus.ok" variant="success"></b-progress-bar>
      <b-progress-bar :value="buildStatus.unknown" variant="secondary"></b-progress-bar>
      <b-progress-bar :value="buildStatus.error" variant="danger"></b-progress-bar>
    </b-progress>
  </div>
</template>

<script>
export default {
  name: 'BuildStatus',
  props: {
    buildStatus: {
      type: Object
    }
  }
}
</script>

<style>
</style>
