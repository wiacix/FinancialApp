import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import global from '../../settings/styles/Global'
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import * as GF from '../../settings/GlobalFunction'
import PlanningHeader from '../../components/PlanningHeader';
import colors from '../../settings/styles/colors';

const DateValue = (props) => {
    return (
        <PlanningHeader value={props.date} style={{textAlign: 'left', fontSize: 14, fontWeight: '400', marginBottom: 2}}/>
    )
}

const accounts = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [currentMonth, setCurrentMonth] = useState(new Date(DB.selectValueFromColumnCondition('planning', 'MAX(Date) as Date', ' Status=1 AND GroupsId='+user.currentGroupId)[0].Date));
    const [firstDayOfMonth, setFirstDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1, 0, 0, 0));
    const [lastDayOfMonth, setLastDayOfMonth] = useState(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 0).getDate(), 0, 0, 0));
    const { name, id, picture, color, transfer } = useLocalSearchParams();
    const [categoryTransfer, setCategoryTransfer] = useState(transfer || 2);
    const [categoryName, setCategoryName] = useState(name || 'Nazwa kategorii');
    const [categoryId, setCategoryId] = useState(id || -1);
    const [categoryPicture, setCategoryPicture] = useState(picture || 'question.png');
    const [categoryColor, setCategoryColor] = useState(color || 'rgb(123,123,123)');
    const [categorySuma, setCategorySuma] = useState(DB.selectValueFromColumnCondition('finance f', 'ROUND(sum(IFNULL(f.Amount, 0)), 2) as suma', 'f.CategoryId = '+categoryId+' and f.AccountCode IN (select Code from account where Active=1 and status in (0,1) and GroupsId = '+user.currentGroupId+')')[0].suma || 0)
    const [currentMonthFinance, setCurrentMonthFinance] = useState([]);
    const [otherMonthFinance, setOtherMonthFinance] = useState([]);

    useEffect(() => {
        setFirstDayOfMonth(firstDayOfMonth.getFullYear()+'-'+GF.addZeroToDate(firstDayOfMonth.getMonth()+1)+'-'+GF.addZeroToDate(firstDayOfMonth.getDate()));
        setLastDayOfMonth(lastDayOfMonth.getFullYear()+'-'+GF.addZeroToDate(lastDayOfMonth.getMonth()+1)+'-'+GF.addZeroToDate(lastDayOfMonth.getDate()));
    }, []);

    useEffect(() => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; 
        if(regex.test(firstDayOfMonth)){
            setCurrentMonthFinance(DB.selectValueFromColumnCondition('finance f INNER JOIN account a ON f.AccountCode = a.Code and a.Active=1', 'f.Id, a.Code as Code, a.Name as accName, (SELECT Picture FROM icon WHERE id = a.IconId) as accPict, a.Color as accColor, f.Date as Date, f.Amount as Amount, f.Description as Description', 'f.CategoryId='+categoryId+' and a.Active=1 and a.Status IN (0,1) and a.GroupsId='+user.currentGroupId+' and f.Date BETWEEN "'+firstDayOfMonth+'" AND "'+lastDayOfMonth+'" ORDER BY f.Date DESC'))
            setOtherMonthFinance(DB.selectValueFromColumnCondition('finance f INNER JOIN account a ON f.AccountCode = a.Code and a.Active=1', 'f.Id, a.Code as Code, a.Name as accName, (SELECT Picture FROM icon WHERE id = a.IconId) as accPict, a.Color as accColor, f.Date as Date, f.Amount as Amount, f.Description as Description', 'f.CategoryId='+categoryId+' and a.Active=1 and a.Status IN (0,1) and a.GroupsId='+user.currentGroupId+' and f.Date < "'+firstDayOfMonth+'" ORDER BY f.Date DESC'))
        }
        
    },[firstDayOfMonth, lastDayOfMonth])

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        <View style={global.topBox}>
            <AntDesign name="arrowleft" size={34} color="white" style={global.leftTopIcon} onPress={() => router.push("/home/")}/>
            <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase', marginTop: 10}}>{categoryName}</Text>
            <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 40, fontWeight: '300'}}>{categorySuma.toFixed(2)} PLN</Text>
            <View style={{backgroundColor: `${categoryColor}`, width: 60, height: 60, borderRadius: 50, position: 'absolute', right: 10, top: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Image
                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+categoryPicture}}
                    style={{ width: 35, height: 35}}
                />
            </View>
            </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{...global.MainBox, marginTop: -25, paddingBottom: 20}}>
                {currentMonthFinance.map((row, id) => {
                    return (
                        <View key={id} style={style.itemHolder}>
                            {(id>0 ? (currentMonthFinance[id-1].Date!=row.Date && <DateValue date={row.Date} />) : <DateValue date={row.Date} />)}
                            <View style={style.financeHolder}>
                            <View style={{backgroundColor: `${row.accColor}`, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.accPict}}
                                    style={{ width: 25, height: 25}}
                                />
                            </View>
                            <View style={{flexDirection: 'column', marginLeft: 4}}>
                                <Text style={{fontSize: 14, color: colors.headerText, maxWidth: 140}} numberOfLines={1} ellipsizeMode='tail'>{row.Description}</Text>
                                <Text style={{fontSize: 12, color: colors.greyColor}}>{row.accName}</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 16, color: colors.placeholderText}}>{row.Amount.toFixed(2)} PLN</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Pressable onPress={() => router.push({pathname: '/home/transaction', params: { financeId: row.Id, amount: row.Amount, accId: row.Code, cateId: categoryId, amountDate: row.Date, amountDesc: row.Description, amountTransfer: categoryTransfer }})} style={{marginRight: 6}}><AntDesign name="edit" size={24} color="white" style={style.iconHolder} /></Pressable>
                                <Pressable><AntDesign name="delete" size={24} color="white" style={style.iconHolder}/></Pressable>
                            </View>
                            </View>
                        </View>
                    )
                })}
                {otherMonthFinance.map((row, id) => {
                    return (
                        <View key={id} style={style.itemHolder}>
                            {(id>0 ? (currentMonthFinance[id-1].Date!=row.Date && <DateValue date={row.Date} />) : <DateValue date={row.Date} />)}
                            <View style={style.financeHolder}>
                            <View style={{backgroundColor: `${row.accColor}`, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.accPict}}
                                    style={{ width: 25, height: 25}}
                                />
                            </View>
                            <View style={{flexDirection: 'column', marginLeft: 4}}>
                                <Text style={{fontSize: 14, color: colors.headerText, maxWidth: 140}} numberOfLines={1} ellipsizeMode='tail'>{row.Description}</Text>
                                <Text style={{fontSize: 12, color: colors.greyColor}}>{row.accName}</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 16, color: colors.placeholderText}}>{row.Amount.toFixed(2)} PLN</Text>
                            </View>
                            </View>
                        </View>
                    )
                })}
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
        flexDirection: 'row',
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