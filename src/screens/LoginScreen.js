import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native'
import {connect} from 'react-redux'

import {login} from '../redux/actions/auth'

import Loading from '../components/Loading'

const styles = StyleSheet.create({
  parent: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginForm: {
    width: '80%'
  },
  input: {
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16
  },
  button: {
    marginTop: 10,
    marginBottom: 5,
    width: '100%',
    height: 45,
    backgroundColor: '#03a9f4',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisable: {
    backgroundColor: 'grey'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  registerLink: {
    color: '#03a9f4'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  }
})

class LoginScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      phone: '',
      pass: ''
    }
  }
  login = () => {
    const {phone, pass} = this.state
    this.props.login(phone, pass)
  }
  render() {
    const {phone, pass} = this.state
    const {isProcessing, error} = this.props.auth
    return (
      <View style={[styles.parent, styles.center]}>
        <View style={styles.loginForm}>
          <View style={styles.center}>
            {error==='auth/user-not-found' && <Text style={styles.errorText}>User not found</Text>}
            {error==='auth/invalid-email' && <Text style={styles.errorText}>Invalid Email</Text>}
            {error==='auth/wrong-password' && <Text style={styles.errorText}>Wrong Password</Text>}
          </View>
          <TextInput onChangeText={phone=>this.setState({phone})} placeholder='Phone' keyboardType='phone-pad' style={styles.input} value={phone}/>
          <TextInput onChangeText={pass=>this.setState({pass})} placeholder='Password' style={styles.input} value={pass}/>
          <TouchableWithoutFeedback disabled={phone==='' || pass==='' || isProcessing} onPress={this.login}>
            <View style={[styles.button, (phone==='' || pass==='' ||  isProcessing) && styles.buttonDisable]}>
              {isProcessing&& <Loading size={20} />}
              {!isProcessing&& <Text style={styles.buttonText}>Login</Text>}
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.center}>
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('register')}>
              <Text style={styles.registerLink}>Don't have an Account?</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = {login}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)