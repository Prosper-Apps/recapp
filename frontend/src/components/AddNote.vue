<template>
  <div
    class="flex justify-center items-center gap-1 hover:bg-gray-50 p-1 rounded"
  >
    <div class="p-1.5 bg-gray-200 rounded ml-4">
      <FeatherIcon
        name="type"
        :stroke-width="2"
        class="h-3 w-3 text-gray-700 cursor-pointer"
      />
    </div>
    <TextInput
      class="w-full [&>input]:border-0"
      variant="outline"
      v-model="newTitle"
      placeholder="Send an email to John by EOD"
      @keydown.enter.stop="(e) => addNewNote(e.target.value)"
    />
  </div>
</template>

<script setup>
import { TextInput, FeatherIcon } from 'frappe-ui'
import { notes } from '../data/notes'
import { useStore } from '../store'
import { ref } from 'vue'

const props = defineProps({
  date: String,
})

const store = useStore()

const newTitle = ref('')

function addNewNote(val) {
  let title = val.trim()
  let date = props.date || store.date
  let sequence_id = notes.data.length + 1 || 1
  notes.insert.submit({ title, date, sequence_id }).then(() => {
    notes.reload()
    newTitle.value = ''
  })
}
</script>
