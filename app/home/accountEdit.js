import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import global from '../../settings/styles/Global';
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query';
import Loading from '../../components/Loading';
import styles from '../../settings/styles/Transaction'
import * as GF from '../../settings/GlobalFunction'
import SettingButton from '../../components/SettingButton';
import ChooseStatus from '../../components/ChooseStatus';
import ChooseIcon from '../../components/ChooseIcon';
import Button from '../../components/Button';
import axios from 'axios';
import PopupWindow from '../../components/PopupWindow';

const accountEdit = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [isLoading, setIsLoading] = useState(false);
    const { name, value, color, picture, status, code, idKonta } = useLocalSearchParams();
    const [accountCode, setAccountCode] = useState(code || -1);
    const [accountIdKonta, setAccountIdKonta] = useState(idKonta || -1);
    const [accountValue, setAccountValue] = useState(value || 0);
    const [accountColor, setAccountColor] = useState(color || 'rgb(123,123,123)');
    const [accountPicture, setAccountPicture] = useState(picture || 1);
    const [accountStatus, setAccountStatus] = useState(status || 1);
    const [newAccount, setNewAccount] = useState((name==undefined ? true : false));
    const [accountName, setAccountName] = useState(newAccount ? Dictionary.AccountName[lang] : name);
    const [chooseIcon, setChooseIcon] = useState(false);
    const [chooseStatus, setChooseStatus] = useState(false);
    const [chooseType, setChooseType] = useState(false);
    const [popUpWindow, setPopUpWindow] = useState(false);

    const TypeOfAccount = [
        {id: 1, name: Dictionary.NormalAccount[lang]},
        {id: 2, name: Dictionary.Tithe[lang]},
        {id: 3, name: Dictionary.Bonds[lang]}
    ]
    const TypeOfStatus = [
        {id: 0, name: Dictionary.UnActiveAccount[lang]},
        {id: 1, name: Dictionary.ActiveAccount[lang]}
    ]

    const AccountToDB = async () => {
        setIsLoading(true);
        const data = {
            idKonta: accountIdKonta,
            code: accountCode,
            value: parseFloat(accountValue),
            icon: accountPicture,
            color: accountColor,
            name: accountName,
            status: accountStatus,
            groupId: user.currentGroupId,
            sessionKey: user.sessionKey
        }
        if(newAccount){
            try {
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=add_account', data);
                if(result.data.response){
                    DB.addAccount(result.data.data[0], result.data.data[1], data, new Date());
                }else console.log(result.data.error);
            }catch(err) {
                console.log('err', err);
            }finally {
                router.push("/home/accounts/")
                setIsLoading(false);
            }
        }else{
            try {
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=update_account', data);
                if(result.data.response){
                    DB.updateAccount(result.data.data[0], result.data.data[1], data, new Date());
                }else console.log(result.data.error);
            }catch(err) {
                console.log('err', err);
            }finally {
                router.push("/home/accounts/")
                setIsLoading(false);
            }
        }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {isLoading && <Loading lang={lang}/>}
        {popUpWindow && <PopupWindow forYes={AccountToDB} forNo={setPopUpWindow} lang={lang} />}
        {chooseType && <ChooseStatus value={TypeOfAccount} onChange={setAccountStatus} onClose={setChooseType} />}
        {chooseStatus && <ChooseStatus value={TypeOfStatus} onChange={setAccountStatus} onClose={setChooseStatus} />}
        {chooseIcon && <ChooseIcon color={accountColor} icon={accountPicture} lang={lang} onChangeIcon={setAccountPicture} onChangeColor={setAccountColor} onClose={setChooseIcon} />}
        <View style={global.topBox}>
            <AntDesign name="arrowleft" size={34} color="white" style={global.leftTopIcon} onPress={() => router.push("/home/accounts")}/>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <TextInput style={{...global.h3, fontSize: 22}} value={accountName} onChangeText={e => setAccountName(e)}/>
                <AntDesign name="edit" size={24} color="grey" style={{marginLeft: 10}} />
            </View>
            <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 20, fontWeight: '300'}}>{DB.selectValueFromColumnCondition('groups', 'Name', 'Id='+user.currentGroupId)[0].Name}</Text>
        </View>
            <View style={{...styles.inputHolder, marginTop: 20}}>
                <View style={styles.inputHolderBox}></View>
                <View style={{...styles.inputHolderBox, alignItems: 'center', ...styles.UnlockInput}}>
                    <TextInput 
                        value={(accountValue.toString())}
                        placeholder='0'
                        placeholderTextColor='#9EABB8'
                        onChangeText={e => GF.changeValue(e, setAccountValue)} 
                        style={{...styles.UnlockInputFont, width: '100%', textAlign: 'center'}}
                        keyboardType='numeric' />
                </View>
                <View style={styles.inputHolderBox}>
                    <Text style={{...global.h3, textAlign: 'left'}}>PLN</Text>
                </View>
            </View>
            <View style={style.settingHolder}>
                <SettingButton name={Dictionary.Icon[lang]} picture={DB.selectValueFromColumnCondition('icon', 'Picture', 'id='+accountPicture)[0].Picture} color={accountColor} lock={false} onPress={setChooseIcon} />
                <SettingButton name={Dictionary.AccountType[lang]} status={(accountStatus==0 || accountStatus==1 ? Dictionary.NormalAccount[lang] : (accountStatus==2 ? Dictionary.Tithe[lang] : Dictionary.Bonds[lang]))} lock={!newAccount} new={newAccount} onPress={setChooseType} />
                <SettingButton name={Dictionary.AccountStatus[lang]} status={(accountStatus==1 ? Dictionary.ActiveAccount[lang] : Dictionary.UnActiveAccount[lang])} lock={(accountStatus==0 || accountStatus==1 ? false : true)} onPress={setChooseStatus} new={newAccount} />
                <SettingButton name={Dictionary.Currency[lang]} status='PLN' lock={true} />
            </View>
            <Button onPress={() => setPopUpWindow(true)} name={Dictionary.SendBtn[lang]} style={{width: '50%'}} />
        </View>
    </>
  )
}

const style = StyleSheet.create({
    settingHolder: {
        width: '90%',
    }
})

export default accountEdit