import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import * as DB from '../settings/SQLite/query'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

const SelectAccount = (props) => {

    function changeAccount(accId){
        props.accId(accId);
        props.off(false);
    }

    return (
    <View style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000B0', zIndex: 1}}>
        <View style={{width: '90%', backgroundColor: '#414449', marginBottom: 15, borderRadius: 10}}>
            <Pressable onPress={() => changeAccount(-1)} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5}}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: 'rgb(255,80,45)', width: 50, height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="money" size={30} color="white" />
                    </View>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 20}}>Suma</Text>
                </View>
                <Text style={{fontSize: 14, color: 'white'}}>{DB.selectSumFromTable('account', 'balance', -1, 'Active=1').balance} PLN</Text>
            </Pressable>
        </View>
        {props.value.map((row) => {
        return(
        <View style={{width: '90%', backgroundColor: '#414449', marginBottom: 15, borderRadius: 10}} key={row.Id}>
            <Pressable onPress={() => changeAccount(row.Id)} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 5}}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: `${row.Color}`, width: 50, height: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+DB.selectValueFromColumn('Icon', 'Picture', 'Id', row.IconId)[0].Picture }}
                            style={{ width: 30, height: 30}}
                        />
                    </View>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 20}}>{row.Name}</Text>
                </View>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {(row.Status == 1 ? null : <Entypo name="eye-with-line" size={24} color="grey" />)}
                    <Text style={{fontSize: 14, color: 'white', marginLeft: 10}}>{row.Balance} PLN</Text>
                </View>
            </Pressable>
        </View> 
        )})}
    </View>
    )
}

export default SelectAccount