<template>
  <div class="flex flex-col flex-1 mx-6 sm:mx-20">
    <div v-for="day in notesbyDays" :key="day.title">
      <div
        v-if="
          !store.hideEmptyDays ||
          day.title == 'Sunday' ||
          (store.hideEmptyDays && day.notes.length)
        "
        class="flex-1 text-center text-gray-900 bg-gray-100 rounded-md text-xl py-1"
      >
        {{ day.title }}
      </div>
      <draggable
        :list="day.notes"
        group="note"
        handle=".note-drag-handle"
        easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
        item-key="name"
        :animation="200"
        @end="rearrangeNotes"
        :data-date="day.date"
      >
        <template #item="{ element }">
          <div class="group flex items-center py-2 last:mb-0 cursor-pointer">
            <Note :note="element" />
          </div>
        </template>
      </draggable>
      <AddNote
        v-if="
          !store.hideEmptyDays ||
          day.title == 'Sunday' ||
          (store.hideEmptyDays && day.notes.length)
        "
        class="pl-7 my-2"
        :date="day.date"
      />
    </div>
  </div>
</template>

<script setup>
import AddNote from '../components/AddNote.vue'
import Note from '../components/Note.vue'
import { update_note_sequence, notes } from '../data/notes'
import { useStore } from '../store'
import { session } from '../data/session'
import draggable from 'vuedraggable'
import { inject, computed, watch } from 'vue'

let dayjs = inject('$dayjs')
let store = useStore()

const startDate = computed(() => dayjs(store.today).startOf('week'))
const endDate = computed(() => dayjs(store.today).endOf('week'))

watch(
  () => store.today,
  () => {
    notes.filters = [
      ['date', '>=', startDate.value.format('YYYY-MM-DD')],
      ['date', '<=', endDate.value.format('YYYY-MM-DD')],
      ['owner', '=', session.user],
    ]
    notes.fetch()
  },
  { immediate: true },
)

const notesbyDays = computed(() => {
  let data = notes.data || []
  data.sort((a, b) => {
    if (a.date === b.date) {
      return a.sequence_id - b.sequence_id
    }
    return a.date > b.date ? 1 : -1
  })

  data.forEach((note) => {
    note.day = dayjs(note.date).format('dddd')
  })

  let _days = [
    {
      title: 'Sunday',
      date: startDate.value.format('YYYY-MM-DD'),
      notes: [],
    },
    {
      title: 'Monday',
      date: startDate.value.add(1, 'day').format('YYYY-MM-DD'),
      notes: [],
    },
    {
      title: 'Tuesday',
      date: startDate.value.add(2, 'day').format('YYYY-MM-DD'),
      notes: [],
    },
    {
      title: 'Wednesday',
      date: startDate.value.add(3, 'day').format('YYYY-MM-DD'),
      notes: [],
    },
    {
      title: 'Thursday',
      date: startDate.value.add(4, 'day').format('YYYY-MM-DD'),
      notes: [],
    },
    {
      title: 'Friday',
      date: startDate.value.add(5, 'day').format('YYYY-MM-DD'),
      notes: [],
    },
    {
      title: 'Saturday',
      date: endDate.value.format('YYYY-MM-DD'),
      notes: [],
    },
  ]

  _days.forEach((day) => {
    day.notes = data.filter((note) => note.day === day.title)
  })

  return _days
})

function rearrangeNotes() {
  let notes = []
  notesbyDays.value.forEach((day) => {
    day.notes.forEach((note, index) => {
      note.date = day.date
      note.sequence_id = index + 1
      notes.push(note)
    })

    notes = notes.concat(day.notes)
  })

  update_note_sequence(notes)
}
</script>
