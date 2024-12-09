import { createListResource, createResource, dayjs } from 'frappe-ui'
import { session } from './session'

export let todos = createListResource({
  doctype: 'Recapp ToDo',
  fields: [
    'name',
    'title',
    'link',
    'date',
    'description',
    'sequence_id',
    'completed',
  ],
  filters: [
    ['owner', '=', session.user],
    ['note', 'is', 'not set'],
  ],
  cache: 'Recapp ToDos',
  orderBy: 'sequence_id asc',
  transform: (data) => {
    if (todos.filters.length === 3) {
      data.sort((a, b) => {
        if (a.date === b.date) {
          return a.sequence_id - b.sequence_id
        }
        return a.date > b.date ? 1 : -1
      })

      let last_date = ''
      let updated_todos = []
      data.forEach((note, index) => {
        let dayname = dayjs(note.date).format('dddd, DD ')
        if (note.date !== last_date) {
          updated_todos.push({ title: dayname, type: 'Weekly' })
        }
        last_date = note.date
        updated_todos.push(note)
      })

      return updated_todos
    }
    return data
  },
})

export function update_todo_sequence(_todos) {
  let docs = _todos.map((note, index) => ({
    doctype: 'Recapp ToDo',
    docname: note.name,
    sequence_id: index + 1,
    old_sequence_id: note.sequence_id,
  }))

  docs = docs.filter((doc) => doc.sequence_id !== doc.old_sequence_id)
  docs.forEach((doc) => delete doc.old_sequence_id)

  createResource({ url: 'frappe.client.bulk_update' }).submit({
    docs: JSON.stringify(docs),
  })
}
