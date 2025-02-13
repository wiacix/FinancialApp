import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import React from 'react'
import Dictionary from '../settings/Dictionary/Dictionary'

const PopupWindow = (props) => {
  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => (props.forNo!=undefined && props.forNo(false))}>
    <View style={style.view}>
      <View style={style.container}>
        <Pressable onPress={() => {props.forClose!=undefined ? props.forClose(false) : props.forNo(false)}} style={{position: 'absolute', right: 15, top: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#AAAAAA55', fontSize: 17}}>X</Text>
        </Pressable>
        <Text style={style.mainText}>{props.text!=undefined ? props.text : Dictionary.ForSure[props.lang]}</Text>
        <View style={style.buttonHolder}>
            <Pressable style={{...style.btn, borderRightWidth: 2, borderBottomLeftRadius: 20}} onPress={() => props.forYes()}><Text style={style.btnText}>{props.yes ? props.yes : Dictionary.Yes[props.lang]}</Text></Pressable>
            <Pressable style={{...style.btn, borderBottomRightRadius: 20}} onPress={() => (props.forNo!=undefined ? props.forNo(false) : props.forEdit())}><Text style={style.btnText}>{props.no ? props.no : Dictionary.No[props.lang]}</Text></Pressable>
        </View>
      </View>
    </View>
    </Modal>
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
        borderRadius: 20,
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