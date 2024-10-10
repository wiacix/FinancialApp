import { View, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import colors from '../settings/styles/colors'

const UnlockInput = (props) => {
  return (
    <View style={style.UnlockInput}>
        <TextInput 
          style={style.UnlockInputFont}
          placeholder={(!props.value ? '0' : props.value.toString())}
          value={(!props.value ? '' : props.value.toString())}
          keyboardType='numeric'
          onChangeText={e => props.onChange(props.categoryName, e)} />
    </View>
  )
}

const style = StyleSheet.create({
  UnlockInput:{
    width: 75,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
},
UnlockInputFont:{
    fontSize: 15,
    color: colors.greyColor
}
})

export default UnlockInput