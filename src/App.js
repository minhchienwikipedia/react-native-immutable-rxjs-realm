import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './container/Home'
import BookMarkScreen from './container/Bookmark'

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    BookMark: BookMarkScreen
  },
  {
    tabBarOptions: {
      activeTintColor: 'green'
    }
  }
)

export default createAppContainer(TabNavigator)
