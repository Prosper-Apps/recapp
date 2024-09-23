<template>
  <div
    v-if="notes.data?.length === 0"
    class="flex flex-col gap-3 justify-center items-center h-full"
  >
    <div class="text-gray-500 text-xl">No notes found</div>
    <Button class="ml-2" variant="solid" @click="store.open_new_dialog">
      + Add Note
    </Button>
  </div>
  <draggable
    v-else
    v-model="notes.data"
    handle=".note-drag-handle"
    :animation="200"
    easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
    item-key="name"
    @end="update_note_sequence(notes.data)"
  >
    <template #item="{ element, index }">
      <div class="group flex items-center py-2 last:mb-0 cursor-pointer">
        <Note :note="element" />
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { Button } from 'frappe-ui'
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
