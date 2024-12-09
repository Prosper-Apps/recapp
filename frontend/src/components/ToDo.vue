<template>
  <div class="flex flex-col gap-4 flex-1">
    <div class="flex flex-col gap-2 flex-1 hover:bg-gray-50 p-1 rounded">
      <div class="flex items-start justify-between gap-2">
        <div
          class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
        >
          <Button
            class="drag-handle p-0.5"
            variant="ghosted"
            title="Drag to move"
          >
            <DragIcon />
          </Button>
        </div>
        <div class="flex flex-1 gap-3" @click="showUpdateToDoModal = true">
          <div class="mt-[3.5px]">
            <Checkbox
              @click.stop
              v-model="todo.completed"
              class="p-0.5 text-gray-500"
              @change="markAsCompleted"
            />
          </div>
          <div class="title-description">
            <div class="title-link flex items-center gap-2 h-7">
              <div
                class="text-lg leading-normal font-medium select-none"
                :class="{ 'line-through': todo.completed }"
              >
                {{ todo.title }}
              </div>
              <div v-if="todo.link" class="link">
                <a :href="todo.link" @click.stop target="_blank">
                  <FeatherIcon
                    name="external-link"
                    :stroke-width="2"
                    class="h-4 w-4 text-gray-600 hover:text-gray-800 cursor-pointer"
                  />
                </a>
              </div>
            </div>
            <TextEditor
              v-if="todo.description && html2text(todo.description)"
              editor-class="prose-sm text-base text-gray-600"
              :content="todo.description"
              :editable="false"
            />
          </div>
        </div>
        <div
          class="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
        >
          <Button
            class="!p-0.5 !text-gray-500"
            icon="copy"
            variant="ghost"
            @click="duplicate(todo)"
            title="Click to duplicate todo"
          />
          <Button
            class="!p-0.5 !text-gray-500"
            icon="x"
            variant="ghost"
            @click="deleteTodo(todo.name)"
            title="Click to delete todo"
          />
        </div>
      </div>
    </div>
  </div>
  <UpdateToDoModal v-model="showUpdateToDoModal" :todo="todo" />
</template>
<script setup>
import UpdateToDoModal from './UpdateToDoModal.vue'
import { FeatherIcon, Button, TextEditor, Checkbox } from 'frappe-ui'
import { notes } from '../data/notes'
import { todos } from '../data/todos'
import DragIcon from './icons/DragIcon.vue'
import { html2text } from '../utils'
import { ref, inject } from 'vue'

const props = defineProps({
  todo: Object,
})

let dialog = inject('$dialog')

const showUpdateToDoModal = ref(false)

function markAsCompleted() {
  todos.setValue
    .submit({
      name: props.todo.name,
      completed: props.todo.completed ? 1 : 0,
    })
    .then(() => {
      todos.reload()
    })
}

function deleteTodo(name) {
  dialog({
    title: 'Delete todo',
    message: 'Are you sure you want to delete this todo?',
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: ({ close }) => {
          return todos.delete.submit(name).then(() => {
            notes.reload()
            close()
          })
        },
      },
      {
        label: 'Cancel',
      },
    ],
  })
}

function duplicate(todo) {
  todos.insert
    .submit({
      title: todo.title,
      description: todo.description,
      link: todo.link,
      sequence_id: todos.data.length + 1,
    })
    .then(() => {
      todos.reload()
    })
}
</script>
