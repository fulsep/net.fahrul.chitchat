import React, { Component } from 'react'
import {Provider} from 'react-redux'
import store from './src/redux/store'

import MainScreen from './src/screens/MainScreen'

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainScreen />
      </Provider>
    )
  }
}
