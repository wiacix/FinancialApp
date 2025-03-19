import { View, Text, Pressable, TouchableHighlight } from 'react-native'
import React from 'react'
import ButtonStyle from '../settings/styles/Button'

const Button = (props) => {
  return (
    <TouchableHighlight style={{...ButtonStyle.bg, ...props.style}} onPress={props.onPress}>
        <Text style={ButtonStyle.text}>{props.name}</Text>
    </TouchableHighlight>
  )
}

export default Button