import colors from './colors';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    bg:{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'space-around',
        alignItems: 'center'
    },//Image
    MainImage:{
        width: '90%',
        height: '30%'
    },//View for Input
    InputHolder:{
        width: '100%',
        alignItems: 'center'
    },
});


export default style;