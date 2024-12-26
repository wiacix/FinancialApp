import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
import style from '../settings/styles/LogScreen';
import { useEffect, useState } from 'react';
import Dictionary from '../settings/Dictionary/Dictionary';
import * as DB from '../settings/SQLite/query'
import { Redirect } from 'expo-router';
import axios from 'axios';
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
    const [setting, setSetting] = useState(DB.fetchConfig());
    const [authentication, setAutentication] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPin, setIsPin] = useState(false);
    const [isTouchId, setIsTouchId] = useState(false);
    const [finishSynch, setFinishSynch] = useState(false);

    async function updateSetting(fetchUser) {
      let data = {
        idGlobal: fetchUser.idGlobal,
        sessionKey: fetchUser.sessionKey
      }
      try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=get_users', data);
        if(result.data.response){
          DB.updateSettings(result.data.user[0], result.data.user[8], result.data.user[9], result.data.user[10], result.data.user[11], result.data.user[7], result.data.user[6], result.data.user[12], result.data.user[13], result.data.user[14]);
          setIsPin((result.data.user[13]!='null' && true));
          setIsTouchId((result.data.user[14]==1 && true));
          setFinishSynch(true);
      }
      }catch(err){
          console.log('err', err);
      }finally{
          setSetting(DB.fetchConfig());
      }
    }

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
            updateSetting(fetchUser);
            setIsLoading(false);
          }else setLogin(true)
      }
    }, []);

    useEffect(() => {
      if(finishSynch){
        if(isTouchId) touchIdAuthorization();
        else if(isPin) setPinValueWindow(true);
        else setAutentication(true);
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
          {setting.pin!='null' && <Pressable onPress={() => setPinValueWindow(true)}><MaterialIcons name="fiber-pin" size={80} color="white" /></Pressable>}
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