import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign'
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import * as Variables from '../../settings/Dictionary/GlobalVaribales'
import Loading from '../../components/Loading';
import LockedInput from '../../components/LockedInput';
import PlanningHeader from '../../components/PlanningHeader';
import PlanningCategory from '../../components/PlanningCategory';
import * as GF from '../../settings/GlobalFunction';
import SummaryItem from '../../components/SummaryItem';
import axios from 'axios';
import PopupWindow from '../../components/PopupWindow';

const planning = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [isLoading, setIsLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(DB.selectValueFromColumnCondition('planning', 'MAX(Date) as Date', ' Status=1')[0].Date));
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1, 0, 0, 0));
    const [lastDayOfMonth, setLastDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 0).getDate(), 0, 0, 0));
    const [isClose, setIsClose] = useState(true);
    const [displayedDate, setDisplayedDate] = useState('');
    const [lastDayOfPreviusMonth, setLastDayOfPreviusMonth] = useState('');
    const [closeMonthWindow, setCloseMonthWindow] = useState(false);

    useEffect(() => {
        setFirstDayOfMonth(firstDayOfMonth.getFullYear()+'-'+GF.addZeroToDate(firstDayOfMonth.getMonth()+1)+'-'+GF.addZeroToDate(firstDayOfMonth.getDate()));
        setLastDayOfMonth(lastDayOfMonth.getFullYear()+'-'+GF.addZeroToDate(lastDayOfMonth.getMonth()+1)+'-'+GF.addZeroToDate(lastDayOfMonth.getDate()));
        if((new Date().getMonth() > currentMonth.getMonth() || new Date().getFullYear() > currentMonth.getFullYear()) && (currentMonth.getFullYear()>2000)){
            setIsClose(false);
            setDisplayedDate(Variables.monthOfYear[lang][currentMonth.getMonth()]+' '+currentMonth.getFullYear())
            let tempDate = new Date(GF.isNextYear(currentMonth),GF.isFirstMonthOfYear(currentMonth.getMonth()), 1, 0, 0, 0);
            tempDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            tempDate.setDate(0);
            setLastDayOfPreviusMonth(tempDate.getFullYear()+'-'+GF.addZeroToDate((tempDate.getMonth()+1))+'-'+tempDate.getDate());
        }
        else{
            setIsClose(true);
            console.log('pog')
            setDisplayedDate(Variables.monthOfYear[lang][new Date().getMonth()]+' '+new Date().getFullYear())
        }
    }, [])

    const closeMonthInDB = async () =>{
        const data = {
            year: currentMonth.getFullYear(),
            month: GF.addZeroToDate(currentMonth.getMonth()+1),
            groupsid: user.groupsid
        }
            try { 
            const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=close_month', data);
            if(result.data.response){
                DB.updateValue('planning','Status = 2','GroupsId IN ('+user.groupsid+') AND date like "'+currentMonth.getFullYear()+'-'+GF.addZeroToDate(currentMonth.getMonth()+1)+'-%"');
            }else console.log(result.data.error);
            }catch(err){
                console.log('err', err);
            }finally{
                router.push("/home/")
                setIsLoading(false);
            }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {isLoading && <Loading lang={lang}/>}
        {closeMonthWindow && <PopupWindow forYes={closeMonthInDB} forNo={setCloseMonthWindow} lang={lang} />}
        {isClose ? ( //Planning Month
            <>
            <View style={global.topBox}>
            <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} />
            <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase', marginTop: 10}}>{Dictionary.Planning[lang]}</Text>
            <Text style={{...global.h3, fontSize: 18, marginTop: 10, marginBottom: 20}}>{displayedDate}</Text>
            <View style={{...global.addButtonHolder, position: 'absolute', right: 5, top: 25}}>
                <Pressable style={global.addButton}>
                    <AntDesign name="arrowright" size={30} color="white" />
                </Pressable>
            </View>
            </View>
            <View style={global.MainBox}>
                
            </View>
            <View style={global.bottomBox}>
                <Pressable style={global.headerInput} onPress={() => {router.push("/home/");}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Finance[lang]}</Text>
                </Pressable>
                <View style={{...global.headerInput, ...global.chooseInput}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Planning[lang]}</Text>
                </View>
            </View> 
        </>
        ) : ( //Close Month
            <>
            <View style={global.topBox}>
            <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} />
            <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase', marginTop: 10}}>{Dictionary.CloseMonth[lang]}</Text>
            <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 40, fontWeight: '300'}}>{displayedDate}</Text>
            <View style={{...global.addButtonHolder, position: 'absolute', right: 5, top: 25}}>
                <Pressable style={global.addButton} onPress={() => setCloseMonthWindow(true)}>
                    <AntDesign name="check" size={30} color="white" />
                </Pressable>
            </View>
            </View>
            <ScrollView style={{...global.MainBox, marginTop: -25, marginBottom: 75}}>
                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Text style={{...global.h3, fontSize: 15}}>{Dictionary.AmountEnd[lang]} {Variables.monthOfYear[lang][GF.isFirstMonthOfYear(currentMonth.getMonth())]+' '+GF.isNextYear(currentMonth)}</Text>
                    <LockedInput value={DB.selectWithoutFrom('ROUND(IFNULL(sum(t1.Balance),0),2) as sumaPreviusMonth FROM account t1 JOIN (SELECT Name, MAX(UpdateDate) AS LatestDate FROM account WHERE Status=1 AND UpdateDate <= "'+lastDayOfPreviusMonth+'" GROUP BY Name) t2 ON t1.Name = t2.Name AND t1.UpdateDate = t2.LatestDate JOIN (SELECT Name, UpdateDate, MAX(Id) AS MaxId FROM account WHERE Status=1 AND UpdateDate <= "'+lastDayOfPreviusMonth+'" GROUP BY Name, UpdateDate) t3 ON t1.Name = t3.Name AND t1.UpdateDate = t3.UpdateDate AND t1.Id = t3.MaxId;')[0].sumaPreviusMonth} />
                </View>
                <PlanningHeader value={Dictionary.Expenses[lang]}/>
                <PlanningCategory lang={lang} close={true} income={false} data={DB.selectValueFromColumnCondition('category c LEFT JOIN icon i ON c.IconId = i.Id LEFT JOIN planning p ON p.CategoryId = c.Id AND p.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'" LEFT JOIN finance f ON f.CategoryId = c.Id AND f.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"', 'c.Name, c.Color, i.Picture, IFNULL(p.PlannedAmount, 0) AS PlannedAmount, ROUND(SUM(IFNULL(f.Amount, 0)), 2) AS Rzeczywiste', 'c.Type = 1 GROUP BY c.Name HAVING PlannedAmount>0 OR Rzeczywiste>0;')}/>
                <PlanningHeader value={Dictionary.Income[lang]}/>
                <PlanningCategory lang={lang} close={true} income={true} data={DB.selectValueFromColumnCondition('category c LEFT JOIN icon i ON c.IconId = i.Id LEFT JOIN planning p ON p.CategoryId = c.Id AND p.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'" LEFT JOIN finance f ON f.CategoryId = c.Id AND f.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"', 'c.Name, c.Color, i.Picture, IFNULL(p.PlannedAmount, 0) AS PlannedAmount, ROUND(SUM(IFNULL(f.Amount, 0)), 2) AS Rzeczywiste', 'c.Type = 2 GROUP BY c.Name HAVING PlannedAmount>0 OR Rzeczywiste>0;')}/>
                <PlanningHeader value={Dictionary.Summary[lang]}/>
                <View style={style.header}>
                    <Text style={{...style.headerText, marginRight: 20}}>{Dictionary.Planning[lang]}</Text>
                    <Text style={style.headerText}>{Dictionary.RealAmount[lang]}</Text>
                </View>
                <SummaryItem
                    tithePlanned={DB.selectValueFromColumnCondition('planning p', 'IFNULL(SUM(p.PlannedAmount), 0)*(0.1) as PlannedTithe', 'p.CategoryId IN (SELECT Id FROM Category WHERE Type=2) AND p.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"')[0]} 
                    realTithe={DB.selectValueFromColumnCondition('transfer t', 'IFNULL(SUM(t.Amount), 0) as RealTithe', 't.ToAccountId IN (SELECT Id FROM account WHERE Status=2) AND t.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"')[0]}
                    income={DB.selectValueFromColumnCondition('planning p', 'IFNULL(SUM(p.PlannedAmount), 0) as Income', 'p.CategoryId IN (SELECT Id FROM Category WHERE Type=2) AND p.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"')[0]}
                    realBonds={DB.selectValueFromColumnCondition('transfer t', 'IFNULL(SUM(t.Amount), 0) as RealBonds', 't.ToAccountId IN (SELECT Id FROM account WHERE Status=3) AND t.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"')[0]}
                    realAmount={DB.selectWithoutFrom('(SELECT ROUND(IFNULL(SUM(f.Amount), 0),2) FROM finance f WHERE f.CategoryId IN (SELECT Id FROM category WHERE Type=2) AND f.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'")-(SELECT IFNULL(SUM(t.Amount), 0) FROM transfer t WHERE t.ToAccountId IN (SELECT Id FROM account WHERE Status=2) AND t.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'")-(SELECT ROUND(IFNULL(SUM(t.Amount), 0),2) FROM transfer t WHERE t.ToAccountId IN (SELECT Id FROM account WHERE Status=3) AND t.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'")-(SELECT ROUND(IFNULL(SUM(f.Amount), 0),2) FROM finance f WHERE f.CategoryId IN (SELECT Id FROM category WHERE Type=1) AND f.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'") AS RealAmount')[0]}
                    plannedExpenses={DB.selectValueFromColumnCondition('planning p', 'ROUND(IFNULL(sum(p.PlannedAmount),0),2) as PlannedExpenses', 'p.CategoryId IN (select id from category WHERE Type=1) AND p.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'"')[0]}
                    lang={lang}
                />
            </ScrollView>
            <View style={global.bottomBox}>
                <Pressable style={global.headerInput} onPress={() => {router.push("/home/");}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Finance[lang]}</Text>
                </Pressable>
                <View style={{...global.headerInput, ...global.chooseInput}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Planning[lang]}</Text>
                </View>
            </View>  
        </>
        )}
        </View>
    </>
  )
}

const style = StyleSheet.create({
    header:{
        width: '95%',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    headerText:{
        fontSize: 11,
        color: '#FFF'
    }
})

export default planning