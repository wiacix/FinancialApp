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
    analitycsHolder: {
        width: '100%',
        marginTop: 10,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    analitycsRow: {
        width: '90%',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5,
    },
    analitycsChart: {
        height: '100%',
        borderRadius: 15,
        width: '70%',
        borderWidth: 1,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    analitycsText: {
        marginLeft: 10,
        fontWeight: '500',
        color: '#100C12',
    },
    analitycsFillChart: {
        position: 'absolute',
        left: 0,
        height: '100%',
        borderRadius: 15,
    },
    analitycsTextHolder: {
        height: '100%',
        width: '30%',
        justifyContent: 'center'
    },
    analitycsTextAmount: {
        textAlign: 'right',
        color: colors.headerText,
        fontWeight: '600'
    },
    addButtonHolder: {
        width: '100%',
        height: 40,
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 7
    },
    addButton: {
        height: '100%',
        width: '40%',
        backgroundColor: '#100C14',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    plusHolder: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10
    },
    addButtonText: {
        color: 'white',
        fontSize: 12
    }
});


export default main;