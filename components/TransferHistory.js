import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import * as DB from '../settings/SQLite/query'
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Dictionary from '../settings/Dictionary/Dictionary';
import { router } from 'expo-router';

const TransferHistory = (props) => {
    const [openWindow, setOpenWindow] = useState(false);

  return (
    <View>
        <Pressable style={style.box} onPress={() => {props.open ? setOpenWindow(!openWindow) : null}}>
            <View style={{flexDirection: 'row'}}>
                <View style={style.sideBox}>
                    <Text style={{...style.accName, color: (DB.selectValueFromColumnCondition('account', 'Color', 'Active=1 AND Code='+props.value.FromAccountCode)[0].Color)}}>{DB.selectValueFromColumnCondition('account', 'Name', 'Active=1 AND Code='+props.value.FromAccountCode)[0].Name}</Text>
                </View>
                <View style={style.midBox}>
                    <Text style={style.midBoxText}>{props.value.Amount.toFixed(2)} PLN</Text>
                    <View style={style.arrowHolder}>
                        <Octicons name="horizontal-rule" size={50} color="#1F1F1F" style={{marginTop: 2, marginRight: -3}} />
                        <Octicons name="horizontal-rule" size={50} color="#1F1F1F" style={{marginTop: 2, marginRight: -3}} />
                        <Entypo name="arrow-long-right" size={24} color="#1F1F1F" />
                    </View>
                    <Text style={{...style.midBoxText, marginBottom: 3}}>{props.value.Date}</Text>
                </View>
                <View style={style.sideBox}>
                    <Text style={{...style.accName, color: (DB.selectValueFromColumnCondition('account', 'Color', 'Active=1 AND Code='+props.value.ToAccountCode)[0].Color)}}>{DB.selectValueFromColumnCondition('account', 'Name', 'Active=1 AND Code='+props.value.ToAccountCode)[0].Name}</Text>
                </View>
            </View>
        {openWindow && 
        <>
            <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 5, borderTopWidth: 1, paddingVertical: 5}}>
                <Text style={style.midBoxText}>{props.value.Description}</Text>
            </View>
            <View style={{flexDirection: 'row', borderTopWidth: 1}}>
                <Pressable style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, paddingVertical: 5}} onPress={() => {router.push({pathname: '/home/accountTransfer', params: {type: 2, edit: false, cash: props.value.Amount, id: props.value.Id, fromAccId: props.value.FromAccountCode, toAccId: props.value.ToAccountCode, dateT: props.value.Date, desc: props.value.Description}})}}>
                    <AntDesign name="edit" size={24} color="grey" />
                    <Text style={{...style.midBoxText, color: 'grey'}}>{Dictionary.Edit[props.lang]}</Text>
                </Pressable>
                <Pressable style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 5}} onPress={() => {props.onDelete(true); props.setId(props.value.Id)}}>
                    <AntDesign name="close" size={24} color="grey" />
                    <Text style={{...style.midBoxText, color: 'grey'}}>{Dictionary.Delete[props.lang]}</Text>
                </Pressable>
            </View>
        </>}
        </Pressable>
    </View>
  )
}

const style = StyleSheet.create({
    box: {
        width: '100%',
        flexDirection: 'column',
        marginVertical: 5,
        backgroundColor: '#414449',
        borderRadius: 10,
        paddingTop: 3
    },
    sideBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    midBox: {
        flex: 2,
        alignItems: 'center'
    },
    accName: {
        color: 'white',
        fontSize: 15
    },
    midBoxText: {
        color: 'white',
        fontSize: 15
    },
    arrowHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: -22
    }
})

export default TransferHistory