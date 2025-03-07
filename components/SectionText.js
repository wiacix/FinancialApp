import { View, Text } from 'react-native'
import React from 'react'

const SectionText = (props) => {
  return (
    <View style={{marginTop: 7, flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
      <View style={{height: 1, backgroundColor: 'white', borderColor: 'white', borderWidth: 1, flex: 1 }} />
      <Text style={{color: 'white', textTransform: 'uppercase'}}>{props.text}</Text>
      <View style={{height: 1, backgroundColor: 'white', borderColor: 'white', borderWidth: 1, flex: 1 }} />
    </View>
  )
}

export default SectionText