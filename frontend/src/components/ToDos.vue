<template>
  <div class="flex flex-col border border-l w-112 h-full">
    <div
      class="text-center text-gray-700 text-xl h-13 flex justify-center items-center border-b p-3 mb-3 shrink-0"
    >
      ToDo List
    </div>
    <div v-if="todos.data?.length" class="flex items-center">
      <draggable
        v-model="todos.data"
        class="w-full mx-6"
        handle=".todo-drag-handle"
        :animation="200"
        easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
        item-key="name"
        @end="update_todo_sequence(todos.data)"
      >
        <template #item="{ element }">
          <div class="group flex items-center py-2 last:mb-0 cursor-pointer">
            <ToDo :todo="element" />
          </div>
        </template>
      </draggable>
    </div>
    <AddToDo class="mx-6 my-2" />
  </div>
</template>
<script setup>
import AddToDo from './AddToDo.vue'
import draggable from 'vuedraggable'
import ToDo from './ToDo.vue'
import { update_todo_sequence, todos } from '../data/todos'
import { onMounted } from 'vue'

onMounted(() => todos.fetch())
</script>
