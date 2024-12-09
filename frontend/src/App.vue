<template>
  <div class="flex w-full h-screen">
    <AppSidebar />
    <div class="main flex flex-1">
      <Notes />
      <ToDos v-show="!store.hideToDo" />
    </div>
  </div>
  <Dialogs />
  <NewNoteDialog v-model:show="store.show_new_dialog" />
  <UpdateNoteDialog v-model:show="store.show_edit_dialog" />
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue'
import Notes from './components/Notes.vue'
import ToDos from './components/ToDos.vue'
import { Dialogs } from '@/utils/dialogs'
import { users } from './data/users.js'
import { notes } from './data/notes.js'
import NewNoteDialog from './components/NewNoteDialog.vue'
import UpdateNoteDialog from './components/UpdateNoteDialog.vue'
import { useStore } from './store.js'

let store = useStore()

users.fetch()
notes.list.fetch()
</script>
