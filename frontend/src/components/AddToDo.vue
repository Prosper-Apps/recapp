<template>
  <div class="flex justify-center gap-1 hover:bg-gray-50 p-1 rounded">
    <div class="mt-1 ml-10">
      <Checkbox class="p-0.5 text-gray-500" />
    </div>
    <TextInput
      class="w-full [&>input]:border-0"
      variant="outline"
      v-model="newTitle"
      placeholder="Send an email to John by EOD"
      @keydown.enter.stop="(e) => addNewToDo(e.target.value)"
    />
  </div>
</template>

<script setup>
import { TextInput, Checkbox } from 'frappe-ui'
import { todos } from '../data/todos'
import { ref } from 'vue'

const newTitle = ref('')

function addNewToDo(val) {
  todos.insert
    .submit({
      title: val,
      sequence_id: todos.data.length + 1,
    })
    .then(() => {
      todos.fetch()
      newTitle.value = ''
    })
}
</script>
