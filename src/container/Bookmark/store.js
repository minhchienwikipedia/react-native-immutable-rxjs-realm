import Realm from 'realm'

export const BOOKMARKS_SCHEMA = 'BookMarks'

export const BookMarksSchema = {
  name: BOOKMARKS_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    login: 'string',
    avatar_url: 'string'
  }
}

export const databaseOptions = {
  path: 'bookMarksApp.realm',
  schema: [BookMarksSchema]
}

export const addItem = item =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(BOOKMARKS_SCHEMA, item)
          resolve(item)
        })
      })
      .catch(err => reject(err))
  })

export const updateItem = item =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let dataItem = realm.objectForPrimaryKey(BOOKMARKS_SCHEMA, item.id)
          dataItem.name = item.name
          resolve()
        })
      })
      .catch(err => reject(err))
  })

export const deleteItem = Id =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let dataItem = realm.objectForPrimaryKey(BOOKMARKS_SCHEMA, Id)
          realm.delete(dataItem)
          resolve()
        })
      })
      .catch(err => reject(err))
  })

export const queryAll = () => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      let allItem = realm.objects(BOOKMARKS_SCHEMA)
      resolve(allItem)
    })
  }).catch(err => reject(err))
}

export const queryItem = Id => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      let dataItem = realm.objectForPrimaryKey(BOOKMARKS_SCHEMA, Id)
      resolve(dataItem)
    })
  }).catch(err => reject(err))
}

export const deleteAll = () => {
  return new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm.write(() => {
        let allData = realm.objects(BOOKMARKS_SCHEMA)
        realm.delete(allData)
        resolve()
      })
    })
  }).catch(err => reject(err))
}
export default new Realm(databaseOptions)
