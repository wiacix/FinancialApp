import { View, Text } from 'react-native'
import React from 'react'
import Dictionary from '../settings/Dictionary/Dictionary';

const Loading = (props) => {
  return (
    <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000B0', zIndex: 1}}>
      <Text style={{color: 'white', fontSize: 30, fontWeight: '600'}}>{Dictionary.Loading[props.lang]}...</Text>
    </View>
  )
}

export default Loading