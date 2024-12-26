import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet, Pressable } from 'react-native';
import global from '../settings/styles/Global';
import * as DB from '../settings/SQLite/query'
import Dictionary from '../settings/Dictionary/Dictionary';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const SideMenu = (props) => {
    const [activeGroup, setActiveGroup] = useState(DB.selectValueFromColumnCondition('groups', '*', 'Id='+props.user.currentGroupId)[0]);
    const [nameMenu, setNameMenu] = useState(DB.fetchConfig().sideMenuName || 0);
    const sideMenuValue = [
        {id: 1, name: Dictionary.MainView[props.lang], href: '/home/'},
        {id: 2, name: Dictionary.Planning[props.lang], href: '/home/planning'},
        {id: 3, name: Dictionary.Accounts[props.lang], href: '/home/accounts'},
        {id: 4, name: Dictionary.Categorys[props.lang], href: '/home/categoryManager'},
        {id: 5, name: Dictionary.Groups[props.lang], href: '/home/groupManager'},
        {id: 6, name: Dictionary.Settings[props.lang], href: '/home/setting'}
    ];

    const TypeOfSideMenuName = [
        {id: 0, name: props.user.login},
        {id: 1, name: props.user.name},
        {id: 2, name: props.user.name+' '+props.user.surname}
    ]

    const pan = useRef(new Animated.Value(0)).current; // Użycie tylko jednej osi
    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx < 0) { // tylko ruch w lewo
            Animated.event([null, { dx: pan }], { useNativeDriver: false })(_, gestureState);
            }
        },
        onPanResponderRelease: (_, { dx }) => {
            if (dx < -100) {
            Animated.timing(pan, {
                toValue: -300, // przesuń komponent poza ekran
                duration: 300,
                useNativeDriver: false
            }).start(() => {
                props.closeMenu(false);
            });
            } else {
            Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: false
            }).start();
            }
        },
        onPanResponderTerminate: () => {
            Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false
            }).start();
        }
        })
    ).current;

    return (
        <View style={styles.box}>
            <Animated.View
            {...panResponder.panHandlers}
            style={[{ transform: [{ translateX: pan }] }, styles.animationBox]}
            >
            <View style={styles.container}>
                <Text style={{...global.h3, textTransform: 'uppercase'}} >{TypeOfSideMenuName[nameMenu].name}</Text>
                <Text style={{...global.h4, fontWeight: '300', marginTop: 10}} >{props.groupName || activeGroup.Name}</Text>
                <View style={styles.menu}>
                    {sideMenuValue.map((item) => (
                        <Pressable onPress={() => router.push(item.href)} key={item.id} style={styles.item}>
                            <View style={styles.triangleHolder}>
                                {props.currentWindow==item.id && (
                                    <Entypo name="triangle-right" size={30} color="white" />
                                )}
                            </View>
                            <Text style={{...styles.itemText, fontWeight: (props.currentWindow==item.id ? '500' : '300')}}>{item.name}</Text>
                        </Pressable>
                    ))}
                </View>
                <Pressable onPress={() => {DB.deleteUser(props.user.login); router.push('../../')}} style={{marginTop: 30, borderTopColor: 'white', borderTopWidth: 1, width: '100%', flexDirection: 'row', paddingVertical: 20, justifyContent: 'center'}}>
                    <View style={styles.triangleHolder}>
                        <SimpleLineIcons name="logout" size={24} color="white" />
                    </View>
                    <Text style={{...styles.itemText}}>{Dictionary.LogOut[props.lang]}</Text>
                </Pressable>
            </View>
            </Animated.View>
        </View>
        
    );
};

const styles = StyleSheet.create({
    animationBox: {
        height: '100%',
        width: '100%'
    },
    container: {
        height: '100%',
        width: '70%',
        top: 0,
        left: 0,
        backgroundColor: '#293038',
        zIndex: 1,
        alignItems: 'center',
        paddingVertical: 20
    },
    box: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: '#000000B0',
        zIndex: 2
    },
    menu: {
        width: '100%',
        borderTopColor: 'white',
        borderTopWidth: 1,
        marginTop: 10
    },
    item: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        marginLeft: 10
    },
    itemText: {
        color: 'white',
        fontSize: 20
    },
    triangleHolder: {
        width: 40
    }
});

export default SideMenu;
