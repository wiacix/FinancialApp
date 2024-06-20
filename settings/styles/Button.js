import colors from './colors';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    bg:{
        width: '95%',
        backgroundColor: colors.button,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        fontSize: 16,
        paddingVertical: 15
    },
    text:{
        color: colors.inputText,
        fontSize: 16,
        fontWeight: '600'
    }
});


export default style;