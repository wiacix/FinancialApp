import { View, Text, Pressable, Image, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import main from '../../settings/styles/Main'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import * as Variables from '../../settings/Dictionary/GlobalVaribales'
import Loading from '../../components/Loading';
import SelectAccount from '../../components/SelectAccount';
import Category from '../../components/Category';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import * as GF from '../../settings/GlobalFunction';


const index = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [transfer, setTransfer] = useState(1);
    const [dateType, setDateType] = useState(1);
    const [displayedDate, setDisplayedDate] = useState('');
    const [date, setDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
    const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
    const [isLoading, setIsLoading] = useState(false);
    const [accountId, setAccountId] = useState(-1);
    const [accountName, setAccountName] = useState(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1').nazwa);
    const [accountBalance, setAccountBalance] = useState(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1').balance);
    const [currentBalance, setCurrentBalance] = useState(DB.selectPeriodSum(accountId, fromDate, toDate, transfer)[0].suma);
    const [selectAccount, setSelectAccount] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [countClickCalendar, setCountClickCalendar] = useState(0);

    useEffect(() => {
        setAccountName(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1').nazwa)
        setAccountBalance(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1').balance)
        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, toDate, transfer)[0].suma);
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
        }
    }

    useEffect(() => {
        setDateView(0);
        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, toDate, transfer)[0].suma);
        setMarkedDates(GF.getMarkedDates(fromDate, toDate));
      }, [dateType]);

    useEffect(() => {
        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, toDate, transfer)[0].suma);
        setMarkedDates(GF.getMarkedDates(fromDate, toDate));
    }, [date, transfer])

    
    const [markedDates, setMarkedDates] = useState(GF.getMarkedDates(fromDate, toDate));
    
  return (
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {openCalendar && <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 3, backgroundColor: '#000000B0'}}><Calendar
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
                    setCurrentBalance(DB.selectPeriodSum(accountId, day.dateString, day.dateString, transfer)[0].suma);
                }else{
                    setCountClickCalendar(0);
                    if(fromDate > day.dateString){
                        setMarkedDates(GF.getMarkedDates(day.dateString, fromDate));
                        setToDate(fromDate);
                        setFromDate(day.dateString);
                        setCurrentBalance(DB.selectPeriodSum(accountId, day.dateString, fromDate, transfer)[0].suma);
                        setDisplayedDate(day.dateString+' - '+toDate);
                        setDate(new Date(day.dateString));
                    }else{
                        setMarkedDates(GF.getMarkedDates(fromDate, day.dateString));
                        setToDate(day.dateString);
                        setCurrentBalance(DB.selectPeriodSum(accountId, fromDate, day.dateString, transfer)[0].suma);
                        setDisplayedDate(fromDate+' - '+day.dateString);
                        setDate(new Date(day.dateString));
                    }
                    setOpenCalendar(false);
                }
              }}
        /></View>}
        {isLoading && <Loading lang={lang}/>}
        {selectAccount && <SelectAccount value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id', 'Active=1 AND Status', '0,1')} off={setSelectAccount} accId={setAccountId}/>}
            <View style={global.topBox}>
                <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} />
                <Pressable onPress={() => setSelectAccount(true)} ><Text style={{...global.h3, marginTop:5}}>
                    {(accountId==-1 ? <FontAwesome name="money" size={20} color="white" /> : 
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+DB.selectValueFromColumn('Icon', 'Picture', 'Id', DB.selectSumFromTable('account', 'balance', accountId, 'Active=1').IconId)[0].Picture }}
                            style={{ width: 20, height: 20}}
                        />)}
                    {accountName} <AntDesign name="caretdown" size={18} color="white" /></Text></Pressable>
                <Text style={{...global.h3, fontSize: 18, marginTop: 10}}>{accountBalance} PLN</Text>
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
                    <Pressable style={global.addButton}>
                        <Entypo name="plus" size={30} color="white" />
                    </Pressable>
                </View>
            </View>
            <ScrollView style={global.contentBox}>
                <Category value={DB.selectFinance(accountId, fromDate, toDate, transfer)} totalAmount={DB.selectPeriodSum(accountId, fromDate, toDate, transfer)[0].suma} />
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