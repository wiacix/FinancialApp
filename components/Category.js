import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import colors from '../settings/styles/colors'
import global from '../settings/styles/Global'

const Category = (props) => {
    return (
        <ScrollView style={{width: '100%'}}>
            {props.value.map((row) => {
                return(
                    <View style={{width: '100%', backgroundColor: colors.contener, height: 55, borderRadius: 10, marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}} key={row.CategoryId}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{backgroundColor: `${row.Color}`, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+row.Picture}}
                                    style={{ width: 25, height: 25}}
                                />
                            </View>
                            <Text style={{...global.h6, marginLeft: 10}}>{row.Name}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{...global.h6, color: '#121417'}}>{(row.suma/props.totalAmount*100).toFixed(0)} %</Text>
                            <Text style={global.h6}>{row.suma} PLN</Text>
                        </View>
                    </View>
            )})}
        </ScrollView>
    )
}

export default Category