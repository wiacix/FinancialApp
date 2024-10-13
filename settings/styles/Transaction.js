import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from './colors';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    container: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputHolder: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputHolderBox: {
        flex: 1
    },
    UnlockInput:{
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    UnlockInputFont:{
        fontSize: 25,
        color: colors.greyColor
    },
    alertHolder: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10
    },
    alertText: {
        fontSize: 12,
        fontWeight: '200'
    },
    pickAccount: {
        width: '90%',
        height: 50,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: colors.contener,
        flexDirection: 'row',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    submitBtn: {
        position: 'absolute',
        width: '50%',
        bottom: 10,
        backgroundColor: 'blue'
    }
})

export default style;