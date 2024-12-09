import { createListResource, createResource, dayjs } from 'frappe-ui'
import { session } from './session'

export let notes = createListResource({
  doctype: 'Recapp Note',
  fields: ['name', 'title', 'date', 'description', 'link', 'sequence_id'],
  filters: [['owner', '=', session.user]],
  cache: 'Recapp Notes',
  orderBy: 'sequence_id asc',
})

export function update_note_sequence(_notes) {
  let docs = _notes.map((note, index) => ({
    doctype: 'Recapp Note',
    docname: note.name,
    date: note.date,
    sequence_id: index + 1,
    old_sequence_id: note.sequence_id,
  }))

  docs = docs.filter((doc) => doc.sequence_id !== doc.old_sequence_id)
  docs.forEach((doc) => delete doc.old_sequence_id)

  createResource({ url: 'frappe.client.bulk_update' }).submit({
    docs: JSON.stringify(docs),
  })
}
