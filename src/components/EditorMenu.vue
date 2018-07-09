<template>
  <div class="editor-select">
      <ul class="col-md-12">
          <li class="editor-select-new hvr-back-pulse" @click="newEditor()">
              <icon name="plus-circle"/> New one
          </li>
          <li class="editor-select-filter">
              <b-input-group>
                  <b-input-group-text slot="append" @click="clearFilter()">
                      <icon name="times" />
                  </b-input-group-text>
                  <b-form-input v-model="editorFilter"
                                type="text"
                                placeholder="Filter..."></b-form-input>
              </b-input-group>

          </li>
          <li class="editor-select-item hvr-sweep-to-right"
              v-for="(item, itemKey) in itemList" :key="itemKey"
              v-if="itemKey.includes(editorFilter)"
              :class="{'editor-select-current': itemKey === pickedKey}"
              @click="pickEditor(itemKey)">
              {{ itemKey }}
              <icon :name="getValidityDisplay(item._validity).icon" :class="getValidityDisplay(item._validity).class" class="validity-icon"></icon>
          </li>
      </ul>

      <sweet-modal ref="modalNewEditor" modal-theme="dark" title="New editor">
          <b-alert show variant="warning" v-if="newKeyInvalid">
              <icon name="exclamation-triangle"></icon>
              Key cannot be empty and must not contain space or special characters.
          </b-alert>
          <b-form-group id="newNameGroup" horizontal :label-cols="3" breakpoint="sm"
                        label="Name" label-for="newItemKey">
              <b-form-input v-model="newItemKey" id="newItemKey" type="text" ref="newItemKeyInput"
                            @keyup.enter.native="confirmNewEditor()"></b-form-input>
          </b-form-group>

          <b-button slot="button" @click="cancelNewEditor()">Cancel</b-button>
          <b-button slot="button" @click="confirmNewEditor()" variant="success">OK</b-button>
      </sweet-modal>

  </div>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'EditorMenu',
  components: { SweetModal },
  props: {
    itemList: {
      type: Object
    }
  },
  data () {
    return {
      editorFilter: '',
      newItemKey: '',
      pickedKey: '',
      newKeyInvalid: false
    }
  },
  computed: {
    ...mapGetters(['validity'])
  },
  mounted () {
    // when opening editor page, pick first element
    const itemKeys = Object.keys(this.itemList)
    if (itemKeys.length > 0) {
      this.pickEditor(itemKeys[0])
    }
  },
  methods: {
    clearFilter () {
      this.editorFilter = ''
    },
    getValidityDisplay (validity) {
      let display = { icon: 'question', class: 'validity-unkown' }
      switch (validity) {
        case this.validity.OK:
          display = { icon: 'check', class: 'validity-ok' }
          break
        case this.validity.ERROR:
          display = { icon: 'ban', class: 'validity-error' }
          break
      }
      return display
    },
    confirmNewEditor () {
      if (this.newItemKey.match(/^\w+$/)) {
        this.$refs.modalNewEditor.close()
        this.pickEditor(this.newItemKey)
        this.newItemKey = ''
        this.newKeyInvalid = false
      } else {
        this.newKeyInvalid = true
      }
    },
    cancelNewEditor () {
      this.newItemKey = ''
      this.newKeyInvalid = false
      this.$refs.modalNewEditor.close()
    },
    newEditor () {
      this.$refs.modalNewEditor.open()
      // need to focus on input. Not fully mounted yet, so focus on next tick
      this.$nextTick(() => this.$refs.newItemKeyInput.focus())
    },
    pickEditor (itemKey) {
      this.clearFilter()
      this.pickedKey = itemKey
      this.$emit('edit-item', itemKey)
    }
  }
}
</script>

<style lang="scss">
    @import '../assets/kngconfig.scss';

    .editor-select {
        text-align: justify;
        background-color: $bg-dark;
        border: 1px solid $second-color;
        padding-top: 0.75rem;
        & li {
            display: block;
            cursor: pointer;
            padding: 0.25rem 0.75rem;
            color: $text-light;
            border-bottom: 2px solid transparent;
            &.editor-select-current {
                border-color: $main-color;
            }
        }
    }

    .hvr-sweep-to-right:before {
        background-color: $main-color;
    }

    .hvr-back-pulse:hover {
        background-color: $main-color;
    }

    @keyframes hvr-back-pulse {
        50% {
            background-color: $bg-dark;
        }
    }

    .sweet-buttons button {
        margin-left: 2rem;
    }

    .validity-icon {
        float: right;
        margin-right: 1rem;
        &.validity-error {
            color: $error;
        }
        &.validity-ok {
            color: $success;
        }
    }

</style>
