<template>
  <div class="flex justify-center gap-1 hover:bg-gray-50 p-1 rounded">
    <div class="mt-[3px] ml-10">
      <Checkbox class="p-0.5 text-gray-500" />
    </div>
    <TextInput
      ref="inputRef"
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
import { ref, nextTick, onMounted } from 'vue'

const newTitle = ref('')
const inputRef = ref(null)

function addNewToDo(val) {
  todos.insert
    .submit({
      title: val,
      sequence_id: todos.data.length + 1,
    })
    .then(() => {
      todos.fetch()
      newTitle.value = ''
      show.value = false
    })
}

onMounted(() =>
  nextTick(() => {
    inputRef.value.el.focus()
  }),
)
</script>
