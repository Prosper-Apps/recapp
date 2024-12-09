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
