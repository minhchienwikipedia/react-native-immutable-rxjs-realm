import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { List } from 'immutable'
import realm, { deleteAll, queryAll, deleteItem } from './store'
import Item from '../Home/Item'

export default class Bookmark extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listBookMarks: List()
    }
    this.loadData()
    realm.addListener('change', () => {
      this.loadData()
    })
  }

  componentWillUnmount = () => {
    realm.removeListener('change')
  }

  loadData = () => {
    queryAll().then(val => {
      this.setState({ listBookMarks: List(val) })
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

  onDelete = item => {
    deleteItem(item.id)
      .then(() => {
        console.log('removed')
      })
      .catch(err => {
        console.log('remove err', err)
      })
  }

  renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        hideAdd={true}
        onDelete={this.onDelete.bind(this, item)}
      />
    )
  }

  render() {
    const { listBookMarks } = this.state
    return (
      <View style={styles.container}>
        {listBookMarks ? (
          <FlatList
            data={listBookMarks.toJS()}
            keyExtractor={(item, index) => `${item} ${index}`}
            renderItem={this.renderItem}
            ListFooterComponent={() => {
              if (!listBookMarks.size) {
                return null
              }
              return (
                <TouchableOpacity
                  style={{ alignItems: 'center' }}
                  onPress={this.onDeleteAll}
                >
                  <Text
                    style={{
                      marginTop: 10,
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
  }
})
