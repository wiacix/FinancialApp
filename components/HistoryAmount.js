import { View, Image, ScrollView, Pressable, Text } from 'react-native'
import React, { useState } from 'react'
import * as GF from '../settings/GlobalFunction'
import { axios } from 'axios'
import Loading from './Loading';
import PopupWindow from './PopupWindow';
import Dictionary from '../settings/Dictionary/Dictionary';
import { router } from 'expo-router';

const HistoryAmount = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [popUpWindow, setPopUpWindow] = useState(false);
    const [id, setId] = useState(-1);
    const [transfer, setTransfer] = useState(-1);
    const [value, setValue] = useState(-1);
    const [date, setDate] = useState('');
    const [accCode, setAccCode] = useState(-1);
    const [category, setCategory] = useState(-1);
    const [description, setDescription] = useState('');
    
    const deleteFinance = async () => {
        setIsLoading(true);
        const data = {
            id: id,
            groupid: props.groupid,
            transfer: transfer,
            value: value,
            sessionKey: props.sessionKey
        }
        try {
            const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=deleteFinance', data);
            if(result.data.response){
                DB.deleteFinance(data);
            }else console.log(result.data);
        }catch(err) {
            console.log('err', err);
        }finally {
            router.push("/home/")
            setIsLoading(false);
            setPopUpWindow(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={{alignItems: 'flex-start', gap: 7}} style={{marginTop: 5}}>
        {isLoading && <Loading lang={props.lang}/>}
        {popUpWindow && <PopupWindow forClose={setPopUpWindow} forYes={deleteFinance} forEdit={() => router.push({pathname: '/home/transaction', params: { financeId: id, amount: value, accId: accCode, cateId: category, amountDate: date, amountDesc: description, amountTransfer: transfer }})} lang={props.lang} yes={Dictionary.Delete[props.lang]} no={Dictionary.Edit[props.lang]} text={Dictionary.AmountAction[props.lang]} />}
        {props.data.map((item) => {
            return (
                    <Pressable key={item.Id} style={{flexDirection: 'row', gap: 7}} onPress={() => {(new Date(item.Date)>=props.firstDay && new Date(item.Date)<=props.lastDay) && setPopUpWindow(true); setId(item.Id); setTransfer(item.catType); setValue(item.Amount); setAccCode(item.Code); setCategory(item.catId); setDate(item.Date); setDescription(item.Description)}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: GF.convertColor(item.catColor, '55')}}>
                                <Image
                                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.catPict}}
                                    style={{ width: 20, height: 20}}
                                />
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={{color: 'white'}}>{item.Description}</Text>
                            <Text style={{color: 'grey', fontSize: 13}}>{item.accName}</Text>
                        </View>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={{color: 'white', textAlign: 'right'}}>{item.Amount.toFixed(2)} PLN</Text>
                            <Text style={{color: 'grey', textAlign: 'right', fontSize: 13}}>{item.Date}</Text>
                        </View>
                    </Pressable>
            )
        })}
        </ScrollView>
    )
}

export default HistoryAmount