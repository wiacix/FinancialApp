import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as DB from '../settings/SQLite/query'
import LockedInput from './LockedInput'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Dictionary from '../settings/Dictionary/Dictionary';

const SummaryItem = (props) => {
    const [bondsValue, setBondsValue] = useState(Math.floor((props.income-props.tithePlanned-props.plannedExpenses)/100)*100>0 ? (Math.floor((props.income-props.tithePlanned-props.plannedExpenses)/100)*100).toString() : '0');
    const [bondsInfo, setBondsInfo] = useState(DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON i.Id = a.IconId', 'a.Name, a.Color, i.Picture', 'a.Status=3')[0])
    const [titheInfo, setTitheInfo] = useState(DB.selectValueFromColumnCondition('account a INNER JOIN icon i ON i.Id = a.IconId', 'a.Name, a.Color, i.Picture', 'a.Status=2')[0]);
    useEffect(() => {
        setBondsValue(Math.floor((props.income-props.tithePlanned-props.plannedExpenses)/100)*100>0 ? (Math.floor((props.income-props.tithePlanned-props.plannedExpenses)/100)*100).toString() : '0');
    }, [props.income, props.tithePlanned, props.plannedExpenses])
    return (
        <>
            <View style={style.mainHolder}>
                <View style={style.categoryNameHolder}>
                    <View style={{...style.iconHolder, backgroundColor: (titheInfo?.Color==undefined ? 'white' : titheInfo.Color)}}>
                        <Image
                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+(titheInfo?.Picture==undefined ? 'question' : titheInfo.Picture)}}
                            style={{ width: 25, height: 25}}
                        />
                    </View>
                    <Text style={style.categoryName}>{(titheInfo?.Name == undefined ? 'Dziesięcina' : titheInfo.Name)}</Text>
                </View>
                <View style={style.inputHolder}>
                    <LockedInput value={props.tithePlanned.toFixed(2)}/>
                    <View style={style.LockedInput}>
                        <LockedInput value={props.realTithe} style={{color: ((props.realIncome/10)>props.realTithe ? 'red' : 'green')}}/>
                    </View>
                </View>
            </View>
            <View style={style.mainHolder}>
                <View style={style.categoryNameHolder}>
                    <View style={{...style.iconHolder, backgroundColor: (bondsInfo?.Color==undefined ? 'white' : bondsInfo.Color)}}>
                        <Image
                            source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+(bondsInfo?.Picture==undefined ? 'question' : bondsInfo.Picture)}}
                            style={{ width: 25, height: 25}}
                        />
                    </View>
                    <Text style={style.categoryName}>{(bondsInfo?.Name == undefined ? 'Obligacje' : bondsInfo.Name)}</Text>
                </View>
                <View style={style.inputHolder}>
                    <LockedInput value={bondsValue}/>
                    <View style={style.LockedInput}>
                        <LockedInput value={props.realBonds} />
                    </View>
                </View>
            </View>
            <View style={style.mainHolder}>
                <View style={style.categoryNameHolder}>
                    <View style={{backgroundColor: 'rgb(255,80,45)', ...style.iconHolder}}>
                        <FontAwesome name="money" size={25} color="white" />
                    </View> 
                    <Text style={style.categoryName}>{Dictionary.Amount[props.lang]}</Text>
                </View>
                <View style={style.inputHolder}>
                    <LockedInput value={(props.income-parseFloat(bondsValue)-props.tithePlanned-props.plannedExpenses).toFixed(2)} style={{color: (props.income-parseFloat(bondsValue)-props.tithePlanned-props.plannedExpenses<0 ? 'red' : 'green')}}/>
                    <View style={style.LockedInput}>
                        <LockedInput value={props.realAmount.toFixed(2)} style={{color: (props.realAmount<0 ? 'red' : 'green')}}/>
                    </View>
                </View>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    mainHolder:{
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: 7
    },
    iconHolder:{
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryName:{
        color: '#FFF',
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '400'
    },
    inputHolder:{
        flexDirection: 'row'
    },
    LockedInput:{
        borderLeftColor: '#000',
        borderLeftWidth: 1,
        marginLeft: 3,
        paddingLeft: 3
    },
    categoryNameHolder:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
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

export default SummaryItem