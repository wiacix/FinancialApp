import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
import style from '../settings/styles/LogScreen';
import { useEffect, useState } from 'react';
import Dictionary from '../settings/Dictionary/Dictionary';
import * as DB from '../settings/SQLite/query'
import { Redirect } from 'expo-router';
import InputPIN from '../components/InputPIN';
import Loading from '../components/Loading';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import colors from '../settings/styles/colors';

const index = () => {
    const [login, setLogin] = useState(false);
    const [pinValueWindow, setPinValueWindow] = useState(false);
    const [setting, setSetting] = useState({lang: 'pl', pin: 'null', touchId: 0});
    const [authentication, setAutentication] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPin, setIsPin] = useState(false);
    const [isTouchId, setIsTouchId] = useState(false);
    const [finishSynch, setFinishSynch] = useState(false);

    const touchIdAuthorization = async () => {
      const biometricAuth = await LocalAuthentication.authenticateAsync({promptMessage: Dictionary.LoginInTouchId[setting.lang]});
      if(biometricAuth.success) setAutentication(true);
    }

    useEffect(() => {
      setIsLoading(true);
      if(DB.checkDB() == null) setLogin(true)
      else{
          const fetchUser = DB.fetchUsers();
          if(fetchUser == null) setLogin(true)
          else if(fetchUser.logout == 1 && fetchUser.currentGroupId != null){
            setSetting(DB.fetchConfig());
            setFinishSynch(true);
            setIsLoading(false);
          }else setLogin(true)
      }
    }, []);

    useEffect(() => {
      if(finishSynch){
        if(setting.touchId) touchIdAuthorization();
        else if(setting.pin != 'null' || setting.pin != 'nullx') setPinValueWindow(true);
        else setAutentication(false);
      }
    }, [finishSynch])

  return (
    <>
    {isLoading && <Loading lang={setting.lang}/>}
    {login && <Redirect href="/loginIndex" />}
    {authentication && <Redirect href="/synchronizationFunc" />}
    {pinValueWindow && <InputPIN onClose={setPinValueWindow} lang={setting.lang} pin={'nullx'} btnText={Dictionary.LogIn[setting.lang]} correctPin={setting.pin} authorization={setAutentication} />}
    <StatusBar hidden={true} />
    <View style={style.bg}>
        <Image source={require('../assets/splash.png')} style={style.MainImage} resizeMode='contain' />
        <View style={{gap: 20}}>
          {(setting.pin!='null' && setting.pin!='nullx') && <Pressable onPress={() => setPinValueWindow(true)}><MaterialIcons name="fiber-pin" size={80} color="white" /></Pressable>}
          {setting.touchId==1 && <Pressable onPress={() => touchIdAuthorization()}><Ionicons name="finger-print" size={80} color="white" /></Pressable>}
        </View>
        <Pressable onPress={() => setLogin(true)} style={{width: '70%', height: 50, borderColor: colors.contener, borderWidth: 1, backgroundColor: colors.secondColorTransparent, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20}}>
          <SimpleLineIcons name="logout" size={30} color="white" />
          <Text style={{color: colors.inputText, fontSize: 20, letterSpacing: 1.5, fontWeight: 500}}>{Dictionary.LogOut[setting.lang]}</Text>
        </Pressable>
    </View>
    </>
  );
}

export default index;