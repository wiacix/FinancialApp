import React from 'react'
import { Pressable, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';

const TransferSwitcher = (props) => {
    const switchTransfer = (value) => {
        // 0 - wpływy/wydatki, 1 - wydatki, 2 - wpływy, -1 - nic
        if(value==1){ // Klikam wydatki
            if(props.transfer==2) props.setTransfer(0);
            else if(props.transfer==1) props.setTransfer(-1);
            else if(props.transfer==-1) props.setTransfer(1);
            else props.setTransfer(2);
        }else{ // Klikam wpływy
            if(props.transfer==2) props.setTransfer(-1);
            else if(props.transfer==1) props.setTransfer(0);
            else if(props.transfer==-1) props.setTransfer(2);
            else props.setTransfer(1);
        }
    }

    return (
       <View style={{position: 'absolute', top:10, right: 5, flexDirection: 'row', backgroundColor: '#252525', gap: 10, padding: 5, borderRadius: 25, ...props.style}}>
            <Pressable onPress={() => switchTransfer(2)} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: (props.transfer==0 || props.transfer==2 ? 'rgb(30, 132, 52)' : '#333333'), borderRadius: 20, padding: 7}}>
                <AntDesign name='arrowup' size={27} color={props.transfer==0 || props.transfer==2 ? 'white' : 'rgb(30, 132, 52)'} />
            </Pressable>
            <Pressable onPress={() => switchTransfer(1)} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: (props.transfer==0 || props.transfer==1 ? 'rgb(138, 28, 28)' : '#333333'), borderRadius: 20, padding: 7}}>
                <AntDesign name='arrowdown' size={27} color={props.transfer==0 || props.transfer==1 ? 'white' : 'rgb(138, 28, 28)'} />
            </Pressable>
       </View>
    )
}

export default TransferSwitcher
