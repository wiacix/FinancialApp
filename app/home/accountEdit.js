import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import {  useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import global from '../../settings/styles/Global'
import Entypo from '@expo/vector-icons/Entypo';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import SideMenu from '../../components/SideMenu';
import colors from '../../settings/styles/colors';
import Loading from '../../components/Loading';
import styles from '../../settings/styles/Transaction'

const accountEdit = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [isLoading, setIsLoading] = useState(false);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const { name, value, color, picture, status } = useLocalSearchParams();
    const [accountName, setAccountName] = useState(name || '');
    const [accountValue, setAccountValue] = useState(value || '');
    const [accountColor, setAccountColor] = useState(color || '');
    const [accountPicture, setAccountPicture] = useState(picture || '');
    const [accountStatus, setAccountStatus] = useState(status || '');
    const [newAccount, setNewAccount] = useState((name==undefined ? true : false));

    const changeValue = (e) => {
        e = e.replace(',', '.');
        if((e.length-e.indexOf('.')>3 && e.indexOf('.')!=-1) || (e.split('.').length-1)>1) null
        else {
            if(e.length==1 && e=='.'){
                setAccountValue('0'+e);
            }else {
                setAccountValue(e);
            }
        }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {isLoading && <Loading lang={lang}/>}
        {openSideMenu && <SideMenu lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={3} />}
        <View style={global.topBox}>
            <Entypo name="menu" size={34} color="white" style={global.leftTopIcon}  onPress={() => setOpenSideMenu(true)}/>
            <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase', marginTop: 10, marginBottom: 40}}>{(accountName=='' ? Dictionary.AccountName[lang] : accountName)}</Text>
        </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{...global.MainBox, marginTop: -25, marginBottom: 55, paddingBottom: 20}}>
                <View style={styles.inputHolder}>
                    <View style={styles.inputHolderBox}></View>
                    <View style={{...styles.inputHolderBox, alignItems: 'center', ...styles.UnlockInput}}>
                        <TextInput 
                            value={(accountValue.toString())}
                            placeholder='0'
                            placeholderTextColor='#9EABB8'
                            onChangeText={e => changeValue(e)} 
                            style={styles.UnlockInputFont}
                            keyboardType='numeric' />
                    </View>
                    <View style={styles.inputHolderBox}>
                        <Text style={{...global.h3, textAlign: 'left'}}>PLN</Text>
                    </View>
                </View>
            </ScrollView> 
        </View>
    </>
  )
}

const style = StyleSheet.create({
    accountHolder: {
        width: '90%',
        paddingHorizontal: 7,
        paddingVertical: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.secondColor,
        marginVertical: 7,
        borderRadius: 10,
        shadowColor: '#000',
        backgroundColor: colors.contener,
        elevation: 20, // Dodaje cień w Androidzie
    },
    SumaHolder: {
        width: '90%',
        paddingHorizontal: 7,
        paddingVertical: 1,
        flexDirection: 'row',
    },
    iconHolder: {
        width: 45,
        height: 45,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstPart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    secondPart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    accountName: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10
    }
})

export default accountEdit