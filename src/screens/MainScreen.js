import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome5'
import auth from '@react-native-firebase/auth'
import {connect} from 'react-redux'

import {setCredentials} from '../redux/actions/auth'
import {getData} from '../redux/actions/profile'

import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'

import ChatListScreen from './ChatListScreen'
import ChatRoomScreen from './ChatRoomScreen'
import NearbyScreen from './NearbyScreen'
import ProfileScreen from './ProfileScreen'

const MainStack = createStackNavigator()
const BottomTab = createBottomTabNavigator()

class MainTab extends Component {
  render() {
    return(
      <BottomTab.Navigator>
        <BottomTab.Screen name='chat' component={ChatListScreen} options={{
          tabBarIcon: ({size, color})=> <Icon name='comment' solid size={size} color={color} />,
          title: 'Chat'
        }} />
        <BottomTab.Screen name='nearby' component={NearbyScreen} options={{
          tabBarIcon: ({size, color})=> <Icon name='map-marked' solid size={size} color={color} />,
          title: 'Nearby'
        }} />
        <BottomTab.Screen name='profile' component={ProfileScreen} options={{
          tabBarIcon: ({size, color})=> <Icon name='user-circle' solid size={size} color={color} />,
          title: 'Profile'
        }} />
      </BottomTab.Navigator>
    )
  }
}

class MainScreen extends Component {
  componentDidMount(){
    auth().onAuthStateChanged(this.action)
  }
  action = (data)=> {
    if(data){
      this.props.setCredentials(data)
      this.props.getData()
    }
  }
  render() {
    const {user} = this.props.auth
    const {focus} = this.props.chat
    return (
      <NavigationContainer>
        <MainStack.Navigator>
          {user === null && (
            <>
              <MainStack.Screen name='login' options={{
                title: 'Auth',
                headerStyle: {backgroundColor: '#03a9f4'},
                headerTitleStyle: {
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }
              }} component={LoginScreen} />
              <MainStack.Screen name='register' options={{
                title: 'Auth',
                headerStyle: {backgroundColor: '#03a9f4'},
                headerTitleStyle: {
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }
              }} component={RegisterScreen} />
            </>
          )}
          {user !== null && (
            <>
              <MainStack.Screen name='main' options={{
                title: 'Chitchat',
                headerStyle: {backgroundColor: '#03a9f4'},
                headerTitleStyle: {
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }
              }} component={MainTab} />
              <MainStack.Screen
                name='room'
                options={{
                  title: focus || 'Chat',
                  headerStyle: {backgroundColor: '#03a9f4'},
                  headerTitleStyle: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }
                }}
                component={ChatRoomScreen}
              />
            </>
          )}
        </MainStack.Navigator>
      </NavigationContainer>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  chat: state.chat
})

const mapDispatchToProps = {setCredentials, getData}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)