import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import React from 'react'

const Alert = (props) => {
  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => props.close(false)}>
      <View style={style.view}>
        <View style={style.container}>
          <Text style={style.mainText}>{props.text}</Text>
          <View style={style.buttonHolder}>
              <Pressable style={{...style.btn}} onPress={() => props.close(false)}><Text style={style.btnText}>{props.ok}</Text></Pressable>
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
        zIndex: 100,
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
        width: '100%',
        backgroundColor: '#414449',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#9EABB8',
        fontWeight: '600'
    }
})

export default Alert