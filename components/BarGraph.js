import { View, Text, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import main from '../settings/styles/Main';

const BarGraph = (props) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const width = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        const targetWidth = (containerWidth * (parseFloat(props.item.procent)<0 ? 0 : parseFloat(props.item.procent))) / 100;
        Animated.timing(width, {
        toValue: targetWidth,
        duration: 1000,
        useNativeDriver: false
        }).start();
    }, [props.item.procent, containerWidth]);
    return (
        <View style={{...main.analitycsRow}}>
        <View 
            onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width.toFixed(2));
            }} 
            style={{...main.analitycsChart, borderColor: props.item.color, backgroundColor: props.item.color+'33'}}
        >
            <Animated.View style={{...main.analitycsFillChart, width: width, backgroundColor: props.item.color}}></Animated.View>
            <Text style={main.analitycsText}>{props.item.name}</Text>
        </View>
        <View style={{...main.analitycsTextHolder}}>
            <Text style={{...main.analitycsTextAmount}}>{props.item.amount<0 ? 0 : props.item.amount} PLN</Text>
        </View>
        </View>
    )
}

export default BarGraph