import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native'
import {connect} from 'react-redux'

import {register} from '../redux/actions/auth'

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

class RegisterScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      fullName:'',
      phone:'',
      email: '',
      pass: ''
    }
  }
  register = () => {
    const {fullName, phone, email, pass} = this.state
    this.props.register(fullName, phone, email, pass)
  }
  render() {
    const {fullName, phone, email, pass} = this.state
    const {isProcessing, error} = this.props.auth
    return (
      <View style={[styles.parent, styles.center]}>
        <View style={styles.loginForm}>
          <View style={styles.center}>
            {error==='auth/email-already-in-use' && <Text style={styles.errorText}>Email already in use</Text>}
            {error==='auth/phone-already-in-use' && <Text style={styles.errorText}>Phone already in use</Text>}
            {error==='auth/invalid-email' && <Text style={styles.errorText}>Invalid Email</Text>}
            {error==='auth/weak-password' && <Text style={styles.errorText}>Weak Password</Text>}
          </View>
          <TextInput onChangeText={fullName=>this.setState({fullName})} placeholder='Full Name' style={styles.input} value={fullName}/>
          <TextInput onChangeText={phone=>this.setState({phone})} placeholder='Phone Number' keyboardType='phone-pad' style={styles.input} value={phone}/>
          <TextInput onChangeText={email=>this.setState({email})} placeholder='Email' keyboardType='email-address' style={styles.input} value={email}/>
          <TextInput onChangeText={pass=>this.setState({pass})} placeholder='Password' secureTextEntry={true} style={styles.input} value={pass}/>
          <TouchableWithoutFeedback disabled={email==='' || pass==='' || fullName==='' || phone==='' || isProcessing} onPress={this.register}>
            <View style={[styles.button, (email==='' || pass==='' || fullName==='' || phone==='' ||  isProcessing) && styles.buttonDisable]}>
              {isProcessing&& <Loading size={20} />}
              {!isProcessing&& <Text style={styles.buttonText}>Register</Text>}
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.center}>
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('login')}>
              <Text style={styles.registerLink}>Have an Account?</Text>
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

const mapDispatchToProps = {register}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)