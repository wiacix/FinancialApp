import { View, Text, Modal, KeyboardAvoidingView, Platform, TextInput, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useRef, useState } from 'react'
import Dictionary from '../settings/Dictionary/Dictionary';
import colors from '../settings/styles/colors';
import Alert from './Alert';

const InputPIN = (props) => {
    const [pin, setPin] = useState(props.pin=='nullx' ? '' : props.pin);
    const [isAlert, setIsAlert] = useState(false);
    const [isAlertWrong, setIsAlertWrong] = useState(false);
    const ref = useRef(null);

    const savePin = () => {
        if(pin.length==4){
            if(props.correctPin){
                if(props.correctPin==pin) props.authorization(true);
                else setIsAlertWrong(true);
            }else{
                props.setPin(pin);
                props.onClose(false);
            }
        }else setIsAlert(true);
    }

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => props.onClose(false)} onShow={() => {ref.current.focus(); ref.current.setSelection(pin.length);}}>
        {isAlert && <Alert text={Dictionary.PinValid[props.lang]} ok={Dictionary.Ok[props.lang]} close={setIsAlert} />}
        {isAlertWrong && <Alert text={Dictionary.WrongPin[props.lang]} ok={Dictionary.Ok[props.lang]} close={setIsAlertWrong} />}
        <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000B0'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', justifyContent: 'center', alignItems: 'center', gap: 10}} >
                    <Text style={{color: 'white', fontSize: 30, fontWeight: '600'}}>{Dictionary.InsertPin[props.lang]}</Text>
                    <View style={{width: '50%', height: 70, backgroundColor: colors.contener, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <TextInput 
                            style={{color: colors.inputText, width: '100%', textAlign: 'center', fontSize: 25, letterSpacing: 1}}
                            value={pin}
                            onChangeText={setPin}
                            placeholder={Dictionary.InsertPin[props.lang]}
                            keyboardType="numeric"
                            secureTextEntry
                            maxLength={4}
                            ref={ref}
                            />
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


export default InputPIN