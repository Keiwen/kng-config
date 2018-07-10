<template>
  <div>
    <h1>Processes documentation</h1>

    <b-card-group class="justify-content-center">
      <div class="col-5">
        <b-card class="bg-transparent" header="Common" header-bg-variant="dark" header-text-variant="white">
          <div>
            <p>
              A process will generate a random name based on given entries.
            </p>
            <p>Processes are using following parameters:</p>
            <div class="container">
              <b-table striped bordered small head-variant="dark" hover :items="parameters"></b-table>
            </div>
          </div>
        </b-card>
      </div>
      <div class="col-7">
        <b-card class="bg-transparent" header="Process types" header-bg-variant="dark" header-text-variant="white">
          <div>
            <div role="tablist">
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1 border-0" role="tab">
                  <b-btn block href="#" v-b-toggle.accordionRawList variant="info">Raw list</b-btn>
                </b-card-header>
                <b-collapse id="accordionRawList" visible accordion="process-accordion" role="tabpanel">
                  <b-card-body>
                    <p class="card-text">
                      Raw list process aims to pick a random value among a list.
                    </p>
                    <b-card-group deck class="justify-content-center">
                      <b-card no-body header="Entries sample">
                        <ul><li>Superman</li><li>Batman</li></ul>
                      </b-card>
                      <b-card no-body header="Possible results">
                        <ul><li>Superman <i>(50 %)</i></li><li>Batman <i>(50 %)</i></li></ul>
                      </b-card>
                    </b-card-group>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1 border-0" role="tab">
                  <b-btn block href="#" v-b-toggle.accordionWeightedList variant="info">Weighted list</b-btn>
                </b-card-header>
                <b-collapse id="accordionWeightedList" accordion="process-accordion" role="tabpanel">
                  <b-card-body>
                    <p class="card-text">
                      Weighted list process aims to pick a random value among a list,
                      according to each element's weight (chance to be picked).
                    </p>
                    <b-alert show variant="warning">
                      <icon name="exclamation-triangle"></icon>
                      Weighted list allow 'defaultWeight' attribute to set default weight on entries (1 by default)
                    </b-alert>
                    <b-alert show variant="warning">
                      <icon name="exclamation-triangle"></icon>
                      Each entry should be defined with an associated weight, or default weight is used.
                    </b-alert>
                    <b-card-group deck class="justify-content-center">
                      <b-card no-body header="Entries sample">
                        <ul><li>Superman <i>(weight: 1)</i></li><li>Batman <i>(weight: 3)</i></li></ul>
                      </b-card>
                      <b-card no-body header="Possible results">
                        <ul><li>Superman <i>(25 %)</i></li><li>Batman <i>(75 %)</i></li></ul>
                      </b-card>
                    </b-card-group>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1 border-0" role="tab">
                  <b-btn block href="#" v-b-toggle.accordionSequence variant="info">Sequence</b-btn>
                </b-card-header>
                <b-collapse id="accordionSequence" accordion="process-accordion" role="tabpanel">
                  <b-card-body>
                    <p class="card-text">
                      Sequence process aims to build a random value following a list of characters group.
                      It randomly picks a value among each entry.
                    </p>
                    <b-card-group deck class="justify-content-center">
                      <b-card no-body header="Entries sample">
                        <div class="card-text">
                          <ul><li>Super / Bat</li><li>man / girl</li></ul>
                        </div>
                      </b-card>
                      <b-card no-body header="Possible results">
                        <ul><li>Superman <i>(25 %)</i></li><li>Supergirl <i>(25 %)</i></li><li>Batman <i>(25 %)</i></li><li>Batgirl <i>(25 %)</i></li></ul>
                      </b-card>
                    </b-card-group>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1 border-0" role="tab">
                  <b-btn block href="#" v-b-toggle.accordionCharGroup variant="info">Char group pattern</b-btn>
                </b-card-header>
                <b-collapse id="accordionCharGroup" accordion="process-accordion" role="tabpanel">
                  <b-card-body>
                    <p class="card-text">
                      Char group pattern process aims to build a random value following a given pattern.
                      Each entry contains a group of characters, identified by a key.
                      On generation, it will follow the pattern to pick a random value from matching entry.
                      If no match found, generated name will keep this value.
                    </p>
                    <b-alert show variant="warning">
                      <icon name="exclamation-triangle"></icon>
                      Each entry must be defined with an associated key.
                    </b-alert>
                    <b-alert show variant="warning">
                      <icon name="exclamation-triangle"></icon>
                      Parameter 'pattern' is required. If multiple values provided,
                      a random one will be picked before generation.
                    </b-alert>
                    <b-card-group deck class="justify-content-center">
                      <b-card no-body header="Entries">
                        <ul><li>a <i>(key: a)</i></li><li>p / m <i>(key: b)</i></li></ul>
                      </b-card>
                      <b-card no-body header="Possible results">
                        <span>With patterns 'ab' and 'a-b':</span>
                        <ul><li>ap <i>(25 %)</i></li><li>am <i>(25%)</i></li><li>a-p <i>(25%)</i></li><li>a-m <i>(25%)</i></li></ul>
                      </b-card>
                    </b-card-group>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1 border-0" role="tab">
                  <b-btn block href="#" v-b-toggle.accordionMarkov variant="info">Markov</b-btn>
                </b-card-header>
                <b-collapse id="accordionMarkov" accordion="process-accordion" role="tabpanel">
                  <b-card-body>
                    <p class="card-text">
                      Markov process aims to build a random name similar to given entries,
                      based on a <a href="https://en.wikipedia.org/wiki/Markov_chain">Markov chain</a>.
                      A Markov state represents a characters group. Its linked to other states (neighbors)
                      representing next character groups possibilities.
                      Neighbors weight is based on how often this combination is found in given entries.
                      Generation will pick a random initial char,
                      then randomly process markov chain and concatenate all characters found.
                    </p>
                    <b-alert show variant="warning">
                      <icon name="exclamation-triangle"></icon>
                      Parameter 'order' is required. It will determine how many characters
                      are considered in a group.
                    </b-alert>
                    <p class="card-text">
                      This process can also use specific parameters, as described below.
                    </p>
                    <div class="container">
                      <b-table striped bordered small head-variant="dark" hover :items="markovParameters"></b-table>
                    </div>
                    <b-card-group deck class="justify-content-center">
                      <b-card no-body header="Entries">
                        <ul><li>Manwë</li><li>Yavanna</li></ul>
                      </b-card>
                      <b-card no-body header="Possible results">
                        <span>With order 2:</span>
                        <ul><li>Manwë <i>(25 %)</i></li><li>Yavanna <i>(25%)</i></li><li>Manna <i>(25%)</i></li><li>Yavanwë <i>(25%)</i></li></ul>
                      </b-card>
                    </b-card-group>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
        </b-card>
      </div>
    </b-card-group>

  </div>
</template>

<script>
export default {
  name: 'Processes',
  data () {
    return {
      parameters: [
        {name: 'capitalize', description: 'format name to upper case', sample: 'NAME'},
        {name: 'minimize', description: 'format name to lower case', sample: 'name'},
        {name: 'uppercaseFirst', description: 'format first character to upper case', sample: 'Name'}
      ],
      markovParameters: [
        {name: 'minLength', description: 'Minimum length of generated name', 'default': 1},
        {name: 'maxLength', description: 'Maximum length of generated name (-1 to ignore limit)', 'default': -1},
        {name: 'maxAttempts', description: 'How many attempts are allowed to generate a name matching requirements', 'default': 25},
        {name: 'allowDuplicates', description: 'Allow generated name to exactly match one of the entry', 'default': 'true'},
        {name: 'setAllowSubDuplicates', description: 'Allow generated name to match a sub-part of one of the entry', 'default': 'true'}
      ]
    }
  }
}
</script>

<style scoped>
  i {
    color: #888888;
  }

  ul {
    text-align: left;
  }

</style>
