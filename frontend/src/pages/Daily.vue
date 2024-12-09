<template>
  <div class="flex flex-col flex-1 mx-6 sm:mx-20">
    <draggable
      v-model="notes.data"
      handle=".note-drag-handle"
      :animation="200"
      easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
      item-key="name"
      @end="update_note_sequence(notes.data)"
    >
      <template #item="{ element }">
        <div class="group flex items-center py-2 last:mb-0 cursor-pointer">
          <Note :note="element" />
        </div>
      </template>
    </draggable>
    <AddNote class="mx-6 my-2" />
  </div>
</template>

<script setup>
import AddNote from '../components/AddNote.vue'
import Note from '../components/Note.vue'
import { update_note_sequence } from '../data/notes'
import draggable from 'vuedraggable'
import { useStore } from '../store'
import { notes } from '../data/notes'
import { session } from '../data/session'
import { watch } from 'vue'

let store = useStore()

watch(
  () => store.today,
  (new_val) => {
    notes.filters = [
      ['date', '=', new_val],
      ['owner', '=', session.user],
    ]
    notes.fetch()
  },
  { immediate: true },
)
</script>
