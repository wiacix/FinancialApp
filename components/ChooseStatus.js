import { View, Text, Pressable } from 'react-native'
import React from 'react'

const ChooseStatus = (props) => {
  return (
    <View style={{position: 'absolute', width: '100%', height: '100%', zIndex: 1, backgroundColor: '#000000B0', justifyContent: 'center', alignItems: 'center'}}>
      {props.value.map((item) => {
        return (
            <Pressable onPress={() => {props.onChange(item.id); props.onClose(false);}} key={item.id} style={{width: '90%', backgroundColor: '#414449', height: 50, justifyContent: 'center', alignItems: 'center', marginVertical: 7, borderRadius: 10}}>
                <Text style={{color: '#FFF', fontSize: 20}}>{item.name}</Text>
            </Pressable>
        )
      })}
    </View>
  )
}

export default ChooseStatus