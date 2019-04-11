import Realm from 'realm'

export const TODOLIST_SCHEMA = 'TodoList'

export const TodoListSchema = {
  name: TODOLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    creationDate: 'date'
  }
}

const databaseOptions = {
  path: 'todoListApp.realm',
  schema: [TodoListSchema],
  schemaVersion: 0
}

export const insertNewTodoList = newTodoList =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(TODOLIST_SCHEMA, newTodoList)
          resolve(newTodoList)
        })
      })
      .catch(err => reject(err))
  })

export const updateTodo = todoItem =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let dataItem = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoItem.id)
          dataItem.name = todoItem.name
          resolve()
        })
      })
      .catch(err => reject(err))
  })

export const deleteTodo = todoId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let dataItem = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoId)
          realm.delete(dataItem)
          resolve()
        })
      })
      .catch(err => reject(err))
  })

export const queryAllTodoList = () => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      let allTodoList = realm.objects(TODOLIST_SCHEMA)
      resolve(allTodoList)
    })
  }).catch(err => reject(err))
}

export const deleteAll = () => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        let allData = realm.objects(TODOLIST_SCHEMA)
        realm.delete(allData)
        resolve()
      })
    })
  }).catch(err => reject(err))
}
export default new Realm(databaseOptions)
