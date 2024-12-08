import { View, Text, Pressable, ScrollView, TextInput } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import global from '../../settings/styles/Global';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query';
import Entypo from '@expo/vector-icons/Entypo';
import Loading from '../../components/Loading';
import PopupWindow from '../../components/PopupWindow';
import SideMenu from '../../components/SideMenu';
import Button from '../../components/Button'
import colors from '../../settings/styles/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Alert from '../../components/Alert'
import axios from 'axios';

const groupManager = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [isLoading, setIsLoading] = useState(false);
    const [popUpWindowJoin, setPopUpWindowJoin] = useState(false);
    const [popUpWindowCreate, setPopUpWindowCreate] = useState(false);
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [selectGroup, setSelectGroup] = useState(false);
    const [changeGroupTo, setChangeGroupTo] = useState(-1);
    const [groupInfo, setGroupInfo] = useState(DB.selectValueFromColumnCondition('groups', '*', 'Id='+user.currentGroupId)[0]);
    const [groupCode, setGroupCode] = useState('');
    const [selectGroupCode, setSelectGroupCode] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectGroupName, setSelectGroupName] = useState(false);
    const [isAlertJoin, setIsAlertJoin] = useState(false);
    const router = useRouter();

    useEffect(() => { 
        if (changeGroupTo !== -1) changeGroup(); 
    }, [changeGroupTo]);

    const changeGroup = async () => {
        setIsLoading(true);
        try {
            DB.updateValue('users', 'currentGroupId='+changeGroupTo, '1=1');
        }catch(err){
            console.log(err);
        }finally{
            setGroupInfo(DB.selectValueFromColumnCondition('groups', '*', 'Id='+changeGroupTo)[0]);
            setIsLoading(false);
        }
    }

    const joinGroup = async () => {
        if(groupCode!='' && groupCode!=null){
            setPopUpWindowJoin(false)
            setIsLoading(true);
            const data = {
                groupCode: groupCode,
                userId: user.idGlobal
            }
            try{
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=join_group', data);
                if(result.data.response){
                    DB.joinGroup(result.data.GroupId, user.idGlobal);
                    router.push("../synchronizationFunc");
                }else if(!result.data.found){
                    setIsAlertJoin(true);
                }else console.log(result.data.error)
            }catch(err){
                console.log('err', err)
            }finally{
                setIsLoading(false);
            }
        }else{
            setPopUpWindowJoin(false)
        }
    }

    const CreateGroup = async () => {
        if(groupName!='' && groupName!=null){
            setPopUpWindowCreate(false)
            setIsLoading(true);
            const data = {
                groupName: groupName,
                userId: user.idGlobal
            }
            try{
                const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=add_group', data);
                if(result.data.response){
                    DB.joinGroup(result.data.GroupId, user.idGlobal);
                    router.push("../synchronizationFunc");
                }else console.log(result.data.error)
            }catch(err){
                console.log('err', err)
            }finally{
                setIsLoading(false);
            }
        }else{
            setPopUpWindowCreate(false)
        }
    }



  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
            {isLoading && <Loading lang={lang}/>}
            {popUpWindowJoin && <PopupWindow forYes={joinGroup} forNo={setPopUpWindowJoin} lang={lang} />}
            {isAlertJoin && <Alert text={Dictionary.CantFindGroup[lang]} ok={Dictionary.Ok[lang]} close={setIsAlertJoin} />}
            {popUpWindowCreate && <PopupWindow forYes={CreateGroup} forNo={setPopUpWindowCreate} lang={lang} />}
            {openSideMenu && <SideMenu groupName={groupInfo.Name} lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={5} />}
            <View style={global.topBox}>
                <Entypo name="menu" size={34} color="white" style={global.leftTopIcon} onPress={() => setOpenSideMenu(true)} />
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase'}}>{Dictionary.ManageGroups[lang]}</Text>
                </View>
                <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 20, fontWeight: '300'}}>{groupInfo.Name}</Text>
            </View>
            <View style={{width: '90%'}}>
                <View style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 7}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>{groupInfo.Name}</Text>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, textAlign: 'center'}}>Kod: {groupInfo.Code}</Text>
                </View>
                <Pressable onPress={() => setSelectGroup(true)} style={{width: '100%', backgroundColor: colors.contener, marginTop: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 18, color: colors.inputText, marginVertical: 15, flex: 1, textAlign: 'center'}}>{Dictionary.ChangeGroup[lang]}</Text>
                    <AntDesign name="caretdown" size={24} color="white" style={{marginRight: 5}} />
                </Pressable>
                <ScrollView>
                    {(selectGroup && (
                        DB.selectValueFromColumnCondition('groups', '*', 'Id IN ('+user.groupsid+')').map((item, index) => {
                            return (
                                <Pressable key={index} onPress={() => {setChangeGroupTo(item.Id); setSelectGroup(false);}} style={{width: '100%', backgroundColor: colors.contener, marginTop: 5, borderRadius: 10, alignItems: 'center', paddingHorizontal: 7}}>
                                    <Text style={{fontSize: 15, color: colors.placeholderText, marginVertical: 10}}>{item.Name}</Text>
                                </Pressable>
                            )
                        })
                    ))}
                </ScrollView>
                <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                    <Button onPress={() => setSelectGroupCode(!selectGroupCode)} name={Dictionary.JoinGroup[lang]} style={{width: '45%'}} />
                    <Button onPress={() => setSelectGroupName(!selectGroupName)} name={Dictionary.CreateGroup[lang]} style={{width: '45%'}} />
                </View>
                {(selectGroupCode && (
                    <View style={{backgroundColor: colors.contener, marginTop: 5, borderRadius: 10, paddingHorizontal: 7, flexDirection: 'row'}}>
                        <TextInput
                            style={{ marginVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.greyColor, fontSize: 18, color: colors.inputText, flex: 1, marginRight: 7}}
                            placeholder={Dictionary.GroupCode[lang]}
                            value={(!groupCode ? '' : groupCode)}
                            onChangeText={(e) => setGroupCode(e)}
                        />
                        <Button onPress={() => setPopUpWindowJoin(true)} name={Dictionary.Join[lang]} style={{width: '25%'}} />
                    </View>
                ))}
                {(selectGroupName && (
                    <View style={{backgroundColor: colors.contener, marginTop: 5, borderRadius: 10, paddingHorizontal: 7, flexDirection: 'row'}}>
                        <TextInput
                            style={{ marginVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.greyColor, fontSize: 18, color: colors.inputText, flex: 1, marginRight: 7}}
                            placeholder={Dictionary.GroupName[lang]}
                            value={(!groupName ? '' : groupName)}
                            onChangeText={(e) => setGroupName(e)}
                        />
                        <Button onPress={() => setPopUpWindowCreate(true)} name={Dictionary.Create[lang]} style={{width: '25%'}} />
                    </View>
                ))}
            </View>
        </View>
    </>
  )
}

export default groupManager