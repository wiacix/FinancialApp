import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import colors from '../settings/styles/colors';
import Entypo from '@expo/vector-icons/Entypo';
import Dictionary from '../settings/Dictionary/Dictionary';

const MoreCategory = (props) => (
    <View style={style.addButtonHolder}>
        <Pressable style={{...style.imageHolder, backgroundColor: colors.button}} onPress={() => props.setAllCategory(true)}>
            <Entypo name="plus" size={40} color="white" />
        </Pressable>
        <Text style={style.tileText}>{Dictionary.More[props.lang]}</Text>
    </View>
)

const SelectCategory = (props) => {
    const firstRow = props.grid.slice(0,4);
    const secondRow = props.grid.slice(4,6);
    const moreCategory = props.grid.length >= 8;
    const foundItem = props.grid.findIndex(item => item.Id === props.selectCategory);

  return (
    <>
    <View style={{width: '90%', alignItems: 'center'}}>
        <View style={style.row}>
            {firstRow.map((item, index) => (
                <Pressable key={index} style={{...style.tile, backgroundColor: (props.selectCategory==item.Id ? item.Color : '#00000000')}} onPress={() => props.setSelectCategory(item.Id)}>
                    <View style={{backgroundColor: item.Color, ...style.imageHolder}}>
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.Picture }}
                            style={{ width: (props.selectCategory==item.Id ? 35 : 30), height: (props.selectCategory==item.Id ? 35 : 30)}}
                        />
                    </View>
                    <Text style={style.tileText}>{item.Name.length > 6 ? item.Name.substring(0, 5) + '..' : item.Name}</Text>
                </Pressable>
            ))}
        </View>
        <View style={style.row}>
            {secondRow.map((item, index) => (
                <Pressable key={index} style={{...style.tile, backgroundColor: (props.selectCategory==item.Id ? item.Color : '#00000000')}} onPress={() => props.setSelectCategory(item.Id)}>
                    <View style={{backgroundColor: item.Color, ...style.imageHolder}}>
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+item.Picture }}
                            style={{ width: (props.selectCategory==item.Id ? 35 : 30), height: (props.selectCategory==item.Id ? 35 : 30)}}
                        />
                    </View>
                    <Text style={style.tileText}>{item.Name.length > 6 ? item.Name.substring(0, 5) + '..' : item.Name}</Text>
                </Pressable>
            ))}
            {foundItem>=7 ? (
                <Pressable style={{...style.tile, backgroundColor: (props.selectCategory==props.grid[foundItem].Id ? props.grid[foundItem].Color : '#00000000')}} onPress={() => props.setSelectCategory(props.grid[foundItem].Id)}>
                    <View style={{backgroundColor: props.grid[foundItem].Color, ...style.imageHolder}}>
                        <Image
                            source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+props.grid[foundItem].Picture }}
                            style={{ width: (props.selectCategory==props.grid[foundItem].Id ? 35 : 30), height: (props.selectCategory==props.grid[foundItem].Id ? 35 : 30)}}
                        />
                    </View>
                    <Text style={style.tileText}>{props.grid[foundItem].Name.length > 6 ? props.grid[foundItem].Name.substring(0, 5) + '..' : props.grid[foundItem].Name}</Text>
                </Pressable>
            ) : (props.grid.length >= 7 ? (
                (
                    <Pressable style={{...style.tile, backgroundColor: (props.selectCategory==props.grid[6].Id ? props.grid[6].Color : '#00000000')}} onPress={() => props.setSelectCategory(props.grid[6].Id)}>
                        <View style={{backgroundColor: props.grid[6].Color, ...style.imageHolder}}>
                            <Image
                                source={{ uri: process.env.EXPO_PUBLIC_API_URL+'IMG/'+props.grid[6].Picture }}
                                style={{ width: (props.selectCategory==props.grid[6].Id ? 35 : 30), height: (props.selectCategory==props.grid[6].Id ? 35 : 30)}}
                            />
                        </View>
                        <Text style={style.tileText}>{props.grid[6].Name.length > 6 ? props.grid[6].Name.substring(0, 5) + '..' : props.grid[6].Name}</Text>
                    </Pressable>
                )
            ) : null)}
            {moreCategory && <MoreCategory lang={props.lang} setAllCategory={props.setAllCategory} />}
        </View>
    </View>
    </>
  )
}

const style = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%',
        padding: 5
    },
    tile: {
        flexBasis: '22%', // Równa szerokość dla 4 kafelków (100% / 4 - margin)
        margin: '1%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10
    },
    addButtonHolder: {
        flexBasis: '22%', // Równa szerokość dla 4 kafelków (100% / 4 - margin)
        margin: '1%',
        padding: 10,
        alignItems: 'center',
    },
    imageHolder: {
        borderRadius: 50,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tileText: {
        color: 'white',
        marginTop: 2
    },
});

export default SelectCategory