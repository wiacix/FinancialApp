import colors from './colors';
import { StyleSheet } from 'react-native';

const global = StyleSheet.create({
    bg:{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'flex-start',
        alignItems: 'center'
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
        textAlign: 'center'
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
    },
    h6:{
        color: colors.headerText,
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        marginHorizontal: 5
    },//Back arrow
    leftTopIcon:{
        position: 'absolute',
        left: 10,
        top: 15,
        zIndex: 1
    },//Header Box
    topBox: {
        backgroundColor: colors.secondColor,
        width: '100%',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35
    },
    headerInputHolder: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 50
    },
    headerInput: {
        width: '40%',
        paddingVertical: 10,
        justifyContent: 'center',
        borderRadius: 20
    },
    chooseInput:{
        backgroundColor: colors.background
    },
    MainBox:{
        backgroundColor: colors.contener,
        width: '90%',
        borderRadius: 20,
        marginTop: -40
    },
    ammountHolder:{
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },
    addButton:{
        backgroundColor: colors.button,
        width: 50,
        height: 50,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    addButtonHolder:{
        width: '100%',
        alignItems: 'flex-end',
        marginTop: -20
    },
    contentBox:{
        width: '90%',
        marginTop: 10
    },
    bottomBox:{
        backgroundColor: colors.secondColor,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    
});


export default global;