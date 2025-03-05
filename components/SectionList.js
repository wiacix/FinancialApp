import { View, Text, ScrollView, Pressable, Image } from 'react-native'
import React from 'react'
import * as GF from '../settings/GlobalFunction'

const SectionList = (props) => {

  return (
    <View style={{maxHeight: 150}}>
      <ScrollView style={{width: '100%', paddingHorizontal: 5}}>
        {props.data.map((item, index) => {
          return(
            <Pressable onPress={() => {props.setValue(index); props.close(false)}} key={index} style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', gap: 3, borderTopColor: 'grey', borderTopWidth: 1, paddingVertical: 4}}>
              <View style={{backgroundColor: GF.convertColor(item.Color, '55'), borderRadius: 20, height: 25, width: 25, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.Picture }} style={{height: 15, width: 15}} />
              </View>
              <Text style={{color: 'white', flex: 1, fontSize: 12, fontWeight: '500'}}>{item.Name.length > 15 ? item.Name.substring(0,15)+'...' : item.Name}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default SectionList