import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import SideMenu from '../../components/SideMenu';
import LockedInput from '../../components/LockedInput';
import colors from '../../settings/styles/colors';

const accounts = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [accountList, setAccountList] = useState(DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON a.IconId=i.Id', 'a.Code, a.Name, a.Balance, i.Picture, a.Color, a.Status, i.id, a.id as idKonta', 'Active=1 AND GroupsId='+user.currentGroupId+' ORDER BY CASE WHEN Status=1 THEN 0 WHEN Status=0 THEN 1 ELSE 2 END ASC, Status ASC'))
    const [accountSuma, setAccountSuma] = useState(DB.selectValueFromColumnCondition('account', 'ROUND(sum(Balance), 2) as Suma', 'Status=1 AND Active=1 AND GroupsId='+user.currentGroupId)[0].Suma);

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {openSideMenu && <SideMenu lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={3} />}
        <View style={global.topBox}>
            <Entypo name="menu" size={34} color="white" style={global.leftTopIcon}  onPress={() => setOpenSideMenu(true)}/>
            <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase', marginTop: 10}}>{Dictionary.Accounts[lang]}</Text>
            <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 40, fontWeight: '300'}}>{DB.selectValueFromColumnCondition('groups', 'Name', 'Id='+user.currentGroupId)[0].Name}</Text>
            <View style={{position: 'absolute', right: 7, top: 7}}>
                <Pressable style={global.addButton} onPress={() => router.push("/home/accountEdit")}>
                    <Entypo name="plus" size={30} color="white" />
                </Pressable>
            </View>
        </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{...global.MainBox, marginTop: -25, marginBottom: 65, paddingBottom: 20}}>
                {accountList.map((item, index) => {
                    return (
                        <View key={index}>
                            {item.Status==2 && (
                                <>
                                    <Text style={{width: '90%', marginTop: 10, color: 'white', fontSize: 14, fontWeight: '400'}}>{Dictionary.Tithe[lang]}</Text>
                                    <View style={{width: '95%', marginVertical: 3, borderTopWidth: 1, borderTopColor: 'white'}} />
                                </>
                            )}
                            {item.Status==3 && (
                                <>
                                    <Text style={{width: '90%', marginTop: 10, color: 'white', fontSize: 14, fontWeight: '400'}}>{Dictionary.Bonds[lang]}</Text>
                                    <View style={{width: '95%', marginVertical: 3, borderTopWidth: 1, borderTopColor: 'white'}} />
                                </>
                            )}
                            <Pressable style={style.accountHolder} onPress={() => router.push({pathname: '/home/accountEdit', params: {name: item.Name, value: item.Balance, color: item.Color, picture: item.id, status: item.Status, code: item.Code, idKonta: item.idKonta}})}>
                                <View style={style.firstPart}>
                                    <View style={{...style.iconHolder, backgroundColor: item.Color}}>
                                        <Image
                                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.Picture}}
                                            style={{ width: 30, height: 30}}
                                        />
                                    </View>
                                    <Text style={{...style.accountName, fontWeight: (item.Status==1 ? '600' : '300')}}>{item.Name}</Text>
                                </View>
                                <View style={style.secondPart}>
                                    {(item.Status == 1 ? null : <Entypo name="eye-with-line" size={24} color="grey" style={{marginRight: 10}} />)}
                                    <LockedInput value={item.Balance} />
                                </View>
                            </Pressable>
                        </View>
                    )
                })}
                <View style={{width: '95%', marginVertical: 7, borderTopWidth: 2, borderTopColor: 'white'}} />
                <View style={style.SumaHolder}>
                    <View style={style.firstPart}>
                        <View style={{...style.iconHolder, backgroundColor: 'rgb(255,80,45)'}}>
                            <FontAwesome name="money" size={30} color="white" />
                        </View>
                        <Text style={{...style.accountName, fontWeight: '700'}}>{Dictionary.Suma[lang]}</Text>
                    </View>
                    <View style={style.secondPart}>
                        <LockedInput value={accountSuma} />
                    </View>
                </View>
            </ScrollView>
            <View style={global.bottomBox}>
                <Pressable style={global.headerInput} onPress={() => {router.push({pathname: '/home/accountTransfer', params: {type: 0}})}}>
                    <Text style={{...global.h3, textTransform: 'uppercase'}}>{Dictionary.NewTransfer[lang]}</Text>
                </Pressable>
                <Pressable style={{...global.headerInput}} onPress={() => {router.push({pathname: '/home/accountTransfer', params: {type: 1}})}}>
                    <Text style={{...global.h3, textTransform: 'uppercase'}}>{Dictionary.History[lang]}</Text>
                </Pressable>
            </View>  
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
        elevation: 20,
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

export default accounts