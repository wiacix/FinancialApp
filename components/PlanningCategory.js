import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import LockedInput from './LockedInput';
import UnlockInput from './UnlockInput'
import Dictionary from '../settings/Dictionary/Dictionary';
import { router } from 'expo-router'
import PlanningPreview from './PlanningPreview';

const PlanningCategory = (props) => {
    const [visibleTransactions, setVisibleTransactions] = useState({});
    const toggleTransaction = (id) => {
        setVisibleTransactions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (
        <>
            <View style={style.header}>
                <Text style={{...style.headerText, marginRight: 20}}>{Dictionary.Planning[props.lang]}</Text>
                <Text style={style.headerText}>{Dictionary.RealAmount[props.lang]}</Text>
            </View>
            {props.data.map((row) => {
                return(
                    <View key={row.Name}>
                    <Pressable style={style.mainHolder} onPress={() => toggleTransaction(row.Id)}>
                        <View style={style.categoryNameHolder}>
                            <View style={{...style.iconHolder, backgroundColor: row.Color}}>
                                <Image
                                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.Picture}}
                                    style={{ width: 25, height: 25}}
                                />
                            </View>
                            <Text style={style.categoryName}>{row.Name}</Text>
                        </View>
                        <View style={style.inputHolder}>
                            {props.close ? (
                                <LockedInput value={row.PlannedAmount}/>
                            ) : (
                                <UnlockInput />
                            )}
                            <View style={style.LockedInput}>
                                {props.income ? (
                                    <LockedInput value={row.Rzeczywiste} style={{color: (row.Rzeczywiste>=row.PlannedAmount ? 'green' : 'red')}}/>
                                ) : (
                                    <LockedInput value={row.Rzeczywiste} style={{color: (row.Rzeczywiste>row.PlannedAmount ? 'red' : 'green')}}/>
                                )}
                            </View>
                        </View>
                    </Pressable>
                    {visibleTransactions[row.Id] && <PlanningPreview currentMonth={props.currentMonth} categoryId={row.Id} type={props.income ? 2 : 1} />}
                    </View>
                )
            })}
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

export default PlanningCategory