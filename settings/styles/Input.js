import colors from './colors';
import { StyleSheet } from 'react-native';

const Input = StyleSheet.create({
    bg:{
        width: '95%',
        backgroundColor: colors.secondColor,
        borderRadius: 10,
        justifyContent: 'center',
        marginVertical: 10,
        fontSize: 16,
        paddingVertical: 15,
        paddingLeft: 10,
        color: colors.inputText
    },
    placeholderText:{
        color: colors.placeholderText,
    }
});


export default Input;