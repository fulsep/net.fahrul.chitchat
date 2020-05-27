import storage from '@react-native-firebase/storage'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'

export const switchRoom = (payload) => {
  return async dispatch => {
    dispatch({
      type: 'SWITCH_ROOM',
      payload
    })
  }
}

export const getMessages = (phone, cb) => {
  const self = auth().currentUser.displayName
  return async dispatch => {
    const chat = await database().ref(`messages/${self}/${phone}`)
    chat.on('value', snap => {
      const raw = snap.val()
      const keys = Object.keys(raw)
      const payload = []
      keys.forEach((o,i)=>{
        payload.push(raw[o])
        if(i===keys.length-1){
          payload.sort((a, b) => {
            const timeA = a.createdAt
            const timeB = b.createdAt
            if(timeA < timeB){
              return -1
            }
            if(timeA > timeB){
              return 1
            }
            return 0
          })
          dispatch({
            type: 'GET_MESSAGES',
            payload
          })
          cb()
        }
      })
    })
  }
}

export const sendMessage = (phone, body, attachment, cb) => {
  return async dispatch => {
    const sender = auth().currentUser.displayName
    const sended = database().ref(`messages/${sender}/${phone}`)
    const received = database().ref(`messages/${phone}/${sender}`)
    const createdAt = new Date().getTime()
    const data = {
      attachment: attachment || "",
      body,
      createdAt,
      deletedAt: '',
      readAt: '',
      sender
    }
    await sended.child(createdAt.toString()).set(data)
    await received.child(createdAt.toString()).set(data)
    cb()
  }
}