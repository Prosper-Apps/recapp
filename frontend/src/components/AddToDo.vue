<template>
  <div
    v-if="show"
    class="flex justify-center gap-1 hover:bg-gray-50 p-1 rounded"
  >
    <div class="mt-[3px] ml-[68px]">
      <Checkbox class="p-0.5 text-gray-500" />
    </div>
    <TextInput
      ref="inputRef"
      class="w-full"
      v-model="newTitle"
      placeholder="Add ToDo"
      @keydown.enter.stop="(e) => addNewToDo(e.target.value)"
    />
    <Button class="shrink-0" icon="x" variant="ghost" @click="show = false" />
  </div>
</template>

<script setup>
import { Button, TextInput, Checkbox } from 'frappe-ui'
import { todos } from '../data/todos'
import { ref, nextTick, onMounted } from 'vue'

const show = defineModel()
const newTitle = ref('')
const inputRef = ref(null)

function addNewToDo(val) {
  todos.insert
    .submit({
      title: val,
      date: new Date().toISOString().split('T')[0],
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
