<template>
  <div
    class="sidebar flex justify-between gap-2 bg-gray-50 border-r p-2 relative"
    :style="{ width: `${sidebar_width}px` }"
  >
    <div class="flex flex-col justify-between">
      <div class="flex w-full flex-col gap-4">
        <Dropdown :options="dropdownItems">
          <template v-slot="{ open }">
            <button
              class="flex gap-2 p-2 items-center rounded-md duration-300 ease-in-out"
              :class="open ? 'bg-white shadow-sm' : 'hover:bg-gray-200'"
              :style="{ width: `${sidebar_width - 18}px` }"
            >
              <Logo class="w-8 h-8 p-1 rounded flex-shrink-0 bg-white" />
              <div
                class="flex flex-1 flex-col text-left duration-300 ease-in-out"
              >
                <div class="text-base font-medium text-gray-900 leading-none">
                  Recapp
                </div>
                <div class="mt-1 text-sm text-gray-700 leading-none">
                  {{ store.user?.full_name }}
                </div>
              </div>
              <div class="">
                <FeatherIcon
                  name="chevron-down"
                  class="h-4 w-4"
                  aria-hidden="true"
                />
              </div>
            </button>
          </template>
        </Dropdown>
        <div class="sidebar-menu flex flex-col gap-2 px-2">
          <router-link
            v-for="view in views"
            class="flex items-center gap-2 px-2 py-1 rounded"
            :class="
              view.label == store.current_view
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-100'
            "
            :to="
              '/' +
              view.label.toLowerCase() +
              (route.params.date ? '/' + route.params.date : '')
            "
          >
            <span class="grid h-5 w-6 place-items-center flex-shrink-0">
              <component :is="view.icon" class="h-4.5 w-4.5 text-gray-700" />
            </span>
            <span class="flex-shrink-0 text-base duration-300 ease-in-out">
              {{ view.label }}
            </span>
          </router-link>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between gap-2">
          <DatePicker
            v-model="store.date_changed"
            placeholder="Select Date"
            :formatValue="(val) => val.split('-').reverse().join('-')"
          />
          <Button class="text-sm" @click="store.date_changed = ''">
            Today
          </Button>
        </div>
        <Switch v-model="store.hideEmptyDays" label="Hide empty days" />
        <Switch v-model="store.hideToDo" label="Hide todo list" />
      </div>
    </div>
    <div
      :class="['sidebar-resizer', sidebar_resizing ? 'resizing' : '']"
      class="bg-gray-300"
      @mousedown="start_resize"
    />
  </div>
</template>

<script setup>
import Logo from '../icons/Logo.vue'
import DailyIcon from '../icons/DailyIcon.vue'
import WeeklyIcon from '../icons/WeeklyIcon.vue'
import { session } from '../data/session.js'
import { useStore } from '../store.js'
import { DatePicker, Dropdown, FeatherIcon, Switch } from 'frappe-ui'
import { useStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

let route = useRoute()
let store = useStore()

let dropdownItems = [
  {
    label: 'Log out',
    icon: 'log-out',
    onClick: () => session.logout.submit(),
  },
]

const sidebar_width = useStorage('sidebarWidth', 256)
const sidebar_resizing = ref(false)

function start_resize() {
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('select-none')
    document.body.classList.remove('cursor-col-resize')
    sidebar_resizing.value = false
    document.removeEventListener('mousemove', resize)
  })
}

function resize(e) {
  sidebar_resizing.value = true
  document.body.classList.add('select-none')
  document.body.classList.add('cursor-col-resize')
  sidebar_width.value = e.clientX

  // snap to 256
  let range = [256 - 10, 256 + 10]
  if (sidebar_width.value > range[0] && sidebar_width.value < range[1]) {
    sidebar_width.value = 256
  }

  if (sidebar_width.value < 12 * 16) {
    sidebar_width.value = 12 * 16
  }
  if (sidebar_width.value > 24 * 16) {
    sidebar_width.value = 24 * 16
  }
}

let views = [
  {
    label: 'Daily',
    icon: DailyIcon,
  },
  {
    label: 'Weekly',
    icon: WeeklyIcon,
  },
]
</script>

<style scoped>
.sidebar-resizer {
  position: absolute;
  top: 0;
  right: -4px;
  width: 5px;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
  cursor: col-resize;
}

.sidebar-resizer.resizing,
.sidebar-resizer:hover {
  opacity: 1;
}
</style>
