<template>
  <Dialog
    v-model="show"
    :options="{
      actions: [
        { label: 'Update', variant: 'solid', onClick: updateToDo },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
  >
    <template #body-title>
      <h2 class="text-2xl font-semibold mb-4">Update ToDo</h2>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-4">
        <FormControl
          type="text"
          label="Title"
          placeholder="ToDo Title"
          v-model="todo.title"
        >
          <template #prefix>
            <FeatherIcon name="type" class="h-3.5 w-3.5 text-gray-600" />
          </template>
        </FormControl>
        <FormControl
          type="text"
          label="Link"
          placeholder="ToDo Link"
          v-model="todo.link"
        >
          <template #prefix>
            <FeatherIcon name="link" class="h-3.5 w-3.5 text-gray-600" />
          </template>
        </FormControl>
        <span class="-mb-2 block text-sm leading-4 text-gray-700">
          Description
        </span>
        <TextEditor
          editor-class="prose-sm border max-w-none rounded-b-lg p-2 overflow-auto h-40 focus:outline-none"
          :fixedMenu="true"
          :content="todo.description"
          @change="(val) => (todo.description = val)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { Dialog, FormControl, TextEditor, FeatherIcon } from 'frappe-ui'
import { todos } from '../data/todos'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const show = defineModel()

function updateToDo() {
  todos.setValue
    .submit({
      name: props.todo.name,
      title: props.todo.title,
      description: props.todo.description,
      link: props.todo.link,
    })
    .then(() => {
      todos.reload()
      show.value = false
    })
}
</script>
