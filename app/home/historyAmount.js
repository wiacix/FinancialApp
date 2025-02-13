import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import global from '../../settings/styles/Global'
import { AntDesign } from '@expo/vector-icons';
import * as DB from '../../settings/SQLite/query'
import * as GF from '../../settings/GlobalFunction'
import PlanningHeader from '../../components/PlanningHeader';
import colors from '../../settings/styles/colors';
import axios from 'axios';
import PopupWindow from '../../components/PopupWindow';
import Loading from '../../components/Loading';
import SelectAccount from '../../components/SelectAccount';
import Dictionary from '../../settings/Dictionary/Dictionary';
import Entypo from '@expo/vector-icons/Entypo';

const DateValue = (props) => {
    return (
        <PlanningHeader value={props.date} style={{textAlign: 'left', fontSize: 14, fontWeight: '400', marginBottom: 2}}/>
    )
}

const accounts = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [setting, setSetting] = useState(DB.fetchConfig());
    const [currentMonth, setCurrentMonth] = useState(new Date(DB.selectValueFromColumnCondition('planning', 'MAX(Date) as Date', ' Status=1 AND GroupsId='+user.currentGroupId)[0].Date));
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1, 0, 0, 0));
    const [lastDayOfMonth, setLastDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 0).getDate(), 0, 0, 0));
    const { accId, backHref } = useLocalSearchParams();
    const [backHrefLink, setBackHrefLink] = useState(backHref || '/home/');
    const [accountId, setAccountId] = useState(accId || -1);
    const [accountInfo, setAccountInfo] = useState((accId==-1 ? (DB.selectValueFromColumnCondition('settings s INNER JOIN icon i ON s.sumaIconId = i.id', '"Suma" as Name, s.sumaColor as Color, i.Picture as Picture', '1=1')[0]) : (DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON a.IconId = i.Id', 'a.Name as Name, a.Color as Color, i.Picture as Picture', 'a.Active=1 AND Code='+accId)[0])) || {"Name": "Suma", "Color": "rgb(100,100,100)", "Picture": "money-bill-wave-alt.png"});
    const [currentMonthFinance, setCurrentMonthFinance] = useState([]);
    const [otherMonthFinance, setOtherMonthFinance] = useState([]);
    const [popUpWindow, setPopUpWindow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [financeToDelete, setFinanceToDelete] = useState(-1);
    const [financeToDeleteValue, setFinanceToDeleteValue] = useState(-1);
    const [selectAccount, setSelectAccount] = useState(false);
    const [sumaIcon, setSumaIcon] = useState(DB.selectValueFromColumn('Icon', 'Picture', 'Id', setting.sumaIconId)[0] || {"Picture": "money-bill-wave-alt.png"});

    useEffect(() => {
        setAccountInfo(accountId==-1 ? (DB.selectValueFromColumnCondition('settings s INNER JOIN icon i ON s.sumaIconId = i.id', '"Suma" as Name, s.sumaColor as Color, i.Picture as Picture', '1=1')[0]) : (DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON a.IconId = i.Id', 'a.Name as Name, a.Color as Color, i.Picture as Picture', 'a.Active=1 AND Code='+accountId)[0]));
    }, [accountId])

    useEffect(() => {
        setFirstDayOfMonth(firstDayOfMonth.getFullYear()+'-'+GF.addZeroToDate(firstDayOfMonth.getMonth()+1)+'-'+GF.addZeroToDate(firstDayOfMonth.getDate()));
        setLastDayOfMonth(lastDayOfMonth.getFullYear()+'-'+GF.addZeroToDate(lastDayOfMonth.getMonth()+1)+'-'+GF.addZeroToDate(lastDayOfMonth.getDate()));
    }, []);

    useEffect(() => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; 
        if(regex.test(firstDayOfMonth)){
            setCurrentMonthFinance(DB.selectValueFromColumnCondition('finance f INNER JOIN account a ON f.AccountCode = a.Code and a.Active=1 INNER JOIN category c ON f.CategoryId=c.Id', 'f.Id, c.Id as catId, a.Code as Code, a.Name as accName, (SELECT Picture FROM icon WHERE id = c.IconId) as catPict, c.Color as catColor, c.Type as catType, c.Name as catName, f.Date as Date, f.Amount as Amount, f.Description as Description', 'a.Active=1 and a.Status IN (0,1) and a.GroupsId='+user.currentGroupId+' and f.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'" '+(accountId!=-1 ? "and a.Code="+accountId : "and 1=1")+' ORDER BY f.Date DESC'))
            setOtherMonthFinance(DB.selectValueFromColumnCondition('finance f INNER JOIN account a ON f.AccountCode = a.Code and a.Active=1 INNER JOIN category c ON f.CategoryId=c.Id', 'f.Id, c.Id as catId, a.Code as Code, a.Name as accName, (SELECT Picture FROM icon WHERE id = c.IconId) as catPict, c.Color as catColor, c.Type as catType, c.Name as catName, f.Date as Date, f.Amount as Amount, f.Description as Description', 'a.Active=1 and a.Status IN (0,1) and a.GroupsId='+user.currentGroupId+' and f.Date < "'+firstDayOfMonth+'" '+(accountId!=-1 ? "and a.Code="+accountId : "and 1=1")+' ORDER BY f.Date DESC'))
        }
        
    },[firstDayOfMonth, lastDayOfMonth, accountId])

    const deleteFinance = async () => {
        setIsLoading(true);
        const data = {
            id: financeToDelete,
            groupid: user.currentGroupId,
            transfer: categoryTransfer,
            value: financeToDeleteValue,
            sessionKey: user.sessionKey
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
        }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        <View style={{position: 'absolute', bottom: 10, right: 30, zIndex: 5}}>
            <Pressable style={global.addButton} onPress={() => router.push({pathname: "/home/transaction", params: {accId: accountId, amountTransfer: 1}})}>
                <Entypo name="plus" size={30} color="white" />
            </Pressable>
        </View>
        {isLoading && <Loading lang={lang}/>}
        {popUpWindow && <PopupWindow forYes={deleteFinance} forNo={setPopUpWindow} lang={lang} />}
        {selectAccount && <SelectAccount sumaIcon={sumaIcon.Picture} sumaColor={setting.sumaColor} value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id, Code', 'Active=1 AND GroupsId = '+user.currentGroupId+' AND Status', '0,1) ORDER BY (Code')} off={setSelectAccount} accId={setAccountId} suma={true} groupId={user.currentGroupId} />}
            <View style={global.topBox}>
                <AntDesign name="arrowleft" size={34} color="white" style={global.leftTopIcon} onPress={() => router.push(backHrefLink)}/>
                <Pressable onPress={() => setSelectAccount(true)} ><Text style={{...global.h3, marginTop:5}}>
                    <Image
                        source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+accountInfo.Picture }}
                        style={{ width: 20, height: 20}}
                    />
                    &nbsp;{accountInfo.Name} <AntDesign name="caretdown" size={18} color="white" /></Text>
                </Pressable>
                <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 40, fontWeight: '300'}}>{DB.selectValueFromColumnCondition('groups', 'Name', 'Id='+user.currentGroupId)[0].Name || 'GroupName'}</Text>
                <View style={{backgroundColor: `${accountInfo.Color}`, width: 60, height: 60, borderRadius: 50, position: 'absolute', right: 10, top: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+accountInfo.Picture}}
                        style={{ width: 35, height: 35}}
                    />
                </View>
            </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{...global.MainBox, marginTop: -25, paddingBottom: 20}}>
                {currentMonthFinance.length>0 && currentMonthFinance.map((row, id) => {
                    return (
                        <View key={id} style={style.itemHolder}>
                            {(id>0 ? (currentMonthFinance[id-1].Date!=row.Date && <DateValue date={row.Date} />) : <DateValue date={row.Date} />)}
                            <View style={style.financeHolder}>
                                <View style={{flexDirection: 'row', width: '100%'}}>
                                    <View style={{backgroundColor: `${row.catColor}`, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                                        <Image
                                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.catPict}}
                                            style={{ width: 25, height: 25}}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'column', marginLeft: 4}}>
                                        <Text style={{fontSize: 14, color: colors.headerText, maxWidth: 110}} numberOfLines={1} ellipsizeMode='tail'>{row.catName}</Text>
                                        <Text style={{fontSize: 12, color: colors.greyColor}}>{row.accName}</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontSize: 16, color: (row.catType==1 ? '#fe9e95' : '#b7d5ac')}}>{(row.catType==1 ? '-' : '+')} {row.Amount.toFixed(2)} PLN</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Pressable onPress={() => router.push({pathname: '/home/transaction', params: { financeId: row.Id, amount: row.Amount, accId: row.Code, cateId: row.catId, amountDate: row.Date, amountDesc: row.Description, amountTransfer: row.catType }})} style={{marginRight: 6}}><AntDesign name="edit" size={24} color="white" style={style.iconHolder} /></Pressable>
                                        <Pressable onPress={() => {setFinanceToDelete(row.Id); setFinanceToDeleteValue(row.Amount); setPopUpWindow(true);}} ><AntDesign name="delete" size={24} color="white" style={style.iconHolder}/></Pressable>
                                    </View>
                                </View>
                                <Text style={{color: colors.placeholderText, marginTop: 2, fontSize: 13}}>{row.Description}</Text>
                            </View>
                        </View>
                    )
                })}
                {otherMonthFinance.length>0 && otherMonthFinance.map((row, id) => {
                    return (
                        <View key={id} style={style.itemHolder}>
                            {(id>0 ? (otherMonthFinance[id-1].Date!=row.Date && <DateValue date={row.Date} />) : <DateValue date={row.Date} />)}
                            <View style={style.financeHolder}>
                                <View style={{flexDirection: 'row', width: '100%'}}>
                                    <View style={{backgroundColor: `${row.catColor}`, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                                        <Image
                                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.catPict}}
                                            style={{ width: 25, height: 25}}
                                        />
                                    </View>
                                    <View style={{flexDirection: 'column', marginLeft: 4}}>
                                        <Text style={{fontSize: 14, color: colors.headerText, maxWidth: 110}} numberOfLines={1} ellipsizeMode='tail'>{row.catName}</Text>
                                        <Text style={{fontSize: 12, color: colors.greyColor}}>{row.accName}</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 16, color: (row.catType==1 ? '#fe9e95' : '#b7d5ac')}}>{(row.catType==1 ? '-' : '+')} {row.Amount.toFixed(2)} PLN</Text>
                                    </View>
                                </View>
                                <Text style={{color: colors.placeholderText, marginTop: 2, fontSize: 13}}>{row.Description}</Text>
                            </View>
                        </View>
                    )
                })}
                {(otherMonthFinance.length<=0 && currentMonthFinance.length<=0) && <Text style={{...global.h3, marginTop:5}}>{Dictionary.EmptySet[lang]}</Text>}
            </ScrollView> 
        </View>
    </>
  )
}

const style = StyleSheet.create({
    itemHolder: {
        width: '100%',
        alignItems: 'center'
    },
    financeHolder: {
        width: '90%',
        paddingHorizontal: 7,
        paddingVertical: 1,
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: colors.secondColor,
        paddingVertical: 3,
        marginVertical: 3,
        borderRadius: 10,
        backgroundColor: colors.contener,
    },
    iconHolder: {
        marginHorizontal: 2
    }
})

export default accounts