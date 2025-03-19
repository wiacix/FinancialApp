import { View, Image, Text } from 'react-native'
import React, { useState } from 'react'
import * as DB from '../settings/SQLite/query'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as GF from '../settings/GlobalFunction'

const PlanningPreview = (props) => {
    const [transaction, setTransaction] = useState(DB.selectValueFromColumnCondition('finance f INNER JOIN account a ON f.AccountCode = a.Code INNER JOIN icon i ON a.IconId = i.Id', 'f.Description, f.Amount, f.Date, a.Name, a.Color, i.Picture', `a.Active=1 AND f.CategoryId=${props.categoryId} AND strftime("%m",f.Date)="${GF.addZeroToDate(props.currentMonth.getMonth()+1)}" AND strftime("%Y",f.Date)="${props.currentMonth.getFullYear()}" AND a.GroupsId IN (SELECT currentGroupId FROM users LIMIT 1) ORDER BY f.Date desc`));
    return (
        <View style={{width: '100%', alignItems: 'center', marginBottom: 5}}>
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, borderWidth: 1, borderTopWidth: 0, borderColor: 'rgba(112, 112, 112, 0.45)', width: '90%', padding: 5, borderRadius: 5}}>
                {transaction.map((item, index) => {
                    return (
                        <View key={index} style={{flexDirection: 'row', gap: 5, width: '100%'}}>
                            <View style={{backgroundColor: item.Color, padding: 5, borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 30, height: 30}}>
                                <Image
                                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.Picture}}
                                    style={{ width: 20, height: 20}}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{color: 'white', fontSize: 13}}>{item.Description}</Text>
                                <Text style={{color: 'grey', fontSize: 10}}>{item.Name}</Text>
                            </View>
                            <View>
                                <Text style={{color: 'white', fontSize: 13, textAlign: 'right'}}>{item.Amount} PLN</Text>
                                <Text style={{color: 'grey', fontSize: 10, textAlign: 'right'}}>{item.Date}</Text>
                            </View>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <AntDesign name={props.type==1 ? 'arrowdown' : 'arrowup'} size={20} color={props.type==1 ? 'rgb(138, 28, 28)' : 'rgb(30, 132, 52)'} />
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default PlanningPreview