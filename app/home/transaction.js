import { View, Text, Pressable, TextInput, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import style from '../../settings/styles/Transaction'
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import Loading from '../../components/Loading';
import SelectAccount from '../../components/SelectAccount';
import PlanningHeader from '../../components/PlanningHeader';
import SelectCategory from '../../components/SelectCategory';
import * as GF from '../../settings/GlobalFunction'
import {Calendar} from 'react-native-calendars';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import axios from 'axios';
import AllCategory from '../../components/AllCategory'

const transaction = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [transfer, setTransfer] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState(''); //0
    const [accoundId, setAccountId] = useState(-1); //-1
    const [accoundInfo, setAccoundInfo] = useState(null);
    const [selectAccount, setSelectAccount] = useState(false);
    const [selectCategory, setSelectCategory] = useState(-1); //-1
    const [currentDate, setCurrentDate] = useState(new Date(DB.selectValueFromColumnCondition('planning p', 'MAX(Date) as currentDate', 'p.Status=1 AND p.GroupsId='+user.currentGroupId)[0].currentDate));
    const [fromDate, setFromDate] = useState(currentDate.getFullYear()+'-'+GF.addZeroToDate(currentDate.getMonth()+1)+'-01');
    const [toDate, setToDate] = useState(currentDate.getFullYear()+'-'+GF.addZeroToDate(currentDate.getMonth()+1)+'-'+new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate());
    const [categoryBalance, setCategoryBalance] = useState(DB.selectWithoutFrom('ROUND(IFNULL((SELECT IFNULL(PlannedAmount, 0) as suma FROM planning where CategoryId='+selectCategory+' AND Status=1), 0) - IFNULL((SELECT SUM(Amount) FROM finance WHERE CategoryId='+selectCategory+' AND Date BETWEEN "'+fromDate+'" AND "'+toDate+'"), 0), 2) as Balance;')[0].Balance);
    const [pickedDate, setPickedDate] = useState(Dictionary.PickDate[lang]); //Dictionary.PickDate[lang]
    const [openCalendar, setOpenCalendar] = useState(false);
    const [isAlertDate, setIsAlertDate] = useState(false);
    const [isAlertData, setIsAlertData] = useState(false);
    const [description, setDescription] = useState('');
    const [allCategory, setAllCategory] = useState(false);

    useEffect(() => {
        setAccoundInfo(DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON a.IconId = i.Id', 'a.Name, a.Balance, i.Picture, a.Color', 'a.Status IN (0,1) AND a.Active=1 AND a.Code = '+accoundId)[0]);
        setCategoryBalance(DB.selectWithoutFrom('ROUND(IFNULL((SELECT IFNULL(PlannedAmount, 0) as suma FROM planning where CategoryId='+selectCategory+' AND Status=1), 0) - IFNULL((SELECT SUM(Amount) FROM finance WHERE CategoryId='+selectCategory+' AND Date BETWEEN "'+fromDate+'" AND "'+toDate+'"), 0), 2) as Balance;')[0].Balance);
    }, [accoundId, selectCategory])

    const changeValue = (e) => {
        e = e.replace(',', '.');
        if((e.length-e.indexOf('.')>3 && e.indexOf('.')!=-1) || (e.split('.').length-1)>1) null
        else {
            if(e.length==1 && e=='.'){
                setValue('0'+e);
            }else {
                setValue(e);
            }
        }
    }

    const addTransaction = async () => {
        if(value=='' || accoundId==-1 || selectCategory==-1 || pickedDate.indexOf('-')<0 || description==''){
            setIsAlertData(true);
        }else{
            setIsLoading(true);
            const data = {
                categoryId: selectCategory,
                accountId: accoundId,
                amount: parseFloat(value),
                date: pickedDate,
                description: description,
                transfer: transfer
            }
            try {
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=add_finance', data);
                if(result.data.response){
                    DB.addFinance(accoundId, value, selectCategory, pickedDate, description);
                }else console.log(result.data.error);
            }catch(err) {
                console.log('err', err);
            }finally {
                setIsLoading(false);
                router.push("/home/")
            }
        }
    }


  return (
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {isLoading && <Loading lang={lang}/>}
        {isAlertDate && <Alert text={Dictionary.CantDate[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertDate} />}
        {isAlertData && <Alert text={Dictionary.NotAllData[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertData} />}
        {allCategory && <AllCategory value={DB.selectValueFromColumnCondition('category c INNER JOIN icon i ON c.IconId = i.Id', 'c.Id, c.Name, i.Picture, c.Color', '(c.GroupsId is NULL OR c.GroupsId='+user.currentGroupId+') AND c.Type='+transfer)} off={setAllCategory} cateId={setSelectCategory} />}
        {selectAccount && <SelectAccount value={DB.selectValueFromColumn('account', 'Name, Balance, IconId, Color, Status, Id, Code', 'Active=1 AND GroupsId='+user.currentGroupId+' AND Status', '0,1')} off={setSelectAccount} accId={setAccountId} suma={false} />}
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
                <AntDesign name="arrowleft" size={34} color="white" style={global.leftTopIcon} onPress={() => router.push("/home/")}/>
                <Text style={{...global.h3, marginTop:5}}>{Dictionary.Transaction[lang]}</Text>
                <View style={{...global.headerInputHolder, marginBottom: 10, marginTop: 20}}>
                    <Pressable style={{...global.headerInput, ...(transfer==1 && global.chooseInput)}} onPress={() => {setTransfer(1); setSelectCategory(-1)}}>
                        <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Expenses[lang]}</Text>
                    </Pressable>
                    <Pressable style={{...global.headerInput, ...(transfer==2 && global.chooseInput)}} onPress={() => {setTransfer(2); setSelectCategory(-1)}}>
                        <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Income[lang]}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={style.container}>
                <View style={style.inputHolder}>
                    <View style={style.inputHolderBox}></View>
                    <View style={{...style.inputHolderBox, alignItems: 'center', ...style.UnlockInput}}>
                        <TextInput 
                            value={value.toString()}
                            placeholder='0'
                            placeholderTextColor='#9EABB8'
                            onChangeText={e => changeValue(e)} 
                            style={style.UnlockInputFont}
                            keyboardType='numeric' />
                    </View>
                    <View style={style.inputHolderBox}>
                        <Text style={{...global.h3, textAlign: 'left'}}>PLN</Text>
                    </View>
                </View>
                <View style={style.alertHolder}>
                    {selectCategory!=-1 && (transfer==1 ? (
                        <Text style={{...style.alertText, color: (categoryBalance>0 ? '#95D8B0' : '#DF7977')}}>
                            {Dictionary.InCategory[lang]}
                            <Text style={{fontWeight: '400'}}> {DB.selectValueFromColumnCondition('category', 'Name', 'Id='+selectCategory)[0].Name} </Text>
                            {Dictionary.LeftMoney[lang]}
                            <Text style={{fontWeight: '400'}}> {categoryBalance}</Text>
                            <Text> PLN</Text>
                        </Text>
                    ) : (
                        <Text style={{...style.alertText, color: (categoryBalance>0 ? '#DF7977' : '#95D8B0')}}>
                            {Dictionary.InCategory[lang]}
                            <Text style={{fontWeight: '400'}}> {DB.selectValueFromColumnCondition('category', 'Name', 'Id='+selectCategory)[0].Name} </Text>
                            {Dictionary.MissMoney[lang]}
                            <Text style={{fontWeight: '400'}}> {categoryBalance}</Text>
                            <Text> PLN</Text>
                        </Text>
                    ))}
                </View>
                <Pressable style={style.pickAccount} onPress={() => setSelectAccount(true)}>
                    <View style={{backgroundColor: (accoundId==-1 || accoundInfo==undefined ? '#C8A2E6' : accoundInfo.Color), width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+(accoundId==-1 || accoundInfo==undefined ? 'question.png': accoundInfo.Picture) }}
                            style={{ width: 20, height: 20}}
                        />
                    </View>
                    <Text style={global.h4}>{accoundId==-1 || accoundInfo==undefined ? Dictionary.ChooseAccount[lang] : accoundInfo.Name}</Text>
                    <Text style={{...global.h4, fontWeight: '400', fontSize: 15}}>{accoundId==-1 || accoundInfo==undefined ? '--- ' : accoundInfo.Balance} PLN</Text>
                </Pressable>
                <PlanningHeader value={Dictionary.Category[lang]} style={{textAlign: 'left', fontSize: 18}}/>
                <SelectCategory 
                    setAllCategory={setAllCategory}
                    lang={lang} 
                    selectCategory={selectCategory} 
                    setSelectCategory={setSelectCategory} 
                    grid={DB.selectValueFromColumnCondition('category c INNER JOIN icon i ON c.IconId = i.Id', 'c.Id, c.Name, i.Picture, c.Color', '(c.GroupsId is NULL OR c.GroupsId='+user.currentGroupId+') AND c.Type='+transfer)}
                />
                <PlanningHeader style={{marginTop: -20}} />
                <Pressable style={style.pickAccount} onPress={() => setOpenCalendar(true)}>
                    <View style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign name="calendar" size={40} color="white" />
                    </View>
                    <View style={{width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={global.h3}>{pickedDate}</Text>
                    </View>
                </Pressable>
                <TextInput
                    style={{...style.pickAccount, color: 'white'}}
                    value={description.toString()}
                    placeholder={Dictionary.Description[lang]}
                    placeholderTextColor='#9EABB8'
                    onChangeText={e => setDescription(e)}
                />
            </View>
            <Button onPress={() => {addTransaction();}} name={Dictionary.SendBtn[lang]} style={{width: '50%'}} />
        </View>
    </>
  )
}

export default transaction