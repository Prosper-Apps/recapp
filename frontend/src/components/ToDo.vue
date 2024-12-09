<template>
  <div class="flex flex-col gap-4 flex-1">
    <div
      class="flex flex-col gap-2 flex-1 hover:bg-gray-50 p-1 rounded"
      @dblclick.stop="showUpdateToDoModal = true"
    >
      <div class="flex items-start justify-between gap-2">
        <div
          class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
        >
          <Button
            class="p-0.5 text-gray-500"
            icon="plus"
            variant="ghosted"
            @click="showAddTodoInput = true"
            title="Click to add new todo"
          />
          <Button
            class="todo-drag-handle p-0.5"
            variant="ghosted"
            title="Drag to move"
          >
            <DragIcon />
          </Button>
        </div>
        <div class="flex flex-1 gap-2 max-w-xl" @click="">
          <div class="mt-[3px]">
            <Checkbox v-model="todo.completed" class="p-0.5 text-gray-500" />
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
              <Button
                v-if="todo.completed"
                label="Move"
                @click="() => moveToNote(todo)"
              />
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
          class="flex items-center transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
        >
          <Button
            class="p-0.5 text-gray-500"
            icon="x"
            variant="ghost"
            @click="deleteTodo(todo.name)"
            title="Click to delete todo"
          />
        </div>
      </div>
    </div>
    <AddToDo v-if="showAddTodoInput" v-model="showAddTodoInput" />
  </div>
  <UpdateToDoModal v-model="showUpdateToDoModal" :todo="todo" />
</template>
<script setup>
import AddToDo from './AddToDo.vue'
import UpdateToDoModal from './UpdateToDoModal.vue'
import { FeatherIcon, Button, TextEditor, Checkbox, call } from 'frappe-ui'
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
const showAddTodoInput = ref(false)

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

async function moveToNote(todo) {
  let note = await call('frappe.client.insert', {
    doc: {
      doctype: 'Recapp Note',
      title: todo.title,
      date: new Date().toISOString().split('T')[0],
    },
  })
  notes.reload()

  if (note.name) {
    await call('frappe.client.set_value', {
      doctype: 'Recapp ToDo',
      name: todo.name,
      fieldname: 'note',
      value: note.name,
    })
    todos.reload()
  }
}
</script>
