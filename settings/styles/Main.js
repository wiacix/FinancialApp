import colors from './colors';
import { StyleSheet } from 'react-native';

const main = StyleSheet.create({
    topBox: {
        backgroundColor: colors.secondColor,
        width: '100%',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        position: 'absolute',
        top: 0
    },
    dateHolder:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5
    },
    dateHolderText:{
        fontSize: 16,
        color: colors.background
    },
    dateHolderTextChoose:{
        textDecorationLine: 'underline',
        color: colors.headerText
    },
    intervalHolder:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 15
    },
    intervalHolderText:{
        color: colors.headerText,
        fontSize: 14,
        fontWeight: '600'
    },
});


export default main;