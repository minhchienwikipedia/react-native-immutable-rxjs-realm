import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import realm, { addItem, BOOKMARKS_SCHEMA, queryItem } from '../Bookmark/store'
import { from } from 'rxjs'

export default class Item extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  // queryItemSuccess = val => {
  //   if (!val) {
  //     addItem(this.props.item)
  //       .then(() => {
  //         alert('Thông báo', 'Book mark thành công')
  //       })
  //       .catch(err => console.log('err', err))
  //   }
  // }

  // queryItemError = err => {
  //   alert('Thông báo', 'User đã được thêm')
  // }

  // queryItemComplete = () => {}

  onAdd = () => {
    addItem(this.props.item)
      .then(() => {
        alert('Book mark thành công')
      })
      .catch(err => alert('User đã tồn tại trong Bookmark'))
  }

  render() {
    const { onEdit, onDelete, item, hideAdd } = this.props
    return (
      <TouchableOpacity onPress={this.onAdd} style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row'
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              padding: 10
            }}
            source={{ uri: item.avatar_url }}
          />
          <Text
            style={{
              fontWeight: '500',
              fontSize: 16
            }}
          >
            {item.login}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          {!hideAdd && (
            <TouchableOpacity onPress={this.onAdd}>
              <Text style={styles.add}>Add</Text>
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5
  },
  add: {
    marginRight: 20,
    color: 'green',
    fontWeight: '500'
  },
  delete: {
    color: 'red',
    fontWeight: '500'
  },
  edit: {
    marginRight: 20,
    color: 'blue',
    fontWeight: '500'
  }
})
