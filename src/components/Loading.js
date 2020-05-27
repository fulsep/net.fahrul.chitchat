import React, { Component } from 'react'
import { Text, View, Animated, Easing } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'


const spinValue = new Animated.Value(0)
const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg']
})
const animate = Animated.loop(
  Animated.timing(
    spinValue,
    {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    }
  )
)


export default class Loading extends Component {
  componentDidMount(){
    animate.start()
  }
  componentWillUnmount(){
    animate.stop()
  }
  render() {
    return (
      <Animated.View style={{
        transform: [{rotate: spin}],
        width: this.props.size || 40,
        height: this.props.size || 40,
        ...this.props.style}}>
        <Icon name='spinner' size={this.props.size || 40} color={this.props.color || 'white'} />
      </Animated.View>
    )
  }
}
