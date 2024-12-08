import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global';
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query';
import * as GF from '../../settings/GlobalFunction'
import Loading from '../../components/Loading';
import SettingButton from '../../components/SettingButton';
import Button from '../../components/Button';
import axios from 'axios';
import PopupWindow from '../../components/PopupWindow';
import { useLocalSearchParams } from 'expo-router';
import SelectAccount from '../../components/SelectAccount';
import InputDecimal from '../../components/InputDecimal';
import {Calendar} from 'react-native-calendars';
import Alert from '../../components/Alert';
import style from '../../settings/styles/Transaction';
import TransferHistory from '../../components/TransferHistory';

const accountTransfer = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [currentDate, setCurrentDate] = useState(new Date(DB.selectValueFromColumnCondition('planning p', 'MAX(Date) as currentDate', 'p.Status=1 AND p.GroupsId='+user.currentGroupId)[0].currentDate));
    const { type, edit, cash, id, fromAccId, toAccId, dateT, desc } = useLocalSearchParams();
    const [typeT, setTypeT] = useState(type);
    const [transferId, setTransferId] = useState(id || null);
    const [newTransfer, setNewTransfer] = useState(!edit ? true : false);
    const [oldamountCash, setOldAmountCash] = useState(cash || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [popUpWindow, setPopUpWindow] = useState(false);
    const [chooseFromAccount, setChooseFromAccount] = useState(false);
    const [fromAccountId, setFromAccountId] = useState(fromAccId || -1);
    const [chooseToAccount, setChooseToAccount] = useState(false);
    const [toAccountId, setToAccountId] = useState(toAccId || -1);
    const [amountCash, setAmountCash] = useState(cash || 0);
    const [changeAmountCash, setChangeAmountCash] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [pickedDate, setPickedDate] = useState(dateT || Dictionary.PickDate[lang]);
    const [isAlertDate, setIsAlertDate] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState(desc || '');
    const [isAlertData, setIsAlertData] = useState(false);
    const [popUpWindowDelete, setPopUpWindowDelete] = useState(false);
    const [deleteTransferId, setDeleteTransferId] = useState(null);

    const addTransfer = async () => {
        setIsLoading(true);
        if(fromAccountId==-1 || toAccountId==-1 || amountCash<=0 || pickedDate==Dictionary.PickDate[lang] || !descriptionValue){
            setIsLoading(false);
            setPopUpWindow(false);
            setIsAlertData(true);
        }else{
            const data = {
                fromAcc: fromAccountId,
                toAcc: toAccountId,
                value: parseFloat(amountCash)-parseFloat(oldamountCash),
                date: pickedDate,
                description: descriptionValue,
                groupId: user.currentGroupId,
                transferId: transferId
            }
            if(newTransfer){
                try {
                    const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=add_transfer', data);
                    if(result.data.response){
                        DB.addTransfer(data, result.data.transferId);
                    }else console.log(result.data);
                }catch(err) {
                    console.log('err', err);
                }finally {
                    setIsLoading(false);
                    router.push("/home/accounts");
                }
            }else{
                try {
                    const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=edit_transfer', data);
                    if(result.data.response){
                        DB.EditTransfer(data);
                    }else console.log(result.data.error);
                }catch(err) {
                    console.log('err', err);
                }finally {
                    router.push("/home/accounts");
                    setIsLoading(false);
                }
            }

        }
    }

    const deleteTransfer = async () => {
        if(deleteTransferId != null){
            setIsLoading(true);
            const data = {
                transferId: deleteTransferId,
                groupId: user.currentGroupId
            }
            try {
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=delete_transfer', data);
                console.log(result.data)
                if(result.data.response){
                    DB.deleteTransfer(data);
                }else console.log(result.data.error);
            }catch(err) {
                console.log('err', err);
            }finally {
                setIsLoading(false);
            }
        }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
            {isLoading && <Loading lang={lang}/>}
            {isAlertData && <Alert text={Dictionary.NotAllData[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertData} />}
            {isAlertDate && <Alert text={Dictionary.CantDate[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertDate} />}
            {popUpWindow && <PopupWindow forYes={() => {addTransfer(); setPopUpWindow(false)}} forNo={setPopUpWindow} lang={lang} />}
            {popUpWindowDelete && <PopupWindow forYes={() => {deleteTransfer(); setPopUpWindowDelete(false);}} forNo={setPopUpWindowDelete} lang={lang} />}
            {chooseFromAccount && <SelectAccount value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id, Code', 'Active=1 AND GroupsId='+user.currentGroupId+' AND Code NOT IN ('+toAccountId+') AND Status', '0,1,2,3')} off={setChooseFromAccount} accId={setFromAccountId} suma={false} />}
            {chooseToAccount && <SelectAccount value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id, Code', 'Active=1 AND GroupsId='+user.currentGroupId+' AND Code NOT IN ('+fromAccountId+') AND Status', '0,1,2,3')} off={setChooseToAccount} accId={setToAccountId} suma={false} />}
            {changeAmountCash && <InputDecimal value={amountCash} setValue={setAmountCash} OnPress={setChangeAmountCash} lang={lang} />}
            {openCalendar && <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 3, backgroundColor: '#000000B0'}}>
                <Calendar
                    firstDay={1}
                    onDayPress={day => {
                        if(day.year==currentDate.getFullYear() && day.month==(currentDate.getMonth()+1)){
                            setPickedDate(day.dateString)
                            setOpenCalendar(false);
                        }
                        else setIsAlertDate(true);
                    }}
                />
            </View>}
            <View style={global.topBox}>
                <AntDesign name="arrowleft" size={34} color="white" style={global.leftTopIcon} onPress={() => router.push("/home/accounts")}/>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{typeT==0  ? Dictionary.NewTransfer[lang] : (typeT==1 ? Dictionary.History[lang] : Dictionary.EditTransfer[lang])}</Text>
                </View>
                <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 20, fontWeight: '300'}}>{DB.selectValueFromColumnCondition('groups', 'Name', 'Id='+user.currentGroupId)[0].Name}</Text>
            </View>
                {typeT==0 || typeT==2 ? (
                    <>
                        <View style={{width: '90%'}}>
                            <SettingButton name={Dictionary.FromAccount[lang]} status={(fromAccountId==-1 ? Dictionary.ChooseAccount[lang] : DB.selectValueFromColumnCondition('account', 'Name', 'Active=1 AND Code='+fromAccountId)[0].Name)} colorText={fromAccountId!=-1 && DB.selectValueFromColumnCondition('account', 'Color', 'Active=1 AND Code='+fromAccountId)[0].Color} lock={transferId ? true : false} onPress={setChooseFromAccount} />
                            <SettingButton name={Dictionary.ToAccount[lang]} status={(toAccountId==-1 ? Dictionary.ChooseAccount[lang] : DB.selectValueFromColumnCondition('account', 'Name', 'Active=1 AND Code='+toAccountId)[0].Name)} colorText={toAccountId!=-1 && DB.selectValueFromColumnCondition('account', 'Color', 'Active=1 AND Code='+toAccountId)[0].Color} lock={transferId ? true : false} onPress={setChooseToAccount} />
                            <SettingButton name={Dictionary.Cash[lang]} status={parseFloat(amountCash).toFixed(2)+' PLN'} lock={false} onPress={setChangeAmountCash} />
                            <SettingButton name={Dictionary.PickDate[lang]} status={pickedDate} lock={false} onPress={setOpenCalendar} />
                            <TextInput placeholder={Dictionary.Description[lang]} value={descriptionValue} style={{...style.UnlockInputFont, width: '100%', backgroundColor: '#414449', borderRadius: 10, height: 60, paddingHorizontal: 10, marginTop: 20}} placeholderTextColor='#9EABB8' onChangeText={e => GF.changeValue(e, setDescriptionValue)} />
                        </View>
                        <Button onPress={() => setPopUpWindow(true)} name={typeT==0 ? Dictionary.SendBtn[lang] : Dictionary.Edit[lang]} style={{width: '50%'}} />
                    </>
                ) : (
                    <>
                        <ScrollView style={{width: '90%', paddingTop: 0, marginBottom: 70}}>
                            {DB.selectValueFromColumnCondition('transfer', '*', 'FromAccountCode IN (SELECT Code FROM account WHERE Active=1 AND GroupsId='+user.currentGroupId+') ORDER BY Date DESC').map((item, id) => {
                                return(
                                    <TransferHistory value={item} key={id} lang={lang} onDelete={setPopUpWindowDelete} setId={setDeleteTransferId}/>
                                )
                            })}
                        </ScrollView>
                    </>
                )}
            <View style={global.bottomBox}>
                <Pressable style={{...global.headerInput, ...((typeT==0 || typeT==2) && global.chooseInput)}} onPress={() => {setTypeT(0); setNewTransfer(true); setTransferId(null); setOldAmountCash(0); setFromAccountId(-1); setToAccountId(-1); setAmountCash(0); setPickedDate(Dictionary.PickDate[lang]); setDescriptionValue('');}}>
                    <Text style={{...global.h3, textTransform: 'uppercase'}}>{(typeT!=2 ? Dictionary.NewTransfer[lang] : Dictionary.EditTransfer[lang])}</Text>
                </Pressable>
                <Pressable style={{...global.headerInput, ...(typeT==1 && global.chooseInput)}} onPress={() => setTypeT(1)}>
                    <Text style={{...global.h3, textTransform: 'uppercase'}}>{Dictionary.History[lang]}</Text>
                </Pressable>
            </View>
        </View>
    </>
  )
}

export default accountTransfer