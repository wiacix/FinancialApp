import { View, Text, Pressable, Image, StyleSheet, TextInput } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react'
import * as GF from '../settings/GlobalFunction'

const SettingButton = (props) => {

  return (
    <Pressable onPress={() => ((!props.lock && props.editText==undefined) && props.onPress(true))} style={{width: '100%', marginTop: 20, backgroundColor: '#414449', borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 60}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.lock ? <Entypo name="lock" size={24} color="#000" style={{marginLeft: 2}} /> : <Entypo name="lock-open" size={24} color="#FFFFFF88" style={{marginLeft: 2}} />}
            <Text style={{fontSize: 24, color: '#FFF', fontWeight: '600', marginLeft: 5}}>{props.name}</Text>
        </View>
            {props.picture != undefined ? (
                <View style={{...style.iconHolder, backgroundColor: props.color}}>
                    <Image
                        source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+props.picture}}
                        style={{ width: 30, height: 30}}
                    />
                </View>
            ) : (props.editText != undefined ? (
                <TextInput 
                    style={{fontSize: 15, color: '#FFF', marginRight: 10, borderBottomWidth: 1, minWidth: 50, textAlign: 'center'}}
                    placeholder={(!props.editText ? '0' : props.editText.toString())}
                    value={(!props.editText ? '' : props.editText.toString())}
                    keyboardType='numeric'
                    onChangeText={e => GF.changeValue(e, props.onChangeEditText)}
                />
            ) : (
                    <Text style={{fontSize: 15, color: (props?.colorText == undefined ? '#FFF' : props.colorText), marginRight: 10}}>{props.status}</Text>
            ))}
    </Pressable>
  )
}

const style = StyleSheet.create({
    iconHolder: {
        width: 45,
        height: 45,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
})
export default SettingButton