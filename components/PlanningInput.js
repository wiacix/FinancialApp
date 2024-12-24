import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import UnlockInput from './UnlockInput'
import LockedInput from './LockedInput'

const PlanningInput = (props) => {
  return (
    <View style={style.mainHolder}>
        <View style={style.categoryNameHolder}>
            <View style={{...style.iconHolder, backgroundColor: props.color}}>
                <Image
                    source={{uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+props.picture}}
                    style={{ width: 25, height: 25}}
                />
            </View>
            <Text style={style.categoryName}>{props.categoryName}</Text>
        </View>
        <View style={style.inputHolder}>
            <UnlockInput value={props.value} onChange={props.onChange} categoryName={props.categoryName} />
            <View style={style.LockedInput}>
            <LockedInput value={0} />
            </View>
        </View>
    </View>
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

export default PlanningInput