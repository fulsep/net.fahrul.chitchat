import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native'
import {connect} from 'react-redux'
import {getData} from '../redux/actions/profile'
import Contacts from 'react-native-contacts'
import Icon from 'react-native-vector-icons/FontAwesome5'
import database from '@react-native-firebase/database'

import Loading from '../components/Loading'

class ChatListScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      isLoading: false
    }
  }
  getContact = (messageList) => {
    messageList = Object.keys(messageList).map(o => ({phone: o, name: ''}))
    return new Promise((resolve, reject)=>{
      Contacts.getAll((err, contacts)=> {
        if(err){
          throw(err)
        }
        if(!!contacts.length){
          contacts.forEach((contact, index) => {
            contact.phoneNumbers.forEach((data) => {
              let num = data.number.match(/\d+/g).join('')
              if(num.startsWith(0)){
                num = num.replace(0,'62')
              }
              num = num.replace('62', '0')
              messageList.forEach((o,i)=>{
                if(o.phone === num){
                  messageList[i].name = contacts[index].displayName
                }
              })
            })
            if(index === contacts.length-1){
              resolve(messageList)
            }
          })
        }else{
          resolve(messageList)
        }
      })
    })
  }
  setList = async()=>{
    this.setState({isLoading: true})
    const {user} = this.props.auth
    const dataRef = database().ref('messages/'.concat(user.displayName))
    let messages = []
    try{
      const results = await (await dataRef.once('value')).val()
      if(results!==null){
        const message = await this.getContact(results)
        if(message){
          messages = message
        }
      }
      this.setState({messages, isLoading: false})
    }catch(e){
      this.setState({isLoading: false})
    }
  }
  async componentDidMount(){
    await this.setList()
  }
  render() {
    const {messages, isLoading} = this.state
    return (
      <View style={[styles.parent]}>
        {!isLoading&&!messages.length && (
          <>
            <FlatList
              contentContainerStyle={{flexGrow:1, alignItems: 'center'}}
              refreshControl={
                <RefreshControl
                  colors={['#03a9f4','#03a9f4']}
                  onRefresh={this.setList}
                  refreshing={this.state.isLoading}
                />
              }
              data={[1]}
              keyExtractor={item=>item.toString()}
              renderItem={()=>{
                return(
                  <View style={[styles.parent, styles.center, {alignItems: 'flex-start', padding: 20}]}>
                    <Text style={styles.emptyMessageText}>There is no conversation.</Text>
                    <Text style={styles.emptyMessageText}>Tap the <Icon name='pen-square' size={18} /> Icon to start conversation</Text>
                  </View>
                )
              }}
            />
          </>
        )}
        {!isLoading&&!!messages.length && (
          <>
            <FlatList
              data={this.state.messages}
              contentContainerStyle={{flexGrow:1}}
              refreshControl={
                <RefreshControl
                  colors={['#03a9f4','#03a9f4']}
                  onRefresh={this.setList}
                  refreshing={this.state.isLoading}
                />
              }
              keyExtractor={item => item.phone}
              renderItem={({item, index})=>{
                return(
                  <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('room', {phone: item.phone, name: item.name})}>
                    <View style={[styles.listChat, index!==messages.length-1 && styles.listBorder]}>
                      <View style={styles.listPicture}>
                        <Icon name='user-circle' solid size={50} />
                      </View>
                      <Text style={styles.listIdentifier}>{(item.name!=='' && item.name) || item.phone}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              }}
            />
          </>
        )}
        {isLoading&&(
          <View style={[styles.parent, styles.center]}>
            <Loading size={40} color='#03a9f4' />
          </View>
        )}
        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('room')}>
          <View style={styles.newMessage}>
            <Icon name='pen-square' size={30} color='#03a9f4' />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#DDD',
    flex: 1,
    position: 'relative'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyMessageText: {
    fontSize: 20
  },
  newMessage:{
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listChat: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  listPicture: {
    marginRight: 10
  },
  listIdentifier: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  listBorder: {
    borderBottomWidth: 1,
    borderColor: '#AAA'
  }
})

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
})

const mapDispatchToProps = {getData}

export default connect(mapStateToProps, mapDispatchToProps)(ChatListScreen)