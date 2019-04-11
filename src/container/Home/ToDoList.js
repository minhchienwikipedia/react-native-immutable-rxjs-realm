import React, { Component } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native'
import realm, {
  insertNewTodoList,
  queryAllTodoList,
  deleteTodo,
  updateTodo,
  deleteAll
} from './allSchemas'
import Item from './Item'

type Props = {}
export default class ToDoList extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      realm: [],
      shouldUpdate: false
    }
    this.name = null
    this.itemSelected = null
    this.loadData()
    realm.addListener('change', () => {
      this.loadData()
    })
  }

  loadData = () => {
    queryAllTodoList().then(val => {
      this.setState({ realm: val })
    })
  }

  addTodo = () => {
    if (!this.name) {
      return
    }
    const data = {
      id: new Date().getTime(),
      name: this.name,
      creationDate: new Date()
    }
    insertNewTodoList(data)
      .then(() => {
        this.clearInput()
      })
      .catch(err => {
        console.log('add err', err)
      })
  }

  clearInput = () => {
    this.name = null
    this.refs.inputRef.clear()
  }

  onEdit = item => {
    this.itemSelected = item
    this.setState({ shouldUpdate: true })
    this.refs.inputRef.setNativeProps({
      text: item.name
    })
  }

  onUpdate = () => {
    if (!this.itemSelected) {
      return
    }
    updateTodo({
      ...this.itemSelected,
      name: this.name
    })
      .then(() => {
        console.log('updated')
      })
      .catch(err => {
        console.log('update err', err)
      })

    this.itemSelected = null
    this.setState({ shouldUpdate: false })
    this.clearInput()
  }

  onDelete = item => {
    deleteTodo(item.id)
      .then(() => {
        console.log('removed')
      })
      .catch(err => {
        console.log('remove err', err)
      })
  }

  onDeleteAll = () => {
    deleteAll()
      .then(() => {
        console.log('done')
      })
      .catch(err => {
        console.log('delete all err', err)
      })
  }

  renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onEdit={this.onEdit.bind(this, item)}
        onDelete={this.onDelete.bind(this, item)}
      />
    )
  }

  render() {
    const { realm, shouldUpdate } = this.state
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TextInput
            ref={'inputRef'}
            onChangeText={val => (this.name = val)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              width: 280,
              height: 40,
              borderRadius: 5,
              paddingHorizontal: 10
            }}
          />
          <TouchableOpacity
            style={{ padding: 15 }}
            onPress={() => {
              shouldUpdate ? this.onUpdate() : this.addTodo()
            }}
          >
            <Text
              style={{
                color: shouldUpdate ? 'blue' : 'green',
                fontWeight: '500'
              }}
            >
              {shouldUpdate ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
        {realm ? (
          <FlatList
            data={this.state.realm}
            keyExtractor={(item, index) => `${item} ${index}`}
            renderItem={this.renderItem}
            ListFooterComponent={() => {
              return (
                <TouchableOpacity
                  style={{ alignItems: 'center' }}
                  onPress={this.onDeleteAll}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'red'
                    }}
                  >
                    Delete All
                  </Text>
                </TouchableOpacity>
              )
            }}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 10,
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
