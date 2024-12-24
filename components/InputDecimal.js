import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useRef, useEffect } from 'react'
import colors from '../settings/styles/colors'
import * as GF from '../settings/GlobalFunction'
import Dictionary from '../settings/Dictionary/Dictionary'

const InputDecimal = (props) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
        inputRef.current.focus();
        }
    }, []);

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000B0', zIndex: 1}}>
        <TextInput ref={inputRef} selectTextOnFocus={true} value={props.value.toString()} placeholder='0' placeholderTextColor='#9EABB8' onChangeText={e => GF.changeValue(e, props.setValue)} style={{fontSize: 25, color: colors.greyColor}} keyboardType='numeric' />
        <Pressable onPress={() => props.OnPress(false)} style={{width: '50%', paddingVertical: 10, alignItems: 'center', marginTop: 10, borderRadius: 10, backgroundColor: colors.button}}>
            <Text style={{fontWeight: '500', fontSize: 15, color: 'white'}}>{Dictionary.SendBtn[props.lang]}</Text>
        </Pressable>
    </View>
  )
}

export default InputDecimal