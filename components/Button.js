import { View, Text, Pressable } from 'react-native'
import React from 'react'
import ButtonStyle from '../settings/styles/Button'

const Button = (props) => {
  return (
    <Pressable style={{...ButtonStyle.bg, ...props.style}} onPress={props.onPress}>
        <Text style={ButtonStyle.text}>{props.name}</Text>
    </Pressable>
  )
}

export default Button