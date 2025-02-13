import { View, Text, ScrollView, Image, Pressable, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import global from '../settings/styles/Global';
import { router } from 'expo-router';
import * as GF from '../settings/GlobalFunction';
import Dictionary from '../settings/Dictionary/Dictionary';

const Category = (props) => {
    const animatedValues = useRef({}); // Przechowujemy `Animated.Value` dla każdej kategorii
    const [currCategory, setCurrCategory] = useState(-1);

    const getAnimatedValue = (id) => {
        if (!animatedValues.current[id]) {
            animatedValues.current[id] = new Animated.Value(33); // Inicjalizacja, jeśli brak instancji
        }
        return animatedValues.current[id];
    };

    const chooseCategory = (id) => {
        // Jeśli ta sama kategoria jest wybrana, resetujemy animację
        if (currCategory === id) {
            Animated.timing(getAnimatedValue(id), {
                toValue: 33,
                duration: 500,
                useNativeDriver: false,
            }).start(() => props.setCurrCat(-1));
            setCurrCategory(-1);
        } else {
            // Jeśli zmieniamy kategorię, resetujemy poprzednią animację i aktywujemy nową
            if (currCategory !== -1) {
                Animated.timing(getAnimatedValue(currCategory), {
                    toValue: 33,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
            Animated.timing(getAnimatedValue(id), {
                toValue: 99,
                duration: 500,
                useNativeDriver: false,
            }).start(() => props.setCurrCat(id));
            setCurrCategory(id);
        }
    };

    return (
        <>
            {props.value.length === 0 && (
                <Text style={{ color: 'white', textAlign: 'center' }}>
                    {Dictionary.EmptySet[props.lang]}
                </Text>
            )}
            <ScrollView style={{ width: '100%' }} horizontal={true}>
                {props.value.map((row) => {
                    const animatedValue = getAnimatedValue(row.CategoryId); // Pobieramy instancję `Animated.Value` dla kategorii
                    const interpolatedColor = animatedValue.interpolate({
                        inputRange: [33, 99],
                        outputRange: [
                            GF.convertColor(row.Color, '33'),
                            GF.convertColor(row.Color, '99'),
                        ],
                    });

                    return (
                        <Pressable
                            key={row.CategoryId}
                            onPress={() => chooseCategory(row.CategoryId)}
                            style={{
                                marginRight: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginVertical: 5,
                            }}
                        >
                            <Animated.View
                                style={{
                                    backgroundColor: interpolatedColor,
                                    borderColor: row.Color,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 5,
                                    marginRight: 5,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View
                                        style={{
                                            width: 30,
                                            height: 30,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    process.env.EXPO_PUBLIC_API_URL +
                                                    'IMG/' +
                                                    row.Picture,
                                            }}
                                            style={{ width: 20, height: 20 }}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ ...global.h6, fontSize: 12 }}>{row.Name}</Text>
                                    <Text style={{ ...global.h6, fontSize: 10 }}>
                                        {row.suma.toFixed(2)} PLN
                                    </Text>
                                </View>
                            </Animated.View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </>
    );
};

export default Category;
