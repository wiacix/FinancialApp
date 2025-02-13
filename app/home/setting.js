import { View, Text, Pressable, ScrollView, Image, Animated, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import global from '../../settings/styles/Global';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query';
import Entypo from '@expo/vector-icons/Entypo';
import Loading from '../../components/Loading';
import PopupWindow from '../../components/PopupWindow';
import SideMenu from '../../components/SideMenu';
import colors from '../../settings/styles/colors';
import ChooseIcon from '../../components/ChooseIcon';
import ChooseStatus from '../../components/ChooseStatus';
import {Calendar} from 'react-native-calendars';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import * as LocalAuthentication from 'expo-local-authentication';
import InputPIN from '../../components/InputPIN';
import axios from 'axios';

const settings = () => {
    const [setting, setSetting] = useState(DB.fetchConfig());
    const [lang, setLang] = useState(setting.lang);
    const [sumaIconId, setSumaIconId] = useState(setting.sumaIconId);
    const [sumaColor, setSumaColor] = useState(setting.sumaColor);
    const [dateType, setDateType] = useState(setting.defaultDateType);
    const [fromDate, setFromDate] = useState(setting.defaultFromDate);
    const [toDate, setToDate] = useState(setting.defaultToDate);
    const [sideMenuName, setSideMenuName] = useState(setting.sideMenuName);
    const [pin, setPin] = useState(setting.pin);
    const [touchId, setTouchId] = useState(setting.touchId);
    const [user, setUser] = useState(DB.fetchUsers());
    const [isLoading, setIsLoading] = useState(false);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const leftAnim = useRef(new Animated.Value((lang=='pl' ? 0 : 60))).current;
    const pinAnim = useRef(new Animated.Value((pin=='null' ? 2 : 33))).current;
    const pinColor = useRef(new Animated.Value((pin=='null' ? 0 : 1))).current;
    const touchIdAnim = useRef(new Animated.Value((touchId==0 ? 2 : 33))).current;
    const touchIdColor = useRef(new Animated.Value((touchId==0 ? 0 : 1))).current;
    const [chooseIcon, setChooseIcon] = useState(false);
    const [chooseDateType, setChooseDateType] = useState(false);
    const [fromDateCalendar, setFromDateCalendar] = useState(false);
    const [toDateCalendar, setToDateCalendar] = useState(false);
    const [isAlertDate, setIsAlertDate] = useState(false);
    const [chooseSideMenuNameType, setChooseSideMenuNameType] = useState(false);
    const [touchIdSupp, setTouchIdSupp] = useState(LocalAuthentication.hasHardwareAsync());
    const [pinValueWindow, setPinValueWindow] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [isAlertData, setIsAlertData] = useState(false);

    const TypeOfDateType = [
        {id: 0, name: Dictionary.Current[lang]+' '+Dictionary.Day[lang]},
        {id: 1, name: Dictionary.Current[lang]+' '+Dictionary.Week[lang]},
        {id: 2, name: Dictionary.Current[lang]+' '+Dictionary.Month[lang]},
        {id: 3, name: Dictionary.Current[lang]+' '+Dictionary.Year[lang]},
        {id: 4, name: Dictionary.OwnCustom[lang]},
    ]

    const TypeOfSideMenuName = [
        {id: 0, name: user.login},
        {id: 1, name: user.name},
        {id: 2, name: user.name+' '+user.surname}
    ]

    const changeLang = () => {
        if(lang=='pl') Animated.timing(leftAnim, {toValue: 60, duration: 500, useNativeDriver: false}).start(() => {setLang('en')});
        else Animated.timing(leftAnim, {toValue: 0, duration: 500, useNativeDriver: false}).start(() => {setLang('pl')});
    }

    const changeIsPin = () => {
        if(pin=='null') Animated.parallel([Animated.timing(pinAnim, {toValue: 33, duration: 500, useNativeDriver: false}), Animated.timing(pinColor, {toValue: 1, duration: 500, useNativeDriver: false})]).start(() => setPin('nullx'));
        else Animated.parallel([Animated.timing(pinAnim, {toValue: 2, duration: 500, useNativeDriver: false}), Animated.timing(pinColor, {toValue: 0, duration: 500, useNativeDriver: false})]).start(() => setPin('null'));
    }

    const changeIsTouchId = async () => {
        if(touchId==0){
            const biometricAuth = await LocalAuthentication.authenticateAsync({promptMessage: Dictionary.AddLogInTouchId[lang]});
            if(biometricAuth.success) Animated.parallel([Animated.timing(touchIdAnim, {toValue: 33, duration: 500, useNativeDriver: false}), Animated.timing(touchIdColor, {toValue: 1, duration: 500, useNativeDriver: false})]).start(() => setTouchId(1));
        } 
        else Animated.parallel([Animated.timing(touchIdAnim, {toValue: 2, duration: 500, useNativeDriver: false}), Animated.timing(touchIdColor, {toValue: 0, duration: 500, useNativeDriver: false})]).start(() => setTouchId(0));
    }

    const saveSettings = async () => {
        if((dateType==4 && (fromDate=='null' || toDate=='test')) || pin=='nullx') setIsAlertData(true);
        else{
            setIsLoading(true);
            const data = {
                sumaColor: sumaColor,
                sumaIconId: sumaIconId,
                defaultDateType: dateType,
                defaultFromDate: fromDate,
                defaultToDate: toDate,
                sideMenuName: sideMenuName,
                lang: lang,
                pin: pin,
                touchId: touchId,
                sessionKey: user.sessionKey,
                userId: user.idGlobal
            }
            try { 
            const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=saveSettings', data);
            if(result.data.response){
                DB.updateSettings(user.idGlobal, dateType, fromDate, toDate, sideMenuName, sumaColor, sumaIconId, lang, pin, touchId);
            }else console.log(result.data.error);
            }catch(err){
                console.log('err', err);
            }finally{
                setIsLoading(false);
                DB.updateValue('settings', 'lastTransfer=1, lastDateType=defaultDateType, lastFromDate=defaultFromDate, lastToDate=defaultToDate', 'idGlobal='+user.idGlobal);
            }
        }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
            {isLoading && <Loading lang={lang}/>}
            {pinValueWindow && <InputPIN onClose={setPinValueWindow} lang={lang} setPin={setPin} pin={pin} btnText={Dictionary.Save[lang]} />}
            {isAlertDate && <Alert text={Dictionary.WrongDate[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertDate} />}
            {isAlertData && <Alert text={Dictionary.NotAllData[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertData} />}
            {openSideMenu && <SideMenu lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={6} sideMenuName={sideMenuName=='null' ? null : sideMenuName} />}
            {chooseDateType && <ChooseStatus value={TypeOfDateType} onChange={setDateType} onClose={setChooseDateType} />}
            {chooseSideMenuNameType && <ChooseStatus value={TypeOfSideMenuName} onChange={setSideMenuName} onClose={setChooseSideMenuNameType} />}
            {chooseIcon && <ChooseIcon color={sumaColor} lang={lang} onChangeIcon={setSumaIconId} onChangeColor={setSumaColor} onClose={setChooseIcon} />}
            {fromDateCalendar && <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 3, backgroundColor: '#000000B0'}}>
                <Calendar
                    firstDay={1}
                    initialDate={(fromDate!='null' ? fromDate : null)}
                    markedDates={{[(fromDate!='null' ? fromDate : null)]: {selected: true}, [(toDate!='null' ? toDate : null)] : {selected: true}}}
                    onDayPress={day => {
                        if(toDate=='null' || (toDate!='null' && new Date(toDate) >= new Date(day.dateString))){
                            setFromDate(day.dateString)
                            setFromDateCalendar(false);
                        }
                        else setIsAlertDate(true);
                    }}
                />
            </View>}
            {toDateCalendar && <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', zIndex: 3, backgroundColor: '#000000B0'}}>
                <Calendar
                    firstDay={1}
                    initialDate={(toDate!='null' ? toDate : null)}
                    markedDates={{[(toDate!='null' ? toDate : null)]: {selected: true}, [(fromDate!='null' ? fromDate : null)] : {selected: true}}}
                    onDayPress={day => {
                        if(fromDate=='null' || (fromDate!='null' && new Date(fromDate) <= new Date(day.dateString))){
                            setToDate(day.dateString)
                            setToDateCalendar(false);
                        }
                        else setIsAlertDate(true);
                    }}
                />
            </View>}
            <View style={global.topBox}>
                <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} onPress={() => setOpenSideMenu(true)} />
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.Settings[lang]}</Text>
                </View>
                <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 20, fontWeight: '300'}}>{user.login}</Text>
            </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{width: '90%'}}>
                <View style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{Dictionary.Language[lang]}</Text>
                    <Pressable onPress={() => changeLang()} style={{flexDirection: 'row', gap: 20, position: 'relative', height: '100%', alignItems: 'center', paddingHorizontal: 10}} >
                        <Animated.View style={{backgroundColor: colors.settingChoose, width: '60%', height: '80%', position: 'absolute', borderRadius: 10, left: leftAnim }}></Animated.View>
                        <Image source={require('../../assets/IMG/pl.png')} style={{height: 25, width: 40}} />
                        <Image source={require('../../assets/IMG/en.png')} style={{height: 25, width: 40}} />
                    </Pressable>
                </View>
                <Pressable onPress={() => setChooseIcon(true)} style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{Dictionary.Suma[lang]}</Text>
                    <View style={{...style.iconHolder, backgroundColor: sumaColor}}>
                        <Image
                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+DB.selectValueFromColumnCondition('icon i', 'Picture', 'Id='+sumaIconId)[0].Picture}}
                            style={{ width: 30, height: 30}}
                        />
                    </View>
                </Pressable>
                <Pressable onPress={() => setChooseDateType(true)} style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{Dictionary.DefaultDateType[lang]}</Text>
                    <Text style={{backgroundColor: colors.settingChoose, color: colors.inputText, paddingVertical: 10, paddingHorizontal: 5, borderRadius: 10}}>{TypeOfDateType[dateType].name}</Text>
                </Pressable>
                {dateType==4 && (
                    <>
                        <Pressable onPress={() => setFromDateCalendar(true)} style={{width: '90%', backgroundColor: colors.contener, marginTop: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                            <Text style={{fontSize: 15, color: colors.inputText, marginVertical: 7, textAlign: 'center'}}>{Dictionary.FromDate[lang]}</Text>
                            <Text style={{backgroundColor: colors.settingChoose, color: colors.inputText, paddingVertical: 4, paddingHorizontal: 5, borderRadius: 10, fontSize: 13}}>{fromDate=='null' ? Dictionary.SetDate[lang] : fromDate}</Text>
                        </Pressable>
                        <Pressable onPress={() => setToDateCalendar(true)} style={{width: '90%', backgroundColor: colors.contener, marginTop: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                            <Text style={{fontSize: 15, color: colors.inputText, marginVertical: 7, textAlign: 'center'}}>{Dictionary.ToDate[lang]}</Text>
                            <Text style={{backgroundColor: colors.settingChoose, color: colors.inputText, paddingVertical: 4, paddingHorizontal: 5, borderRadius: 10, fontSize: 13}}>{toDate=='null' ? Dictionary.SetDate[lang] : toDate}</Text>
                        </Pressable>
                    </>
                )}
                <Pressable onPress={() => setChooseSideMenuNameType(true)} style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{Dictionary.NameSideMenu[lang]}</Text>
                    <Text style={{backgroundColor: colors.settingChoose, color: colors.inputText, paddingVertical: 10, paddingHorizontal: 5, borderRadius: 10}}>{TypeOfSideMenuName[sideMenuName].name}</Text>
                </Pressable>
                <View style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{Dictionary.isPIN[lang]}</Text>
                    <Pressable onPress={() => changeIsPin()}>
                        <Animated.View style={{borderRadius: 20, justifyContent: 'center', position: 'relative', height: 30, width: 60, backgroundColor: pinColor.interpolate({inputRange: [0, 1], outputRange: [colors.settingChoose, colors.button]})}} >
                            <Animated.View style={{backgroundColor: colors.inputText, width: 25, height: 25, position: 'absolute', borderRadius: 20, left: pinAnim }}></Animated.View>
                        </Animated.View>
                    </Pressable>
                </View>
                {pin!='null' && (
                    <Pressable onPress={() => setPinValueWindow(true)} style={{width: '90%', backgroundColor: colors.contener, marginTop: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                        <Text style={{fontSize: 15, color: colors.inputText, marginVertical: 7, textAlign: 'center'}}>{Dictionary.Pin[lang]}</Text>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <Text style={{backgroundColor: colors.settingChoose, color: colors.inputText, paddingVertical: 4, paddingHorizontal: 5, borderRadius: 10, fontSize: 13}}>{pin=='nullx' ? Dictionary.InsertPin[lang] : (showPin ? pin : '****')}</Text>
                            {pin!='nullx' && (
                                <Pressable onPress={() => setShowPin(!showPin)}>
                                    {!showPin ? (<Entypo name="eye-with-line" size={24} color={colors.placeholderText} />) : (<Entypo name="eye" size={24} color={colors.placeholderText} />)}
                                </Pressable>
                            )}
                        </View>
                    </Pressable>
                )}
                {touchIdSupp && (
                    <View style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                        <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{Dictionary.isTouchId[lang]}</Text>
                        <Pressable onPress={() => changeIsTouchId()}>
                            <Animated.View style={{borderRadius: 20, justifyContent: 'center', position: 'relative', height: 30, width: 60, backgroundColor: touchIdColor.interpolate({inputRange: [0, 1], outputRange: [colors.settingChoose, colors.button]})}} >
                                <Animated.View style={{backgroundColor: colors.inputText, width: 25, height: 25, position: 'absolute', borderRadius: 20, left: touchIdAnim }}></Animated.View>
                            </Animated.View>
                        </Pressable>
                    </View>
                )}
                <Button onPress={() => {saveSettings();}} name={Dictionary.SaveChanges[lang]} style={{width: '50%'}} />
            </ScrollView>
        </View>
    </>
  )
}

const style = StyleSheet.create({
    iconHolder: {
        width: 45,
        height: 45,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default settings