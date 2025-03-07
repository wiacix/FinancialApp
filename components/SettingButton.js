import { View, Text, Pressable, Image, StyleSheet, TextInput, Animated } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import React, { useRef } from 'react'
import * as GF from '../settings/GlobalFunction'
import colors from '../settings/styles/colors';

const SettingButton = (props) => {
    const toggleAnim = useRef(new Animated.Value((props.editText==0 ? 2 : 33))).current;
    const toggleColor = useRef(new Animated.Value((props.editText==0 ? 0 : 1))).current;

    const changeToggle = () => {
        if(props.editText==0){
            Animated.parallel([Animated.timing(toggleAnim, {toValue: 33, duration: 500, useNativeDriver: false}), Animated.timing(toggleColor, {toValue: 1, duration: 500, useNativeDriver: false})]).start(() => props.onChangeEditText(1));
        } 
        else Animated.parallel([Animated.timing(toggleAnim, {toValue: 2, duration: 500, useNativeDriver: false}), Animated.timing(toggleColor, {toValue: 0, duration: 500, useNativeDriver: false})]).start(() => props.onChangeEditText(0));
    }

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
            ) : (props.editText != undefined && !props.toggle ? (
                <TextInput 
                    style={{fontSize: 15, color: '#FFF', marginRight: 10, borderBottomWidth: 1, minWidth: 50, textAlign: 'center'}}
                    placeholder={(!props.editText ? '0' : props.editText.toString())}
                    value={(!props.editText ? '' : props.editText.toString())}
                    keyboardType='numeric'
                    onChangeText={e => GF.changeValue(e, props.onChangeEditText)}
                    editable={!props.lock}
                    selectTextOnFocus={!props.lock}
                />
            ) : (props.toggle != undefined && props.toggle ? (
                <Pressable onPress={() => changeToggle()} style={{marginRight: 10}}>
                    <Animated.View style={{borderRadius: 20, justifyContent: 'center', position: 'relative', height: 30, width: 60, backgroundColor: toggleColor.interpolate({inputRange: [0, 1], outputRange: [colors.settingChoose, colors.button]})}} >
                        <Animated.View style={{backgroundColor: colors.inputText, width: 25, height: 25, position: 'absolute', borderRadius: 20, left: toggleAnim }}></Animated.View>
                    </Animated.View>
                </Pressable>
            ) : (
                <Text style={{fontSize: 15, color: (props?.colorText == undefined ? '#FFF' : props.colorText), marginRight: 10}}>{props.status}</Text>
        )))}
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