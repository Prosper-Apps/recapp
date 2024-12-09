import { createListResource, createResource, dayjs } from 'frappe-ui'
import { session } from './session'
import { useStore } from '../store'

export let notes = createListResource({
  doctype: 'Recapp Note',
  fields: ['name', 'title', 'date', 'description', 'link', 'sequence_id'],
  filters: [['owner', '=', session.user]],
  cache: 'Recapp Notes',
  orderBy: 'sequence_id asc',
})

export async function update_note_sequence(_notes, e) {
  if (e.removed?.element) {
    let note = e.removed.element
    await notes.delete.submit(note.name)
    return
  } else if (e.added?.element) {
    const store = useStore()
    let todo = e.added.element
    let note = _notes.find((note) => note.name === todo.name)
    let note_index = _notes.indexOf(note)
    let _note = await notes.insert.submit({
      title: note.title,
      description: note.description,
      link: note.link,
      date: store.date,
      sequence_id: note_index + 1,
    })
    note.name = _note.name
  }
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
