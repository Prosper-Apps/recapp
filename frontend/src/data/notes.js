import { createListResource, createResource, dayjs } from 'frappe-ui'
import { session } from './session'

export let notes = createListResource({
  doctype: 'Recapp Note',
  fields: ['name', 'title', 'date', 'description', 'link', 'sequence_id'],
  filters: [['owner', '=', session.user]],
  cache: 'Recapp Notes',
  orderBy: 'sequence_id asc',
  transform: (data) => {
    if (notes.filters.length === 3) {
      data.sort((a, b) => {
        if (a.date === b.date) {
          return a.sequence_id - b.sequence_id
        }
        return a.date > b.date ? 1 : -1
      })

      let last_date = ''
      let updated_notes = []
      data.forEach((note, index) => {
        let dayname = dayjs(note.date).format('dddd, DD ')
        if (note.date !== last_date) {
          updated_notes.push({ title: dayname, type: 'Weekly' })
        }
        last_date = note.date
        updated_notes.push(note)
      })

      return updated_notes
    }
    return data
  },
})

export function update_note_sequence(_notes) {
  let docs = _notes.map((note, index) => ({
    doctype: 'Recapp Note',
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
