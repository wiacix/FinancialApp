import { View, Text, Pressable, Image, ScrollView, Modal } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import main from '../../settings/styles/Main'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import * as Variables from '../../settings/Dictionary/GlobalVaribales'
import Loading from '../../components/Loading';
import SelectAccount from '../../components/SelectAccount';
import Category from '../../components/Category';
import {Calendar} from 'react-native-calendars';
import * as GF from '../../settings/GlobalFunction';
import SideMenu from '../../components/SideMenu';

const index = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [setting, setSetting] = useState(DB.fetchConfig());
    const [transfer, setTransfer] = useState(setting.lastTransfer || 1);
    const [dateType, setDateType] = useState(setting.lastDateType || 0);
    const [displayedDate, setDisplayedDate] = useState('');
    const [date, setDate] = useState(!setting.lastFromDate || setting.lastFromDate=='null' ? new Date() : new Date(setting.lastFromDate));
    const [fromDate, setFromDate] = useState(!setting.lastFromDate || setting.lastFromDate=='null' ? new Date().toISOString().slice(0, 10) : setting.lastFromDate);
    const [toDate, setToDate] = useState(!setting.lastToDate || setting.lastToDate=='null' ? new Date().toISOString().slice(0, 10) : setting.lastToDate);
    const [isLoading, setIsLoading] = useState(false);
    const [accountId, setAccountId] = useState(setting.lastAccountCode || -1);
    const [accountName, setAccountName] = useState(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1 AND GroupsId='+user.currentGroupId).nazwa);
    const [accountBalance, setAccountBalance] = useState(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1 AND GroupsId='+user.currentGroupId).balance || 0);
    const [currentBalance, setCurrentBalance] = useState(DB.selectPeriodSum(accountId, fromDate, toDate, transfer, user.currentGroupId)[0].suma || 0);
    const [selectAccount, setSelectAccount] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [countClickCalendar, setCountClickCalendar] = useState(0);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [sumaIcon, setSumaIcon] = useState(DB.selectValueFromColumn('Icon', 'Picture', 'Id', setting.sumaIconId)[0] || {"Picture": "money-bill-wave-alt.png"});
    
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            if(DB.selectValueFromColumnCondition('account', 'count(*) as account', 'Status IN (0,1) AND Active=1 AND GroupsId='+user.currentGroupId)[0].account==0) router.push("/home/accounts");
            if(DB.selectValueFromColumnCondition('planning', 'count(*) as open', 'Status=1 AND GroupsId='+user.currentGroupId)[0].open == 0 && DB.selectValueFromColumnCondition('account', 'count(*) as account', 'Status IN (0,1) AND Active=1 AND GroupsId='+user.currentGroupId)[0].account!=0) router.push("/home/planning")
            setIsLoading(false);
        }, 500);
    }, [])

    useEffect(() => {
        setAccountName(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1 AND GroupsId='+user.currentGroupId).nazwa)
        setAccountBalance(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1 AND GroupsId='+user.currentGroupId).balance || 0)
        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, toDate, transfer, user.currentGroupId)[0].suma || 0);
    }, [accountId])

    function setDateView(change){
        if(dateType==0){
            const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+change)
            setFromDate(tempDate.getFullYear()+'-'+GF.addZeroToDate(tempDate.getMonth()+1)+'-'+GF.addZeroToDate(tempDate.getDate()));
            setToDate(tempDate.getFullYear()+'-'+GF.addZeroToDate(tempDate.getMonth()+1)+'-'+GF.addZeroToDate(tempDate.getDate()));
            setDate(tempDate);
            setDisplayedDate(tempDate.getDate()+" "+Variables.monthOfYear[lang][tempDate.getMonth()]+" "+tempDate.getFullYear()+", "+Variables.dayOfWeek[lang][tempDate.getDay()]);
        }else if(dateType==1){
            const tempDate = new Date(date.getTime()+(24 * 60 * 60 * 1000 * 7 * (change)));
            setDate(tempDate);
            const weekDay = tempDate.getDay();
            const entryWeek = new Date(tempDate.getTime()-(24 * 60 * 60 * 1000 * weekDay));
            setFromDate(entryWeek.getFullYear()+'-'+GF.addZeroToDate(entryWeek.getMonth()+1)+'-'+GF.addZeroToDate(entryWeek.getDate()));
            const endOfWeek = new Date(entryWeek.getTime()+(24 * 60 * 60 * 1000 * 6));
            setToDate(endOfWeek.getFullYear()+'-'+GF.addZeroToDate(endOfWeek.getMonth()+1)+'-'+GF.addZeroToDate(endOfWeek.getDate()));
            setDisplayedDate(GF.addZeroToDate(entryWeek.getDate())+"."+GF.addZeroToDate(entryWeek.getMonth()+1)+" - "+GF.addZeroToDate(endOfWeek.getDate())+"."+GF.addZeroToDate(endOfWeek.getMonth()+1));
        }else if(dateType==2){
            const tempDate = new Date(date.getFullYear(), date.getMonth()+change, date.getDate())
            setDate(tempDate);
            setFromDate(tempDate.getFullYear()+'-'+GF.addZeroToDate(tempDate.getMonth()+1)+'-01')
            setToDate(tempDate.getFullYear()+'-'+GF.addZeroToDate(tempDate.getMonth()+1)+'-'+(new Date(tempDate.getFullYear(), tempDate.getMonth()+1, 0).getDate()))
            setDisplayedDate(Variables.monthOfYear[lang][tempDate.getMonth()]+" "+tempDate.getFullYear());
        }else if(dateType==3){
            const tempDate = new Date(date.getFullYear()+change, date.getMonth(), date.getDate())
            setDate(tempDate);
            setFromDate(tempDate.getFullYear()+'-01-01');
            setToDate(tempDate.getFullYear()+'-12-31');
            setDisplayedDate(tempDate.getFullYear());
        }else if(dateType==4){
            setDisplayedDate(fromDate+' - '+toDate);
        }
    }

    useEffect(() => {
        DB.updateValue('settings', 'lastTransfer='+transfer+', lastDateType='+dateType+', lastFromDate="'+fromDate+'", lastToDate="'+toDate+'", lastAccountCode='+accountId+'', 'idGlobal='+setting.idGlobal);
    }, [dateType, fromDate, toDate, transfer, accountId])

    useEffect(() => {
        setDateView(0);
        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, toDate, transfer, user.currentGroupId)[0].suma || 0);
        setMarkedDates(GF.getMarkedDates(fromDate, toDate));
      }, [dateType]);

    useEffect(() => {
        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, toDate, transfer, user.currentGroupId)[0].suma || 0);
        setMarkedDates(GF.getMarkedDates(fromDate, toDate));
    }, [date, transfer])

    
    const [markedDates, setMarkedDates] = useState(GF.getMarkedDates(fromDate, toDate));

  return (
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {openCalendar && <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => setOpenCalendar(false)}><View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 3, backgroundColor: '#000000B0'}}><Calendar
            markingType={'period'}
            markedDates={markedDates}
            initialDate={fromDate}
            firstDay={1}
            onDayPress={day => {
                if(countClickCalendar==0){
                    setCountClickCalendar(1);
                    setMarkedDates(GF.getMarkedDates(day.dateString, day.dateString));
                    setFromDate(day.dateString);
                    setToDate(day.dateString);
                    setDisplayedDate(day.dateString+' - '+day.dateString);
                    setCurrentBalance(DB.selectPeriodSum(accountId, day.dateString, day.dateString, transfer, user.currentGroupId)[0].suma);
                }else{
                    setCountClickCalendar(0);
                    if(fromDate > day.dateString){
                        setMarkedDates(GF.getMarkedDates(day.dateString, fromDate));
                        setToDate(fromDate);
                        setFromDate(day.dateString);
                        setCurrentBalance(DB.selectPeriodSum(accountId, day.dateString, fromDate, transfer, user.currentGroupId)[0].suma);
                        setDisplayedDate(day.dateString+' - '+toDate);
                        setDate(new Date(day.dateString));
                    }else{
                        setMarkedDates(GF.getMarkedDates(fromDate, day.dateString));
                        setToDate(day.dateString);
                        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, day.dateString, transfer, user.currentGroupId)[0].suma);
                        setDisplayedDate(fromDate+' - '+day.dateString);
                        setDate(new Date(day.dateString));
                    }
                    setOpenCalendar(false);
                }
              }}
        /></View></Modal>}
        {isLoading && <Loading lang={lang}/>}
        {openSideMenu && <SideMenu lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={1} />}
        {selectAccount && <SelectAccount sumaIcon={sumaIcon.Picture} sumaColor={setting.sumaColor} value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id, Code', 'Active=1 AND GroupsId = '+user.currentGroupId+' AND Status', '0,1) ORDER BY (Code')} off={setSelectAccount} accId={setAccountId} suma={true} groupId={user.currentGroupId} />}
            <View style={global.topBox}>
                <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} onPress={() => setOpenSideMenu(true)} />
                <MaterialIcons name="history" size={34} color="white" style={global.rightTopIcon} onPress={() => router.push({pathname: '/home/historyAmount', params: {accId: accountId, backHref: '/home/'}})} />
                <Pressable onPress={() => setSelectAccount(true)} ><Text style={{...global.h3, marginTop:5}}>
                    {(accountId==-1 ? 
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+sumaIcon.Picture }}
                            style={{ width: 20, height: 20}}
                        /> : 
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+DB.selectValueFromColumn('Icon', 'Picture', 'Id', DB.selectSumFromTable('account', 'balance', accountId, 'Active=1').IconId)[0].Picture }}
                            style={{ width: 20, height: 20}}
                        />)}
                    &nbsp;{accountName} <AntDesign name="caretdown" size={18} color="white" /></Text></Pressable>
                <Text style={{...global.h3, fontSize: 18, marginTop: 10}}>{accountBalance.toFixed(2)} PLN</Text>
                <View style={global.headerInputHolder}>
                    <Pressable style={{...global.headerInput, ...(transfer==1 && global.chooseInput)}} onPress={() => setTransfer(1)}>
                        <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Expenses[lang]}</Text>
                    </Pressable>
                    <Pressable style={{...global.headerInput, ...(transfer==2 && global.chooseInput)}} onPress={() => setTransfer(2)}>
                        <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Income[lang]}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={global.MainBox}>
                <View style={main.dateHolder}>
                    <Pressable onPress={() => setDateType(0)}><Text style={{...main.dateHolderText, ...(dateType==0 && main.dateHolderTextChoose)}}>{Dictionary.Day[lang]}</Text></Pressable>
                    <Pressable onPress={() => setDateType(1)}><Text style={{...main.dateHolderText, ...(dateType==1 && main.dateHolderTextChoose)}}>{Dictionary.Week[lang]}</Text></Pressable>
                    <Pressable onPress={() => setDateType(2)}><Text style={{...main.dateHolderText, ...(dateType==2 && main.dateHolderTextChoose)}}>{Dictionary.Month[lang]}</Text></Pressable>
                    <Pressable onPress={() => setDateType(3)}><Text style={{...main.dateHolderText, ...(dateType==3 && main.dateHolderTextChoose)}}>{Dictionary.Year[lang]}</Text></Pressable>
                    <Pressable onPress={() => {setOpenCalendar(true); setDateType(4);}}><Text style={{...main.dateHolderText, ...(dateType==4 && main.dateHolderTextChoose)}}>{Dictionary.Custom[lang]}</Text></Pressable>
                </View>
                <View style={main.intervalHolder}>
                    <Pressable onPress={() => setDateView(-1)}><AntDesign name="caretleft" size={20} color="white"/></Pressable>
                    <Text style={main.intervalHolderText}>{displayedDate}</Text>
                    <Pressable onPress={() => setDateView(1)}><AntDesign name="caretright" size={20} color="white" /></Pressable>
                </View>
                <View style={global.ammountHolder}>
                    <Text style={global.h3}>{currentBalance ? currentBalance : '0'} PLN</Text>
                </View>
                <View style={global.addButtonHolder}>
                    <Pressable style={global.addButton} onPress={() => router.push({pathname: "/home/transaction", params: {accId: accountId, amountTransfer: transfer}})}>
                        <Entypo name="plus" size={30} color="white" />
                    </Pressable>
                </View>
            </View>
            <ScrollView style={{...global.contentBox, marginBottom: 80}}>
                <Category accId={accountId} transfer={transfer} value={DB.selectFinance(accountId, fromDate, toDate, transfer, user.currentGroupId)} totalAmount={DB.selectPeriodSum(accountId, fromDate, toDate, transfer, user.currentGroupId)[0].suma} />
            </ScrollView>
            <View style={global.bottomBox}>
                <View style={{...global.headerInput, ...global.chooseInput}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Finance[lang]}</Text>
                </View>
                <Pressable style={global.headerInput} onPress={() => {router.push("/home/planning");}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Planning[lang]}</Text>
                </Pressable>
            </View>
        </View>
    </>
  )
}

export default index