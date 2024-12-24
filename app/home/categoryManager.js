import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { router } from 'expo-router';
import global from '../../settings/styles/Global'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Dictionary from '../../settings/Dictionary/Dictionary';
import * as DB from '../../settings/SQLite/query'
import SideMenu from '../../components/SideMenu';
import colors from '../../settings/styles/colors';


const categoryManager = () => {
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [user, setUser] = useState(DB.fetchUsers());
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [categoryList, setCategoryList] = useState(DB.selectValueFromColumnCondition('category c INNER JOIN icon i ON c.IconId = i.Id', 'c.Id, c.Name, c.Type, c.Planned, c.IconId, i.Picture, c.Color, c.GroupsId', 'GroupsId is null OR GroupsId='+user.currentGroupId+' ORDER BY c.Type, GroupsId'));


  return ( 
    <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
        {openSideMenu && <SideMenu lang={lang} closeMenu={setOpenSideMenu} user={user} currentWindow={4} />}
        <View style={global.topBox}>
            <Entypo name="menu" size={34} color="white" style={global.leftTopIcon}  onPress={() => setOpenSideMenu(true)}/>
            <Text style={{...global.h3, fontSize: 22, textTransform: 'uppercase', marginTop: 10}}>{Dictionary.Categorys[lang]}</Text>
            <Text style={{...global.h3, fontSize: 16, marginTop: 10, marginBottom: 40, fontWeight: '300'}}>{DB.selectValueFromColumnCondition('groups', 'Name', 'Id='+user.currentGroupId)[0].Name}</Text>
            <View style={{position: 'absolute', right: 7, top: 7}}>
                <Pressable style={global.addButton} onPress={() => router.push("/home/categoryEdit")}>
                    <Entypo name="plus" size={30} color="white" />
                </Pressable>
            </View>
        </View>
            <ScrollView contentContainerStyle={{alignItems: 'center'}} style={{...global.MainBox, marginTop: -25, paddingBottom: 20}}>
                {categoryList.map((item, index) => {
                    return (
                        <View key={index}>
                            {(index==0) && (
                                <>
                                    <Text style={{width: '90%', marginTop: 10, color: 'white', fontSize: 14, fontWeight: '400'}}>{Dictionary.Expenses[lang]}</Text>
                                    <View style={{width: '95%', marginVertical: 3, borderTopWidth: 1, borderTopColor: 'white'}} />
                                </>
                            )}
                            {(index>0 && item.Type!=categoryList[index-1].Type) && (
                                <>
                                    <Text style={{width: '90%', marginTop: 10, color: 'white', fontSize: 14, fontWeight: '400'}}>{Dictionary.Income[lang]}</Text>
                                    <View style={{width: '95%', marginVertical: 3, borderTopWidth: 1, borderTopColor: 'white'}} />
                                </>
                            )}
                            <View style={style.categoryHolder}>
                                <View style={style.firstPart}>
                                    <View style={{...style.iconHolder, backgroundColor: item.Color}}>
                                        <Image
                                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.Picture}}
                                            style={{ width: 26, height: 26}}
                                        />
                                    </View>
                                    <Text style={{...style.categoryName, fontWeight: (item.GroupsId ? '600' : '300')}}>{item.Name}</Text>
                                </View>
                                <View style={style.secondPart}>
                                    {(item.Planned && <Text style={style.plannedAmount}>{item.Planned}</Text>)}
                                    {(item.GroupsId && <Pressable onPress={() => router.push({pathname: '/home/categoryEdit', params: {id: item.Id, name: item.Name, type: item.Type, planned: item.Planned, iconId: item.IconId, color: item.Color}})} style={{marginRight: 10}}><AntDesign name="edit" size={24} color="grey"/></Pressable>)}
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
    categoryHolder: {
        width: '90%',
        paddingHorizontal: 7,
        paddingVertical: 4,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.secondColor,
        marginVertical: 7,
        borderRadius: 10,
        shadowColor: '#000',
        backgroundColor: colors.contener,
        elevation: 20,
    },
    iconHolder: {
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstPart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    secondPart: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    categoryName: {
        color: 'white',
        fontSize: 15,
        marginLeft: 7
    },
    plannedAmount: {
        marginRight: 7,
        color: colors.greyColor,
        fontSize: 16
    }
})

export default categoryManager