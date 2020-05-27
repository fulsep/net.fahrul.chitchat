import React, { Component } from 'react'
import { Text, View, Image, TextInput, Button, StyleSheet, ScrollView, TouchableWithoutFeedback, ToastAndroid, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Picker from 'react-native-image-picker'
import {connect} from 'react-redux'
import ActionSheet from 'react-native-actions-sheet'

import {changePicture, updateStatus} from '../redux/actions/profile'
import {deleteCredentials} from '../redux/actions/auth'
import Loading from '../components/Loading'

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#DDD'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10
  },
  footerText: {
    opacity: .5,
    fontWeight: 'bold'
  },
  heading: {
    backgroundColor: '#03a9f4',
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    elevation:1
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderColor: 'white',
    borderWidth: 2,
    // backgroundColor: 'black',
    borderRadius: 75,
    alignSelf: 'center',
    position: 'relative',
    elevation: 1
  },
  changePicture: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  profileName: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },
  statusText: {
    textAlign: 'center',
    color: 'white'
  },
  profileInfo: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-evenly'
  },
  profileInfoText: {
    color: 'white',
    fontWeight: 'bold'
  },
  menu: {
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderColor: '#AAA'
  },
  menuIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuContent: {
    flex: 1
  },
  menuText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: 'bold'
  },
  statusForm:{
    width: '80%',
    height: 200
  },
  statusInput: {
    borderWidth:1,
    width: '100%',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  statusGreet:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  }
})

class ProfileScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      imageData: '',
      status: this.props.profile.data.status
    }
    this.actionSheet = React.createRef()
  }
  menu = [
    {
      icon: 'user-circle',
      color: '#2196f3',
      name: 'Edit Profile'
    },
    {
      icon: '',
      color: '#3f51b5',
      name: 'Update Status',
      action: ()=>this.openStatusModal()
    },
    {
      icon: 'cog',
      color: '#ff9800',
      name: 'Settings'
    },
    {
      icon: 'refresh',
      color: '#00796b',
      name: 'Sync Contacts'
    },
    {
      code: 'out',
      icon: 'power-off',
      color: '#f44336',
      name: 'Sign out',
      action: ()=>this.signOut()
    }
  ]

  signOut = async()=> {
    const {deleteCredentials} = this.props
    await deleteCredentials()
  }

  changePicture = async() => {
    await Picker.showImagePicker({},async(res)=>{
      if(res.didCancel) {
        console.log('cancelled')
      } else if(res.error) {
        console.log(res.error)
      } else {
        const src = `file://${res.path}`
        const imageData = res.data
        this.setState({imageData}, ()=>{
          ToastAndroid.show('Changing picture...', ToastAndroid.SHORT)
          this.props.changePicture(src, ()=>{
            ToastAndroid.show('Picture Changed!', ToastAndroid.SHORT)
          })
        })
      }
    })
  }

  openStatusModal = ()=>{
    this.actionSheet.current?.setModalVisible()
  }

  saveStatus = async(status)=>{
    const {data} = this.props.profile
    const oldStatus = data.status
    if(status !== oldStatus){
      ToastAndroid.show('Updating...', ToastAndroid.SHORT)
      await this.props.updateStatus(status)
      ToastAndroid.show('Status Updated!', ToastAndroid.SHORT)
    }
    this.actionSheet.current?.setModalVisible()
  }

  render() {
    const {data, isChangingPicture} = this.props.profile
    const {isProcessing} = this.props.auth
    return (
      <>
      {data&&(
        <ScrollView style={styles.parent} contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.content}>
            <View style={styles.heading}>
              <View>
                <View style={styles.profilePicture}>
                  {data.picture==='' && this.state.imageData==='' && (
                    <View style={{width:'100%', height:'100%', justifyContent: 'center', alignItems:'center', backgroundColor: 'black', borderRadius: 150}}>
                      <Icon name='user' size={100} color='white' />
                    </View>
                  )}
                  {data.picture!=='' && this.state.imageData==='' && <Image source={{uri: data.picture}} style={{width: '100%', height: '100%', borderRadius: 150}} />}
                  {data.picture==='' && this.state.imageData!=='' && <Image source={{uri: 'data:image/jpeg;base64,'.concat(this.state.imageData)}} style={{width: '100%', height: '100%', borderRadius: 150}} />}
                  {data.picture!=='' && this.state.imageData!=='' && <Image source={{uri: 'data:image/jpeg;base64,'.concat(this.state.imageData)}} style={{width: '100%', height: '100%', borderRadius: 150}} />}
                  {isChangingPicture && (
                    <View style={{width: '100%', height: '100%', borderRadius: 150, backgroundColor:'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
                      <Loading />
                    </View>
                  )}
                  <TouchableWithoutFeedback onPress={this.changePicture}>
                    <View style={styles.changePicture}>
                      <Icon name='camera' />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <Text style={styles.profileName}>{data.fullName}</Text>
                <Text style={styles.statusText}>{this.state.status}</Text>
                {/* <View style={styles.profileInfo}>
                  <Text style={styles.profileInfoText}>22 Post</Text>
                  <Text style={styles.profileInfoText}>22 Post</Text>
                  <Text style={styles.profileInfoText}>22 Post</Text>
                </View> */}
              </View>
            </View>
            <View style={styles.menu}>
              {this.menu.map((o,i)=>(
                <TouchableWithoutFeedback onPress={o.action} key={i.toString()}>
                  <View style={[styles.menuItem, i !== this.menu.length - 1 && styles.menuItemBorder]}>
                    <View style={styles.menuIcon}>
                      {isProcessing && o.code === 'out' && <Loading size={20} color='black' />}
                      {isProcessing && o.code !== 'out' && <Icon name={o.icon || 'pencil'} color={o.color || 'black'} size={20} />}
                      {!isProcessing && o.code !== 'out' && <Icon name={o.icon || 'pencil'} color={o.color || 'black'} size={20} />}
                      {!isProcessing && o.code === 'out' && <Icon name={o.icon || 'pencil'} color={o.color || 'black'} size={20} />}
                      {/* {o.code!=='out' && <Icon name={o.icon || 'pencil'} color={o.color || 'black'} size={20} />} */}
                    </View>
                    <View style={styles.menuContent}>
                      <Text style={styles.menuText}>{o.name}</Text>
                    </View>
                    <View>
                      <Icon name='chevron-right' size={15} />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chitchat v1.0</Text>
          </View>
        </ScrollView>
      )}
      {!data &&(
        <View style={[styles.parent, {justifyContent: 'center', alignItems: 'center'}]}>
          <Loading size={50} color='#03a9f4' />
        </View>
      )}
      <ActionSheet ref={this.actionSheet} containerStyle={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={[styles.statusForm, styles.center]}>
          <Text style={styles.statusGreet}>What's Happening?</Text>
          <TextInput onEndEditing={()=>this.saveStatus(this.state.status)} onChangeText={status=>this.setState({status})} style={styles.statusInput} value={this.state.status} />
        </View>
      </ActionSheet>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  profile : state.profile,
  auth: state.auth
})

const mapDispatchToProps = {changePicture, deleteCredentials, updateStatus}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
