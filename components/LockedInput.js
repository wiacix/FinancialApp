import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../settings/styles/colors'

const LockedInput = (props) => {
  return (
    <View style={style.LockedInput}>
        <Text style={{...style.LockedInputFont, ...props.style}}>{props.value}</Text>
    </View>
  )
}

const style = StyleSheet.create({
    LockedInput:{
        backgroundColor: colors.secondColorTransparent,
        marginVertical: 10,
        paddingVertical: 7,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
        width: 75,
        justifyContent: 'center',
        alignItems: 'center'
    },
    LockedInputFont:{
        fontSize: 15,
        color: colors.greyColor
    }
})

export default LockedInput