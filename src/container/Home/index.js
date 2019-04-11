import React, { Component } from 'react'
import {
  VirtualizedList,
  StyleSheet,
  TextInput,
  View,
  FlatList
} from 'react-native'
import { List, fromJS } from 'immutable'
import Item from './Item'
import realm, {
  addItem,
  queryAll,
  BOOKMARKS_SCHEMA,
  databaseOptions
} from '../Bookmark/store'
import SearchService from './searchService'
import Realm from 'realm'
import { from } from 'rxjs'

type Props = {}
export default class Home extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      data: fromJS({
        list: []
      })
    }
    this.searchService = new SearchService()
    this.bookMarkData = []
    this.defaultData = []
    realm.addListener('change', () => {
      this.getData()
    })
  }

  componentDidMount = () => {
    this.getData()
  }

  loadData = () => {
    this.searchService.getResults(async data => {
      this.defaultData = data.items
      this.fetchDataSuccess(data.items)
    })
  }

  // filterData = async array => {
  //   if (!array) {
  //     return []
  //   }
  //   let bookMarkData = await queryAll()
  //   bookMarkData = Array.from(bookMarkData)
  //   let dataFilter = []
  //   dataFilter = array.filter(
  //     o =>
  //       bookMarkData.filter(o2 => {
  //         return o2.id === o.id
  //       }).length === 0
  //   )
  //   const arr = []
  //   bookMarkData.forEach(currentItem => {
  //     arr.push({ ...currentItem, hideAdd: true })
  //   })
  //   bookMarkData = arr
  //   return {
  //     dataFilter,
  //     bookMarkData
  //   }
  // }

  // fetchBookMarkDataSuccess = val => {
  //   this.bookMarkData = val
  // }

  // fetchBookMarkDataError = () => {}
  // fetchBookMarkDataComplete = () => {}

  getData = async () => {
    // this.fetchBookMarkData = from(queryAll())
    // this.fetchBookMarkData.subscribe(
    //   this.fetchBookMarkDataSuccess,
    //   this.fetchBookMarkDataError,
    //   this.fetchBookMarkDataComplete
    // )
    this.searchService.getResults(async data => {
      this.defaultData = data.items
      this.fetchDataSuccess(data.items)
    })
  }

  fetchDataSuccess = async data => {
    let res = fromJS([])
    if (data) {
      res = fromJS(data)
    }
    this.setState({
      data: this.state.data.updateIn(['list'], () => res)
    })
  }

  onChangeText = val => {
    this.searchService.search(val)
  }

  _getCategorySectionDataItem = (data, index) => data.getIn(['list', index])

  _getCategorySectionItemCount = data => (!!data ? data.get('list').size : 0)

  renderItem = ({ item }) => {
    return <Item ref={`${item.id}`} hideAdd={true} item={item.toJS()} />
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={'inputRef'}
          onChangeText={this.onChangeText}
          style={styles.input}
          placeholder='Type username to search'
        />
        <VirtualizedList
          keyboardShouldPersistTaps='always'
          data={this.state.data}
          keyExtractor={(item, index) => `${item} ${index}`}
          renderItem={this.renderItem}
          getItem={this._getCategorySectionDataItem}
          getItemCount={this._getCategorySectionItemCount}
        />
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
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10
  }
})
