import { Pressable, ScrollView, StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Dictionary from '../settings/Dictionary/Dictionary'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as DB from '../settings/SQLite/query'
import * as GF from '../settings/GlobalFunction'
import AntDesign from '@expo/vector-icons/AntDesign';
import SectionList from './SectionList'
import { Calendar } from 'react-native-calendars'
import axios from 'axios'
import { router } from 'expo-router'

const AddTransaction = (props) => {
    const [account, setAccount] = useState(-1);
    const [accountList, setAccountList] = useState(DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON a.IconId = i.Id', 'a.Code, a.Name, a.Balance, a.Color, i.Picture', 'Active=1 and Status IN (0,1) ORDER BY a.Code'));
    const [category, setCategory] = useState(-1);
    const [categoryList, setCategoryList] = useState(DB.selectValueFromColumnCondition('category c INNER JOIN icon i ON c.IconId = i.Id', 'c.Name, c.Color, c.Id as Code, i.Picture, c.Type', 'c.Type='+props.transfer));
    const [openAccountList, setOpenAccountList] = useState(false);
    const [openCategoryList, setOpenCategoryList] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date(DB.selectValueFromColumnCondition('planning p', 'MAX(Date) as currentDate', 'p.Status=1')[0].currentDate));
    const [fromDate, setFromDate] = useState(currentDate.getFullYear()+'-'+GF.addZeroToDate(currentDate.getMonth()+1)+'-01');
    const [toDate, setToDate] = useState(currentDate.getFullYear()+'-'+GF.addZeroToDate(currentDate.getMonth()+1)+'-'+new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate());
    const [categoryBalance, setCategoryBalance] = useState();
    const [value, setValue] = useState(props.oldValue);
    const [oldValue, setOldValue] = useState(props.oldValue);
    const [editFinanceId, setEditFinanceId] = useState(props.financeId);
    const [oldAccountId, setOldAccountId] = useState(props.oldAccountId);
    const [description, setDescription] = useState(props.amountDesc);
    const [pickedDate, setPickedDate] = useState(props.amountDate=='' ? Dictionary.PickDate[props.lang] : props.amountDate);
    const [openCalendar, setOpenCalendar] = useState(false);

    useEffect(() => {
        if(category!=-1) setCategoryBalance(DB.selectWithoutFrom('ROUND(IFNULL((SELECT IFNULL(PlannedAmount, 0) as suma FROM planning where CategoryId='+(categoryList[category].Code)+' AND Status=1), 0) - IFNULL((SELECT SUM(Amount) FROM finance WHERE CategoryId='+(categoryList[category].Code)+' AND AccountCode IN (SELECT Code FROM account WHERE Active=1) AND Date BETWEEN "'+fromDate+'" AND "'+toDate+'"), 0), 2) as Balance;')[0].Balance.toFixed(2))
    }, [category])

    const updateDate = () => {
        setOldValue(props.oldValue);
        setValue(props.oldValue);
        setEditFinanceId(props.financeId);
        setOldAccountId(props.oldAccountId);
        setDescription(props.amountDesc);
        setPickedDate(props.amountDate);
        setAccount(accountList.findIndex(item => item.Code === props.oldAccountId));
        setCategory(categoryList.findIndex(item => item.Code === props.oldCategoryId))
    }

    const clearData = () => {
        setOldValue(0);
        setValue('');
        setEditFinanceId(-1);
        setOldAccountId(-1);
        setDescription('');
        setPickedDate(Dictionary.PickDate[props.lang]);
        setAccount(-1);
        setCategory(-1)
    }

    useEffect(() => {
        if(props.isOpen) updateDate();
    }, [props.isOpen])

    const addTransaction = async () => {
        if(account==-1 || category==-1 || value=='' || pickedDate.indexOf('-')<0 || description=='') props.alertData(true);
        else{
            props.setIsLoading(true);
            const data = {
                categoryId: categoryList[category].Code,
                accountId: accountList[account].Code,
                amount: parseFloat(value),
                oldAmount: parseFloat(oldValue),
                date: pickedDate,
                description: description,
                transfer: props.transfer,
                financeId: editFinanceId,
                oldAccountId: oldAccountId,
                sessionKey: props.sessionKey
            }
            try {
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=add_finance', data);
                if(result.data.response){
                    if(data.financeId==-1) DB.addFinance(result.data.financeId, result.data.accountId, accountList[account].Code, value, categoryList[category].Code, pickedDate, description, props.transfer);
                    else DB.editFinance(result.data.financeId, result.data.oldAccountId, result.data.accountId, data); 
                }else console.log(result.data.error)
            }catch(err) {
                console.log('err', err)
            }finally {
                props.setIsLoading(false);
                router.push("/home/")
            }
        }
    }
    return (
        <RBSheet 
            ref={props.refRBSheet}
            onClose={() => props.setIsOpen(false)}
            onOpen={() => (!props.isOpen && clearData())}
            customStyles={{
                wrapper: {
                    backgroundColor: '#23232555'
                },
                container: {
                    backgroundColor: '#232325',
                    borderTopEndRadius: 30,
                    borderTopStartRadius: 30
                }
            }}
            customModalProps={{
                animationType: 'slide',
                statusBarTranslucent: true
            }}
            customAvoidingViewProps={{
                enabled: false
            }}
            closeOnPressBack={true}
            draggable={true}
            dragOnContent={true}
            height={600}
        >
        {openCalendar && <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 3, backgroundColor: '#000000B0'}}>
        <Calendar
            firstDay={1}
            onDayPress={day => {
                if(day.year==currentDate.getFullYear() && day.month==(currentDate.getMonth()+1)){
                    setPickedDate(day.dateString)
                    setOpenCalendar(false);
                }
                else props.alertDate(true);
            }}
        />
        </View>}
            <ScrollView >
                <Text style={{color: 'white', marginTop: 10, fontSize: 27, letterSpacing: 1, fontWeight: '500', marginLeft: 17}}>{props.transfer==1 ? Dictionary.NewExpenses[props.lang] : Dictionary.NewIncome[props.lang]}</Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', marginTop: 10}}>
                    <Pressable style={styles.sectionBtn} onPress={() => setOpenAccountList(!openAccountList)}>
                        <View style={styles.sectionBtnClose}>
                            <View style={{...styles.imgHolder, backgroundColor: (account==-1 ? '#23631255' : GF.convertColor(accountList[account].Color, '55'))}}>
                                <Image source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+(account==-1 ? 'question.png' : accountList[account].Picture)}} style={{width: 18, height: 18}} />
                            </View>
                            <Text style={styles.sectionText}>{account==-1 ? Dictionary.ChooseAccount[props.lang] : accountList[account].Name}</Text>
                            <AntDesign name="down" size={14} color="white" style={styles.sectionMore} />
                        </View>
                        {openAccountList && <SectionList data={accountList} setValue={setAccount} close={setOpenAccountList} style={{position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100}} />}
                    </Pressable>
                    <Pressable style={styles.sectionBtn} onPress={() => setOpenCategoryList(!openCategoryList)}>
                        <View style={styles.sectionBtnClose}>
                            <View style={{...styles.imgHolder, backgroundColor: (category==-1 ? '#23631255' : GF.convertColor(categoryList[category].Color, '55'))}}>
                                <Image source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+(category==-1 ? 'question.png' : categoryList[category].Picture)}} style={{width: 18, height: 18}} />
                            </View>
                            <Text style={styles.sectionText}>{category==-1 ? Dictionary.ChooseCategory[props.lang] : categoryList[category].Name.length > 15 ? categoryList[category].Name.substring(0, 15) + '...' : categoryList[category].Name}</Text>
                            <AntDesign name="down" size={14} color="white" style={styles.sectionMore} />
                        </View>
                        {openCategoryList && <SectionList data={categoryList} setValue={setCategory} close={setOpenCategoryList} />}
                    </Pressable>
                </View>
                {category!=-1 && (props.transfer==1 ? (
                    <Text style={{...styles.alertText, color: (categoryBalance>0 ? '#95D8B0' : '#DF7977')}}>
                        {Dictionary.InCategory[props.lang]}
                        <Text style={{fontWeight: '400'}}> {categoryList[category].Name} </Text>
                        {Dictionary.LeftMoney[props.lang]}
                        <Text style={{fontWeight: '400'}}> {categoryBalance}</Text>
                        <Text> PLN</Text>
                    </Text>
                ) : (
                    <Text style={{...styles.alertText, color: (categoryBalance>0 ? '#DF7977' : '#95D8B0')}}>
                        {Dictionary.InCategory[props.lang]}
                        <Text style={{fontWeight: '400'}}> {categoryList[category].Name} </Text>
                        {Dictionary.MissMoney[props.lang]}
                        <Text style={{fontWeight: '400'}}> {categoryBalance}</Text>
                        <Text> PLN</Text>
                    </Text>
                ))}
                <TextInput 
                    value={value.toString()}
                    placeholder='0.00'
                    placeholderTextColor='#9EABB8'
                    onChangeText={e => GF.changeValue(e, setValue)} 
                    style={{...styles.UnlockInputFont}}
                    keyboardType='numeric' />
                <TextInput
                    value={description.toString()}
                    placeholder={Dictionary.Description[props.lang]}
                    placeholderTextColor='#9EABB8'
                    onChangeText={e => setDescription(e)}
                    style={{...styles.Description}}
                />
                <Pressable style={styles.pickDate} onPress={() => setOpenCalendar(true)}>
                    <AntDesign name="calendar" size={40} color="rgba(255, 255, 255, 0.88)" />
                    <Text style={styles.pickDateText}>{pickedDate}</Text>
                </Pressable>
                <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
                    <Pressable onPress={() => addTransaction()} style={styles.submitBtn}>
                        <Text style={styles.pickDateText}>{Dictionary.SendBtn[props.lang]}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    sectionBtn: {
        backgroundColor: '#343436',
        width: '45%',
        borderRadius: 10,
        flexDirection: 'column'
    },
    sectionBtnClose: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        gap: 3, 
        marginVertical: 7
    },
    imgHolder: {
        padding: 5,
        marginLeft: 7,
        borderRadius: 20
    },
    sectionText: {
        color: 'rgba(255, 255, 255, 0.88)',
        fontWeight: '500',
        flex: 1,
        fontSize: 12
    },
    sectionMore: {
        marginRight: 7,
        color: 'rgba(255, 255, 255, 0.88)',
        fontWeight: '500',
    },
    alertText: {
        fontSize: 12,
        fontWeight: '200',
        textAlign: 'center',
        marginTop: 5
    },
    UnlockInputFont: {
        color: 'white',
        fontSize: 45,
        fontWeight: '400',
        textAlign: 'center',
        paddingVertical: 20
    },
    Description: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    pickDate: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30,
        alignItems: 'center',
        gap: 10
    },
    pickDateText: {
        color: 'rgba(255, 255, 255, 0.88)',
        fontSize: 18,
        fontWeight: '500'
    },
    submitBtn: {
        width: '90%',
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
})

export default AddTransaction