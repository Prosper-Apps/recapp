<template>
  <div class="flex items-start gap-2 w-full hover:bg-gray-50 p-1 rounded">
    <div
      class="flex opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
    >
      <Button
        class="note-drag-handle p-0.5"
        variant="ghosted"
        title="Drag to move"
      >
        <DragIcon />
      </Button>
    </div>
    <div
      class="flex flex-1 items-start gap-3 max-w-xl"
      @click="store.open_edit_dialog(note)"
      title="Click to update note"
    >
      <div class="icon mt-[1.5px] p-1.5 bg-gray-200 rounded">
        <FeatherIcon
          name="type"
          :stroke-width="2"
          class="h-3 w-3 text-gray-700 cursor-pointer"
        />
      </div>
      <div class="title-description">
        <div class="title-link flex items-center gap-2 h-7">
          <div class="text-lg leading-normal font-medium">
            {{ note.title }}
          </div>
          <div v-if="note.link" class="link">
            <a :href="note.link" @click.stop target="_blank">
              <FeatherIcon
                name="external-link"
                :stroke-width="2"
                class="h-4 w-4 text-gray-600 hover:text-gray-800 cursor-pointer"
              />
            </a>
          </div>
        </div>
        <TextEditor
          v-if="note.description && html2text(note.description)"
          class="min-h-[1.5rem]"
          editor-class="prose-sm text-base text-gray-600"
          :content="note.description"
          :editable="false"
        />
      </div>
    </div>
    <div
      class="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
    >
      <Button
        class="p-0.5 text-gray-500"
        icon="x"
        variant="ghosted"
        @click="delete_note(note.name)"
        title="Click to delete note"
      />
    </div>
  </div>
</template>

<script setup>
import { FeatherIcon, TextEditor } from 'frappe-ui'
import DragIcon from './icons/DragIcon.vue'
import { notes } from '../data/notes'
import { html2text } from '../utils'
import { inject } from 'vue'
import { useStore } from '../store'

let store = useStore()

let props = defineProps({
  note: {
    type: Object,
    required: true,
  },
})

let dialog = inject('$dialog')

function delete_note(name) {
  dialog({
    title: 'Delete note',
    message: 'Are you sure you want to delete this note?',
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: ({ close }) => {
          return notes.delete.submit(name).then(() => {
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
</script>
