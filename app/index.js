import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
import style from '../settings/styles/LogScreen';
import { useEffect, useState } from 'react';
import Dictionary from '../settings/Dictionary/Dictionary';
import * as DB from '../settings/SQLite/query'
import { Redirect } from 'expo-router';


const login = () => {
    const [login, setLogin] = useState(false);
    const [synch, setSynch] = useState(false);

  useEffect(() => {
    if(DB.checkDB() == null) setLogin(true)
    else{
        const fetchUser = DB.fetchUsers();
        if(fetchUser == null) setLogin(true)
        else if(fetchUser.logout == 1) setSynch(true)
        else setLogin(true)
    }
  }, []);

  return (
    <>
    {login && <Redirect href="/login" />}
    {synch && <Redirect href="/synchronizationFunc" />}
    <StatusBar hidden={true} />
    <View style={style.bg}>
        <Image source={require('../assets/splash.png')} style={style.MainImage} resizeMode='contain' />
        <Text style={{color: 'white', fontSize: 30, fontWeight: '600'}}>{Dictionary.Loading['en']}...</Text>
    </View>
    </>
  );
}

export default login;