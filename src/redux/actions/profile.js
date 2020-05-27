import storage from '@react-native-firebase/storage'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'

export const changePicture = (file='', cb)=>{
  return async dispatch => {
    dispatch({
      type: 'PICTURE_LOAD'
    })
    const phone = auth().currentUser.displayName
    const data = await database().ref(`users/${phone}`)
    const profile = await data.once('value')

    file = file.split('/')
    const fileName = file[file.length-1]
    const fileSplit = fileName.split('.')
    const fileExt = fileSplit[fileSplit.length-1]

    const ref = storage().ref(`${profile.val().phone}`.concat(`.${fileExt}`))
    await ref.putFile(file.join('/'))
    const child = await data.child('picture')
    const uri = await ref.getDownloadURL()
    await child.set(uri)
    dispatch({
      type: 'PICTURE_LOAD'
    })
    cb()
  }
}

export const updateStatus = (status)=> {
  return async dispatch => {
    const phone = auth().currentUser.displayName
    const data = await database().ref(`users/${phone}/status`)
    await data.set(status)
    dispatch({
      type: 'UPDATE_STATUS',
      payload: status
    })
  }
}

export const getData = ()=> {
  return async dispatch => {
    const phone = auth().currentUser.displayName
    const data = await database().ref(`users/${phone}`)
    const profile = await data.once('value')
    dispatch({
      type: 'GET_PROFILE',
      payload: profile.val()
    })
  }
}
