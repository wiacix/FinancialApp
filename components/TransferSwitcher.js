import React from 'react'
import { Pressable, View, Text } from 'react-native'
import Dictionary from '../settings/Dictionary/Dictionary'
import AntDesign from '@expo/vector-icons/AntDesign';

const TransferSwitcher = (props) => {
    const switchTransfer = () => {
        if(props.transfer==0) props.setTransfer(2);
        else if(props.transfer==1) props.setTransfer(0);
        else props.setTransfer(1);
    }
    return (
        <Pressable onPress={() => switchTransfer()} style={{position: 'absolute', top: 20, right: 10, flexDirection: 'column', gap: 3, backgroundColor: 'rgba(39, 39, 39, 0.44)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: (props.transfer==1 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.10)')}}>
                    <AntDesign name='arrowdown' size={20} color='rgb(138, 28, 28)' />
                </View>
                <View style={{width: 10, height: 5, backgroundColor: 'rgba(255, 255, 255, 0.10)'}}></View>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 31, borderRadius: 50, backgroundColor: (props.transfer==0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.10)')}}>
                    <AntDesign name='arrowdown' size={20} color='rgb(138, 28, 28)' style={{marginTop: 1}} />
                    <AntDesign name='arrowup' size={20} color='rgb(30, 132, 52)' style={{marginLeft: -9, marginBottom: 1}} />
                </View>
                <View style={{width: 10, height: 5, backgroundColor: 'rgba(255, 255, 255, 0.10)'}}></View>
                <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: (props.transfer==2 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.10)')}}>
                    <AntDesign name='arrowup' size={20} color='rgb(30, 132, 52)' />
                </View>
            </View>
        </Pressable>
    )
}

export default TransferSwitcher
