import { View, Text, Modal, KeyboardAvoidingView, Platform, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Dictionary from '../settings/Dictionary/Dictionary';
import colors from '../settings/styles/colors';
import Alert from './Alert';

const InputPIN = (props) => {
    const inputNumber = [0,1,2,3];
    const [pin, setPin] = useState(new Array(inputNumber.length).fill(""));
    const [isAlert, setIsAlert] = useState(false);
    const [isAlertWrong, setIsAlertWrong] = useState(false);
    const refs = useRef(inputNumber.map(() => React.createRef()));

    const handleChangeText = (text, index) => {
        const newValues = [...pin];
        newValues[index] = text;
        setPin(newValues);
        if(text!=''){
            if(index<3) refs.current[index+1].current.focus();
            else{
                Keyboard.dismiss();
                savePin(newValues);
            }
        }else if(index>0) refs.current[index-1].current.focus();
    };

    const savePin = (pin) => {
        const combinedString = pin.join('');
        if(combinedString.length==4){
            if(props.correctPin){
                if(props.correctPin==combinedString) props.authorization(true);
                else setIsAlertWrong(true);
            }else{
                props.setPin(combinedString);
                props.onClose(false);
            }
        }else setIsAlert(true);
    }

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => props.onClose(false)} onShow={() => {refs.current[0].current.focus();}}>
        {isAlert && <Alert text={Dictionary.PinValid[props.lang]} ok={Dictionary.Ok[props.lang]} close={setIsAlert} />}
        {isAlertWrong && <Alert text={Dictionary.WrongPin[props.lang]} ok={Dictionary.Ok[props.lang]} close={setIsAlertWrong} />}
        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000B0'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', justifyContent: 'center', alignItems: 'center', gap: 10}} >
                    <Text style={{color: 'white', fontSize: 30, fontWeight: '600'}}>{Dictionary.InsertPin[props.lang]}</Text>
                    <View style={{width: '90%', height: 70, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 15}}>
                        {inputNumber.map((item) => {
                            return (
                                <TextInput
                                key={item}
                                style={styles.inputText}
                                value={pin[item]}
                                onChangeText={(text) => handleChangeText(text, item)}
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={1}
                                ref={refs.current[item]}
                                />
                            )
                        })}
                    </View>
                    <Pressable onPress={() => {Keyboard.dismiss(); savePin();}} style={{width: '40%', height: 50, backgroundColor: colors.button, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.inputText, fontWeight: 600, fontSize: 17}}>{props.btnText}</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    inputText: {
        color: colors.inputText, 
        width: '15%', 
        textAlign: 'center', 
        fontSize: 25, 
        backgroundColor: colors.contener,
        height: '100%',
        borderRadius: 10
    }
})
export default InputPIN