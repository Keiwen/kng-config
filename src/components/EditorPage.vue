<template>
  <div class="editor-zone row">

      <div class="editor-main col-md-9">
          <div v-if="pickedItem !== null">
              <div class="row">
                  <div class="col-md-10 col-sm-9">
                      <h2>{{ pickedItem._key }}</h2>
                  </div>
                  <div class="col-md-2 col-sm-3">
                      <b-button :variant="validityButton.variant"
                                @click="validItem()">{{ validityButton.text }}</b-button>
                  </div>
                  <b-alert show variant="danger" v-if="pickedItem._validityError" class="col-md-12">
                      <icon name="times-circle"></icon>
                      {{ pickedItem._validityError }}
                  </b-alert>
              </div>

              <component-editor v-if="category === 'components'"
                              v-model="pickedItem"
                              @update-item="updateItem"></component-editor>
              <composition-editor v-if="category === 'compositions'"
                                  v-model="pickedItem"
                                  @update-item="updateItem"></composition-editor>
              <origin-editor v-if="category === 'origins'"
                             v-model="pickedItem"
                             @update-item="updateItem"></origin-editor>

              <div class="row removeItem">
                  <b-button variant="danger"
                            @click="promptConfirmRemove()"><icon name="trash" /> Remove</b-button>
              </div>
              <sweet-modal icon="warning" ref="modalConfirmRemove" modal-theme="dark">
                  Are you sure to remove this item?
                  <b-button slot="button" @click="removeCanceled()" variant="">Cancel</b-button>
                  <b-button slot="button" @click="removeConfirmed()" variant="success">Confirm</b-button>
              </sweet-modal>

          </div>
      </div>

      <div class="col-md-3">
          <editor-menu @edit-item="pickEditor" :itemList="items"></editor-menu>
      </div>

  </div>
</template>

<script>
import * as storeMut from '@/store/mutation-types'
import ComponentEditor from './ComponentEditor'
import CompositionEditor from './CompositionEditor'
import OriginEditor from './OriginEditor'
import EditorMenu from './EditorMenu'
import { mapGetters, mapActions } from 'vuex'
import { KngSerializer } from 'kng-engine'
import { SweetModal } from 'sweet-modal-vue'

export default {
  name: 'EditorPage',
  components: { EditorMenu, ComponentEditor, CompositionEditor, OriginEditor, KngSerializer, SweetModal },
  props: {
    items: {
      type: Object
    },
    category: {
      type: String
    }
  },
  data () {
    return {
      pickedItem: null,
      switchItem: false
    }
  },
  computed: {
    ...mapGetters([
      'defaultComponent', 'defaultComponent', 'defaultComposition', 'defaultOrigin',
      'validity'
    ]),
    validityButton () {
      let buttonData = {
        variant: 'secondary',
        text: 'Validation'
      }
      switch (this.pickedItem._validity) {
        case this.validity.ERROR:
          buttonData = {
            variant: 'danger',
            text: 'Invalid'
          }
          break
        case this.validity.OK:
          buttonData = {
            variant: 'success',
            text: 'Valid'
          }
          break
      }
      return buttonData
    }
  },
  watch: {
    pickedItem: {
      handler (newValue, oldValue) {
        if (newValue !== null && oldValue !== null && !newValue._reloading && !this.switchItem) {
          // update only if item has changed, while we are not changing selection and its not reloading itself
          this.updateItem(newValue)
        }
        // after item pick, it will reload itself. Wait for end of reload to end switch process
        if (newValue !== null && !newValue._reloading) this.switchItem = false
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['validateComponent', 'validateComposition', 'validateOrigin']),
    updateItem (item) {
      if (item !== null) {
        switch (this.category) {
          case 'components':
            this.$store.commit(storeMut.ADD_COMPONENT, item)
            break
          case 'compositions':
            this.$store.commit(storeMut.ADD_COMPOSITION, item)
            break
          case 'origins':
            this.$store.commit(storeMut.ADD_ORIGIN, item)
            break
        }
      }
    },
    pickEditor (itemKey) {
      // enter in switch process
      this.switchItem = true
      if (typeof this.items[itemKey] === 'undefined') {
        let item = null
        switch (this.category) {
          case 'components':
            item = this.defaultComponent
            break
          case 'compositions':
            item = this.defaultComposition
            break
          case 'origins':
            item = this.defaultOrigin
            break
        }
        if (item !== null) {
          // clone default item to manipulate it, or it will change state directly
          item = JSON.parse(JSON.stringify(item))
          item._key = itemKey
          this.updateItem(item)
        }
      }
      this.pickedItem = JSON.parse(JSON.stringify(this.items[itemKey]))
      this.pickedItem._key = itemKey
      // while switching item, it will reload itself, initiate it
      this.pickedItem._reloading = true
    },
    validItem () {
      switch (this.category) {
        case 'components':
          this.validateComponent(this.pickedItem._key)
          break
        case 'compositions':
          this.validateComposition(this.pickedItem._key)
          break
        case 'origins':
          this.validateOrigin(this.pickedItem._key)
          break
      }
      this.pickEditor(this.pickedItem._key)
    },
    promptConfirmRemove () {
      this.$refs.modalConfirmRemove.open()
    },
    removeConfirmed () {
      this.$refs.modalConfirmRemove.close()
      switch (this.category) {
        case 'components':
          this.$store.commit(storeMut.REMOVE_COMPONENT, this.pickedItem._key)
          break
        case 'compositions':
          this.$store.commit(storeMut.REMOVE_COMPOSITION, this.pickedItem._key)
          break
        case 'origins':
          this.$store.commit(storeMut.REMOVE_ORIGIN, this.pickedItem._key)
          break
      }
      this.pickedItem = null
    },
    removeCanceled () {
      this.$refs.modalConfirmRemove.close()
    }
  }
}
</script>

<style lang="scss">
    @import '../assets/kngconfig.scss';

    .editor-zone {
        margin-right: auto;
        margin-left: auto;
        padding: 0 20px;
    }

    .b-form-group {
        text-align: justify;
    }
    label {
        text-align: justify;
    }

    .removeItem {
        border-top: 1px solid $second-color;
        margin-top: 2rem;
        margin-bottom: 2rem;
        padding-top: 1rem;
    }

</style>
