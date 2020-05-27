import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TextInput, TouchableWithoutFeedback } from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {switchRoom, sendMessage, getMessages} from '../redux/actions/chat'

class ChatRoomScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      message: [
        {
          body: 'Hello',
          createdAt: 123,
          deletedAt: '',
          readAt: '',
          sender: '081939500800'
        },
        {
          body: 'Hello',
          createdAt: 1234,
          deletedAt: '',
          readAt: '',
          sender: '081939500801'
        },
        {
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          createdAt: 12345,
          deletedAt: '',
          readAt: '',
          sender: '081939500801'
        },
        {
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          createdAt: 123456,
          deletedAt: '',
          readAt: '',
          sender: '081939500800'
        },
        {
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          createdAt: 123457,
          deletedAt: '',
          readAt: '',
          sender: '081939500801'
        },
        {
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          createdAt: 1234560,
          deletedAt: '',
          readAt: '',
          sender: '081939500800'
        },
        {
          body: 'Ok',
          createdAt: 12340,
          deletedAt: '',
          readAt: '',
          sender: '081939500800'
        },
        {
          body: 'Siap',
          createdAt: 12341,
          deletedAt: '',
          readAt: '',
          sender: '081939500801'
        },
        {
          body: 'Ok',
          createdAt: 12342,
          deletedAt: '',
          readAt: '',
          sender: '081939500800'
        },
        {
          body: 'Siap',
          createdAt: 12343,
          deletedAt: '',
          readAt: '',
          sender: '081939500801'
        }
      ],
      inputBody: ''
    }
    this.chat = React.createRef()
  }
  componentDidMount(){
    const {phone, name} = this.props.route.params
    this.props.switchRoom((name!=='' && name) || phone)
    this.props.getMessages(phone,()=>{
      setTimeout(()=>{
        this.chat.current?.scrollToEnd()
      },100)
    })
  }
  sendMessage = ()=>{
    const {phone: receiver, name} = this.props.route.params
    const {phone: sender} = this.props.profile.data
    const {inputBody: text} = this.state
    if(this.state.inputBody!==''){
      this.setState({inputBody:''},()=>{
        this.props.sendMessage(receiver, text, null,()=>{
          setTimeout(()=>{
            this.chat.current?.scrollToEnd()
          },100)
        })
      })
    }
  }
  render() {
    // const {phone: receiver} = this.props.route.params
    const {phone: sender} = this.props.profile.data
    const {data} = this.props.chat
    return (
      <View style={styles.parent}>
        <FlatList
          ref={this.chat}
          // initialScrollIndex={data.length&&data.length-1}
          data = {data}
          contentContainerStyle={{padding: 10}}
          keyExtractor= {item=>item.createdAt.toString()}
          renderItem= {({item})=>{
            const date = new Date(item.createdAt)
            const hour = date.getHours().toString().length === 1 ? `0${date.getHours()}`:date.getHours()
            const minutes = date.getMinutes().toString().length === 1 ? `0${date.getMinutes()}`:date.getMinutes()
            return (
              <View style={[styles.message,item.sender===sender ? styles.messageSended : styles.messageReceived]}>
                <View style={[styles.baloon, item.sender===sender && styles.baloonSender]}>
                  <View style={styles.baloonTextContainer}>
                    <Text>{item.body}</Text>
                  </View>
                  <Text style={styles.timestamp}>{`${hour}.${minutes}`}</Text>
                </View>
              </View>
            )
          }}
         />
         <View style={styles.inputContainer}>
           <View style={styles.inputTextWrap}>
            <TextInput onChangeText={inputBody=>this.setState({inputBody})} style={styles.inputText} value={this.state.inputBody}/>
           </View>
           <TouchableWithoutFeedback onPress={this.sendMessage}>
            <View style={styles.inputIconWrap}>
                <Icon name='send' solid size={20} color='white' />
            </View>
           </TouchableWithoutFeedback>
         </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  parent: {
    flex:1,
    position: 'relative'
  },
  messageSended: {
    alignItems: 'flex-end'
  },
  messageReceived: {
    alignItems: 'flex-start'
  },
  baloon:{
    backgroundColor: 'white',
    padding: 10,
    paddingBottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 5
  },
  baloonSender:{
    backgroundColor: '#b2ff59'
    // backgroundColor: '#03a9f4'
  },
  baloonTextContainer:{
    marginRight: 40
  },
  timestamp: {
    color: '#AAA',
    fontSize: 12,
    position: 'absolute',
    bottom: 5,
    right: 5
  },
  inputContainer: {
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    paddingTop: 10,
    flexDirection: 'row',
  },
  inputText:{
    backgroundColor: 'white',
    borderWidth: 1,
    width: '100%',
    borderRadius:30,
    height: 40,
    paddingRight: 20,
    paddingLeft: 20
  },
  inputTextWrap: {
    flex:1,
    borderRadius:30,
    height: 40
  },
  inputIconWrap: {
    height: 40,
    width: 40,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#03a9f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  }
})

const mapStateToProps = state => ({
  chat: state.chat,
  profile: state.profile
})

const mapDispatchToProps = {switchRoom, sendMessage, getMessages}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen)