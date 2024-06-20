import colors from './colors';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    bg:{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20
    }, //Text
    h1:{
        color: colors.headerText,
        fontSize: 40,
        fontWeight: '600',
        textAlign: 'center'
    },
    h2:{
        color: colors.headerText,
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        width: '95%'
    },
    h3:{
        color: colors.headerText,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        width: '95%'
    },
    h4:{
        color: colors.headerText,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginHorizontal: 5
    },
    h5:{
        color: colors.placeholderText,
        fontSize: 14,
        width: '95%'
    },//Image
    MainImage:{
        width: '90%',
        height: '30%'
    },//View for Input
    InputHolder:{
        width: '100%',
        alignItems: 'center'
    }
});


export default style;