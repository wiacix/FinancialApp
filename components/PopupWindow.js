import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Dictionary from '../settings/Dictionary/Dictionary'

const PopupWindow = (props) => {
  return (
    <View style={style.view}>
      <View style={style.container}>
        <Text style={style.mainText}>{Dictionary.ForSure[props.lang]}</Text>
        <View style={style.buttonHolder}>
            <Pressable style={{...style.btn, borderRightWidth: 2}} onPress={() => props.forYes()}><Text style={style.btnText}>{Dictionary.Yes[props.lang]}</Text></Pressable>
            <Pressable style={style.btn} onPress={() => props.forNo(false)}><Text style={style.btnText}>{Dictionary.No[props.lang]}</Text></Pressable>
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
    view: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080'
    },
    container: {
        width: '80%',
        height: '12%',
        backgroundColor: '#293038',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10
    },
    mainText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        marginHorizontal: 10,
        textAlign: 'center'
    },
    buttonHolder: {
        width: '100%',
        flexDirection: 'row',
        height: '40%'
    },
    btn: {
        width: '50%',
        backgroundColor: '#414449',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#9EABB8',
        fontWeight: '600'
    }
})

export default PopupWindow