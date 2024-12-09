<template>
  <div class="flex flex-col border border-l w-112 h-full">
    <div
      class="text-center text-gray-700 text-xl h-13 flex justify-center items-center border-b p-3 shrink-0"
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
        <template #item="{ element, index }">
          <div class="group flex items-center py-2 last:mb-0 cursor-pointer">
            <ToDo :todo="element" />
          </div>
        </template>
      </draggable>
    </div>
    <div
      v-else-if="!showAddTodoInput"
      class="flex h-full flex-col gap-3 justify-center items-center"
    >
      <div class="text-gray-500 text-xl">No todos found</div>
      <Button label="Add ToDo" variant="solid" @click="showAddTodoInput = true">
        <template #prefix>
          <FeatherIcon name="plus" class="h-4 w-4" />
        </template>
      </Button>
    </div>
    <AddToDo class="mx-6 my-2" v-else v-model="showAddTodoInput" />
  </div>
</template>
<script setup>
import AddToDo from './AddToDo.vue'
import draggable from 'vuedraggable'
import ToDo from './ToDo.vue'
import { Button, FeatherIcon } from 'frappe-ui'
import { update_todo_sequence, todos } from '../data/todos'
import { ref, onMounted } from 'vue'

const showAddTodoInput = ref(false)

onMounted(() => todos.fetch())
</script>
