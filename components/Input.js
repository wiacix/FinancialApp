import { TextInput, View } from 'react-native'
import React from 'react'
import InputStyle from '../settings/styles/Input'

const Input = (props) => {
  return (
      <TextInput 
      style={InputStyle.bg}
      placeholder={props.name}
      placeholderTextColor={InputStyle.placeholderText.color}
      secureTextEntry={props.type === 'password' ? true : false}
      value={props.value}
      onChangeText={props.onChange}
      />
  )
}

export default Input