import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

export const login = (phone, pass) => {
  return async dispatch => {
    dispatch({
      type: 'TRY_AUTH'
    })
    const user = database().ref('users/'.concat(phone))
    const data = await user.once('value')
    if(data.val()){
      try{
        const ref = user.child('email')
        const email = await ref.once('value')
        await auth().signInWithEmailAndPassword(email.val(), pass)
      }catch(e){
        dispatch({
          type: 'AUTH_ERROR',
          payload: e.code
        })
      }
    }else{
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'auth/user-not-found'
      })
    }
    dispatch({
      type: 'TRY_AUTH'
    })
  }
}

export const register = (fullName, phone, email, pass) => {
  return async dispatch => {
    dispatch({
      type: 'TRY_AUTH'
    })
    const user = database().ref('users/'.concat(phone))
    const data = await user.once('value')
    if(!data.val()){
      try{
        const newData = {
          fullName,
          phone,  
          email,
          status: 'Hey there! I am using Chitchat',
          picture: '',
          createdAt: new Date().getTime(),
          deletedAt: ''
        }
        const newUser = await auth().createUserWithEmailAndPassword(email, pass)
        await newUser.user.updateProfile({
          displayName: phone
        })
        await user.set(newData)
      }catch(e){
        dispatch({
          type: 'AUTH_ERROR',
          payload: e.code
        })
      }
    }else{
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'auth/phone-already-in-use'
      })
    }
    dispatch({
      type: 'TRY_AUTH'
    })
  }
}

export const setCredentials = (payload) => {
  return dispatch => {
    dispatch({
      type: 'SET_CREDENTIALS',
      payload
    })
  }
}

export const deleteCredentials = ()=> {
  return async dispatch => {
    dispatch({
      type: 'TRY_AUTH'
    })
    try{
      await auth().signOut()
      dispatch({
        type: 'DELETE_CREDENTIALS'
      })
      dispatch({
        type: 'GET_PROFILE',
        payload: {}
      })
    }catch(e){
      console.log(e)
    }
    dispatch({
      type: 'TRY_AUTH'
    })
  }
}