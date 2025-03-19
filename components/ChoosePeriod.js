import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import main from '../settings/styles/Main'
import Dictionary from '../settings/Dictionary/Dictionary'

const ChoosePeriod = (props) => {
  return (
    <View style={styles.dateHolder}>
        <View style={styles.bgDate}>
            <Pressable onPress={() => props.setDateType(1)} style={{...styles.press, ...(props.dateType==1 && styles.dateHolderTextChoose)}}><Text style={{...styles.dateHolderText}}>{Dictionary.Week[props.lang]}</Text></Pressable>
            <Pressable onPress={() => props.setDateType(2)} style={{...styles.press, ...(props.dateType==2 && styles.dateHolderTextChoose)}}><Text style={{...styles.dateHolderText}}>{Dictionary.Month[props.lang]}</Text></Pressable>
            <Pressable onPress={() => {props.setOpenCalendar(true); props.setDateType(4);}} style={{...styles.press, ...(props.dateType==4 && styles.dateHolderTextChoose)}}><Text style={{...styles.dateHolderText}}>{Dictionary.Custom[props.lang]}</Text></Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    dateHolder: {
        width: '100%',
        height: 40,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgDate: {
        width: '90%',
        backgroundColor: 'rgba(44, 44, 44, 0.3)',
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
    },
    press: {
        height: '90%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    dateHolderTextChoose: {
        backgroundColor: 'rgba(83, 83, 83, 0.8)',
    },
    dateHolderText: {
        color: 'white',
        fontSize: 15
    }
})

export default ChoosePeriod