import { View, Text, Pressable, Image, Modal, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import main from '../../settings/styles/Main'
import Entypo from '@expo/vector-icons/Entypo';
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
import HistoryAmount from '../../components/HistoryAmount';
import TransferSwitcher from '../../components/TransferSwitcher';
import BarGraph from '../../components/BarGraph';
import AddTransaction from '../../components/AddTransaction';
import Alert from '../../components/Alert';

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
    const [selectAccount, setSelectAccount] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [countClickCalendar, setCountClickCalendar] = useState(0);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [sumaIcon, setSumaIcon] = useState(DB.selectValueFromColumn('Icon', 'Picture', 'Id', setting.sumaIconId)[0] || {"Picture": "money-bill-wave-alt.png"});
    const [currentCategory, setCurrentCategory] = useState(-1);
    const [currentMonth, setCurrentMonth] = useState(new Date(DB.selectValueFromColumnCondition('planning', 'MAX(Date) as Date', ' Status=1 AND GroupsId='+user.currentGroupId)[0].Date));
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1, 0, 0, 0));
    const [lastDayOfMonth, setLastDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 0).getDate(), 0, 0, 0));
    const [analitycsChart, setAnalitycsChart] = useState([{name: Dictionary.Income[lang], color: '#6FF79B', procent: 0, amount: 0}, {name: Dictionary.Expenses[lang], color: '#E868B0', procent: 0, amount: 0}, {name: Dictionary.Savings[lang], color: '#FEFE75', procent: 0, amount: 0}]);
    const refRBSheetIncome = useRef();
    const refRBSheetExpanses = useRef();
    const [isAlertDate, setIsAlertDate] = useState(false);
    const [isAlertData, setIsAlertData] = useState(false);
    const [oldValue, setOldValue] = useState(0);
    const [editFinanceId, setEditFinanceId] = useState(-1);
    const [oldAccountId, setOldAccountId] = useState(-1);
    const [oldCategoryId, setOldCategoryId] = useState(-1);
    const [amountDate, setAmountDate] = useState('');
    const [amountDesc, setAmountDesc] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const data = DB.selectValueFromColumnCondition('groups', 'isOpenMonth, isCreatedAccount', 'Id='+user.currentGroupId)[0];
        if(data.isCreatedAccount==0) router.push('/home/accounts');
        else if(data.isOpenMonth==0) router.push('/home/planning');
    }, []);

    useEffect(() => {
        setAccountName(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1 AND GroupsId='+user.currentGroupId).nazwa)
        setAccountBalance(DB.selectSumFromTable('account', 'balance', accountId, 'Active=1 AND GroupsId='+user.currentGroupId).balance || 0);
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
        setMarkedDates(GF.getMarkedDates(fromDate, toDate));
      }, [dateType]);

    useEffect(() => {
        setMarkedDates(GF.getMarkedDates(fromDate, toDate));
    }, [date, transfer])

    useEffect(() => {
        const expencese = DB.selectValueFromColumnCondition('finance f', 'sum(f.Amount) as suma', 'f.Date BETWEEN "'+fromDate+'" AND "'+toDate+'" AND f.AccountCode IN (SELECT Code FROM account WHERE Active=1 AND GroupsId='+user.currentGroupId+' '+(accountId!=-1 ? "and Code="+accountId : "and 1=1")+') AND f.CategoryId IN (SELECT Id FROM category WHERE Type=1 AND (GroupsId='+user.currentGroupId+' OR GroupsId is null))')[0].suma;
        const income = DB.selectValueFromColumnCondition('finance f', 'sum(f.Amount) as suma', 'f.Date BETWEEN "'+fromDate+'" AND "'+toDate+'" AND f.AccountCode IN (SELECT Code FROM account WHERE Active=1 AND GroupsId='+user.currentGroupId+' '+(accountId!=-1 ? "and Code="+accountId : "and 1=1")+') AND f.CategoryId IN (SELECT Id FROM category WHERE Type=2 AND (GroupsId='+user.currentGroupId+' OR GroupsId is null))')[0].suma;
        const suma = expencese+income;
        const saving = (income-expencese);
        analitycsChart[0].amount = (income!=null ? parseFloat(income).toFixed(2) : 0);
        analitycsChart[0].procent = (income!=null ? (((income*100)/suma).toFixed(2)) : 0);
        analitycsChart[1].amount = (expencese!=null ? parseFloat(expencese).toFixed(2) : 0);
        analitycsChart[1].procent = (expencese!=null ? (((expencese*100)/suma).toFixed(2)) : 0);
        analitycsChart[2].amount = ((saving!=null && saving!=0) ? (parseFloat(saving).toFixed(2)) : 0);
        analitycsChart[2].procent = ((saving!=null && saving!=0) ? (((saving*100)/income).toFixed(2)) : 0);
    }, [accountId, displayedDate]);

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
                }else{
                    setCountClickCalendar(0);
                    if(fromDate > day.dateString){
                        setMarkedDates(GF.getMarkedDates(day.dateString, fromDate));
                        setToDate(fromDate);
                        setFromDate(day.dateString);
                        setDisplayedDate(day.dateString+' - '+toDate);
                        setDate(new Date(day.dateString));
                    }else{
                        setMarkedDates(GF.getMarkedDates(fromDate, day.dateString));
                        setToDate(day.dateString);
                        setDisplayedDate(fromDate+' - '+day.dateString);
                        setDate(new Date(day.dateString));
                    }
                    setOpenCalendar(false);
                }
              }}
        /></View></Modal>}
        {isAlertDate && <Alert text={Dictionary.CantDate[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertDate} />}
        {isAlertData && <Alert text={Dictionary.NotAllData[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertData} />}
        {isLoading && <Loading lang={lang}/>}
        {openSideMenu && <SideMenu lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={1} />}
        {selectAccount && <SelectAccount sumaIcon={sumaIcon.Picture} sumaColor={setting.sumaColor} value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id, Code', 'Active=1 AND GroupsId = '+user.currentGroupId+' AND Status', '0,1) ORDER BY (Code')} off={setSelectAccount} accId={setAccountId} suma={true} groupId={user.currentGroupId} />}
            <View style={global.topBox}>
                <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} onPress={() => setOpenSideMenu(true)} />
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
                    &nbsp;{accountName} <AntDesign name="caretdown" size={18} color="white" /></Text>
                </Pressable>
                <Text style={{...global.h3, fontSize: 18, marginTop: 10, marginBottom: 65}}>{accountBalance.toFixed(2)} PLN</Text>
                <TransferSwitcher setTransfer={setTransfer} transfer={transfer} lang={lang} />
            </View>
            <View style={{...global.MainBox}}>
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
                <View style={main.analitycsHolder}>
                {analitycsChart.map((item, index) => {
                    return <BarGraph item={item} key={index} />
                })}
                </View>
                <View style={main.addButtonHolder}>
                    <Pressable style={main.addButton} onPress={() => {refRBSheetExpanses.current.open(); setIsOpen(false);}}>
                        <View style={main.plusHolder}>
                            <Entypo name="plus" size={10} color="white" />
                        </View>
                        <Text style={main.addButtonText}>{Dictionary.AddExpencese[lang]}</Text>
                    </Pressable>
                    <Pressable style={main.addButton} onPress={() => {refRBSheetIncome.current.open(); setIsOpen(false);}}>
                        <View style={main.plusHolder}>
                            <Entypo name="plus" size={10} color="white" />
                        </View>
                        <Text style={main.addButtonText}>{Dictionary.AddIncome[lang]}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={{...global.contentBox, marginBottom: 455, marginTop:5}}>
                <Category currCat={currentCategory} setCurrCat={setCurrentCategory} accId={accountId} value={DB.selectFinance(accountId, fromDate, toDate, transfer, user.currentGroupId)} lang={lang} />
                <HistoryAmount setIsOpen={setIsOpen} financeId={setEditFinanceId} oldValue={setOldValue} oldAccountId={setOldAccountId} oldCategoryId={setOldCategoryId} amountDate={setAmountDate} amountDesc={setAmountDesc} refRBSheetExpanses={refRBSheetExpanses} refRBSheetIncome={refRBSheetIncome} setIsLoading={setIsLoading} firstDay={firstDayOfMonth} lastDay={lastDayOfMonth} groupid={user.currentGroupId} sessionKey={user.sessionKey} lang={lang} data={DB.selectValueFromColumnCondition('finance f INNER JOIN account a ON f.AccountCode = a.Code and a.Active=1 INNER JOIN category c ON f.CategoryId=c.Id', 'f.Id, c.Id as catId, a.Code as Code, a.Name as accName, (SELECT Picture FROM icon WHERE id = c.IconId) as catPict, c.Color as catColor, c.Type as catType, c.Name as catName, f.Date as Date, f.Amount as Amount, f.Description as Description', 'a.Active=1 and a.Status IN (0,1) and a.GroupsId='+user.currentGroupId+' and f.Date BETWEEN "'+fromDate+'" AND "'+toDate+'" '+(accountId!=-1 ? " and a.Code="+accountId : " and 1=1")+(transfer==0 ? " and 1=1" : " and c.Type="+transfer)+(currentCategory!=-1 ? " and c.Id="+currentCategory : " and 1=1")+' ORDER BY f.Date DESC, f.Id DESC')} />
                <AddTransaction isOpen={isOpen} setIsOpen={setIsOpen} financeId={editFinanceId} oldValue={oldValue} oldAccountId={oldAccountId} oldCategoryId={oldCategoryId} amountDate={amountDate} amountDesc={amountDesc} setIsLoading={setIsLoading} sessionKey={user.sessionKey} alertData={setIsAlertData} alertDate={setIsAlertDate} lang={lang} refRBSheet={refRBSheetExpanses} transfer={1} />
                <AddTransaction isOpen={isOpen} setIsOpen={setIsOpen} financeId={editFinanceId} oldValue={oldValue} oldAccountId={oldAccountId} oldCategoryId={oldCategoryId} amountDate={amountDate} amountDesc={amountDesc} setIsLoading={setIsLoading} sessionKey={user.sessionKey} alertData={setIsAlertData} alertDate={setIsAlertDate} lang={lang} refRBSheet={refRBSheetIncome} transfer={2} />
            </View>
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