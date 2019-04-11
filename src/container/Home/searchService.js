import { Subject, interval, from } from 'rxjs'
import { debounce } from 'rxjs/operators'

export default class SearchService {
  constructor() {
    this.searchTerm = new Subject()
  }

  search(val) {
    this.searchTerm.next(val)
  }

  doSearch(val) {
    return fetch(`https://api.github.com/search/users?q=${val}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token '
      }
    })
      .then(response => response.json())
      .catch(err => console.log('search err', err))
  }

  getResults(callback) {
    this.searchTerm.pipe(debounce(() => interval(1000))).subscribe(val => {
      const fetchData = from(this.doSearch(val))
      fetchData.subscribe(data => {
        callback(data)
      })
    })
  }
}
