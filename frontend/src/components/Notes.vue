<template>
  <div class="flex flex-col flex-1">
    <div class="head flex justify-center items-center border-b p-3 mb-3">
      <Button variant="ghosted" @click="store.change_to_previous_date">
        <FeatherIcon
          name="chevron-left"
          :stroke-width="2"
          class="h-5 w-5 text-gray-600 cursor-pointer"
        />
      </Button>
      <div class="flex-1 text-center text-gray-700 text-xl">
        {{ store.date_text }}
      </div>
      <Button variant="ghosted" @click="store.change_to_next_date">
        <FeatherIcon
          name="chevron-right"
          :stroke-width="2"
          class="h-5 w-5 text-gray-600 cursor-pointer"
        />
      </Button>
    </div>
    <div class="notes flex justify-center overflow-y-auto h-[calc(100vh-5rem)]">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { Button, FeatherIcon } from 'frappe-ui'
import { useStore } from '../store'

let store = useStore()
</script>
