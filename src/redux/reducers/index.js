import {combineReducers} from 'redux'

const profileState = {
  data: {},
  isChangingPicture: false
}

const authState = {
  isProcessing: false,
  user: null,
  error: null
}

const chatState = {
  focus: 'Chat',
  data: []
}

const reducer = combineReducers({
  profile: (state= profileState, action) => {
    switch(action.type){
      case 'GET_PROFILE': {
        return {
          ...state,
          data: action.payload
        }
      }
      case 'PICTURE_LOAD': {
        return {
          ...state,
          isChangingPicture: !state.isChangingPicture
        }
      }
      case 'UPDATE_STATUS': {
        const data = state.data
        data.status = action.payload
        return {
          ...state,
          data: {...data}
        }
      }
      default: {
        return {
          ...state
        }
      }
    }
  },
  auth: (state= authState, action) => {
    switch(action.type){
      case 'TRY_AUTH': {
        const append = {}
        if(!state.isProcessing){
          append.error = null
        }
        return {
          ...state,
          isProcessing: !state.isProcessing,
          ...append
        }
      }
      case 'SET_CREDENTIALS': {
        return {
          ...state,
          user: action.payload
        }
      }
      case 'AUTH_ERROR': {
        return {
          ...state,
          error: action.payload
        }
      }
      case 'DELETE_CREDENTIALS': {
        return {
          ...state,
          user: null
        }
      }
      default: {
        return {
          ...state
        }
      }
    }
  },
  chat: (state= chatState, action) => {
    switch(action.type){
      case 'SWITCH_ROOM': {
        return {
          data:[],
          focus: action.payload
        }
      }
      case 'GET_MESSAGES': {
        return {
          ...state,
          data: action.payload
        }
      }
      default : {
        return {
          ...state
        }
      }
    }
  }
})

export default reducer
