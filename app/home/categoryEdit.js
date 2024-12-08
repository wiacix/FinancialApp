import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import global from '../../settings/styles/Global';
import { AntDesign } from '@expo/vector-icons';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query';
import Loading from '../../components/Loading';
import SettingButton from '../../components/SettingButton';
import ChooseStatus from '../../components/ChooseStatus';
import ChooseIcon from '../../components/ChooseIcon';
import Button from '../../components/Button';
import axios from 'axios';
import PopupWindow from '../../components/PopupWindow';

const categoryEdit = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [isLoading, setIsLoading] = useState(false);
    const { id, name, type, planned, iconId, color } = useLocalSearchParams();
    const [categoryId, setCategoryId] = useState(id || -1);
    const [categoryPlanned, setCategoryPlanned] = useState(planned || 0);
    const [categoryColor, setCategoryColor] = useState(color || 'rgb(123,123,123)');
    const [categoryPicture, setCategoryPicture] = useState(iconId || 1);
    const [categoryType, setCategoryType] = useState(type || 1);
    const [newCategory, setNewCategory] = useState((name==undefined ? true : false));
    const [categoryName, setCategoryName] = useState(newCategory ? Dictionary.CategoryName[lang] : name);
    const [chooseIcon, setChooseIcon] = useState(false);
    const [chooseType, setChooseType] = useState(false);
    const [popUpWindow, setPopUpWindow] = useState(false);

    const TypeOfType = [
        {id: 1, name: Dictionary.Expenses[lang]},
        {id: 2, name: Dictionary.Income[lang]}
    ]

    const CategoryToDB = async () => {
        setIsLoading(true);
        const data = {
            name: categoryName,
            id: categoryId,
            icon: categoryPicture,
            color: categoryColor,
            planned: categoryPlanned,
            type: categoryType,
            groupid: user.currentGroupId
        }
        try {
            const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=categoryManager', data);
            if(result.data.response){
                DB.categoryManager(result.data.id, data);
            }else console.log(result.data.error);
        }catch(err) {
            console.log('err', err);
        }finally {
            router.push("/home/categoryManager/")
            setIsLoading(false);
        }
    }

  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {isLoading && <Loading lang={lang}/>}
        {popUpWindow && <PopupWindow forYes={CategoryToDB} forNo={setPopUpWindow} lang={lang} />}
        {chooseType && <ChooseStatus value={TypeOfType} onChange={setCategoryType} onClose={setChooseType} />}
        {chooseIcon && <ChooseIcon color={categoryColor} icon={categoryPicture} lang={lang} onChangeIcon={setCategoryPicture} onChangeColor={setCategoryColor} onClose={setChooseIcon} />}
        <View style={global.topBox}>
            <AntDesign name="arrowleft" size={34} color="white" style={global.leftTopIcon} onPress={() => router.push("/home/categoryManager")}/>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                <TextInput style={{...global.h3, fontSize: 22}} value={categoryName} onChangeText={e => setCategoryName(e)}/>
                <AntDesign name="edit" size={24} color="grey" style={{marginLeft: 10}} />
            </View>
            <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 20, fontWeight: '300'}}>{DB.selectValueFromColumnCondition('groups', 'Name', 'Id='+user.currentGroupId)[0].Name}</Text>
        </View>
            <View style={style.settingHolder}>
                <SettingButton name={Dictionary.Icon[lang]} picture={DB.selectValueFromColumnCondition('icon', 'Picture', 'id='+categoryPicture)[0].Picture} color={categoryColor} lock={false} onPress={setChooseIcon} />
                <SettingButton name={Dictionary.CategoryType[lang]} status={(categoryType==1 ? Dictionary.Expenses[lang] : Dictionary.Income[lang])} lock={!newCategory} new={newCategory} onPress={setChooseType} />
                <SettingButton name={Dictionary.PlannedAmount[lang]} lock={false} editText={categoryPlanned} onChangeEditText={setCategoryPlanned} />
            </View>
            <Button onPress={() => setPopUpWindow(true)} name={Dictionary.SendBtn[lang]} style={{width: '50%'}} />
        </View>
    </>
  )
}

const style = StyleSheet.create({
    settingHolder: {
        width: '90%',
    }
})

export default categoryEdit