import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const PlanningHeader = (props) => {
  return (
    <View style={style.PlanningHeaderHolder}>
        <Text style={{...style.PlanningHeaderFont, ...props.style}}>{props.value}</Text>
    </View>
  )
}

const style = StyleSheet.create({
    PlanningHeaderHolder:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    PlanningHeaderFont:{
        width: '90%',
        textAlign: 'center',
        borderBottomColor: '#FFF',
        borderBottomWidth: 1,
        fontSize: 22,
        color: '#FFF',
        fontWeight: '700',
        paddingBottom: 5
    }
})

export default PlanningHeader