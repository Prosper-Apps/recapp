import { createListResource, createResource } from 'frappe-ui'
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
  filters: [['owner', '=', session.user]],
  cache: 'Recapp ToDos',
  orderBy: 'sequence_id asc',
})

export async function update_todo_sequence(_todos, e) {
  if (e.removed?.element) {
    let todo = e.removed.element
    await todos.delete.submit(todo.name)
    return
  } else if (e.added?.element) {
    let todo = e.added.element
    let _todo = await todos.insert.submit({
      title: todo.title,
      description: todo.description,
      link: todo.link,
      sequence_id: _todos.length + 1,
    })
    todo.name = _todo.name
  }
  let docs = _todos.map((todo, index) => ({
    doctype: 'Recapp ToDo',
    docname: todo.name,
    sequence_id: index + 1,
    old_sequence_id: todo.sequence_id,
  }))

  docs = docs.filter((doc) => doc.sequence_id !== doc.old_sequence_id)
  docs.forEach((doc) => delete doc.old_sequence_id)

  await createResource({ url: 'frappe.client.bulk_update' }).submit({
    docs: JSON.stringify(docs),
  })

  todos.reload()
}
