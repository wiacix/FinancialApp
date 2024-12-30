import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
import style from '../settings/styles/LogScreen';
import global from '../settings/styles/Global'
import Input from '../components/Input';
import Dictionary from '../settings/Dictionary/Dictionary';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Link, router, Redirect } from 'expo-router';
import * as DB from '../settings/SQLite/query'
import axios from 'axios';
import Loading from '../components/Loading';
import Entypo from '@expo/vector-icons/Entypo';
import colors from '../settings/styles/colors';
import Alert from '../components/Alert';

const loginIndex = () => {
  const [lang, setLang] = useState('');
  const [user, setUser] = useState();
  const [isGroup, setIsGroup] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveLogin, setSaveLogin] = useState(false);
  const [wrongLogin, setWrongLogin] = useState(false);

  useEffect(() => {
    DB.prepareDataBase();
    setUser(DB.fetchUsers());
    setLang(DB.fetchConfig().lang);
    if(DB.fetchUsers() != null && DB.fetchUsers().groupsid == null) setIsGroup(true);
  }, []);

  const LogIn = async () => {
    if(login && password){
      setIsLoading(true);
      const data = {
        login: login,
        password: DB.hashPassword(password)
      }
        try {
          const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=login_user', data);
          if(result.data.response){
            DB.insertUser(result.data.user[0], result.data.user[1], result.data.user[2], result.data.user[3], result.data.user[4], result.data.user[5], saveLogin);
            DB.addSessionKeyToUser(result.data.user[0], result.data.sessionKey);
            if(result.data.user[5] == null || result.data.user[5] == "") router.push("/group");
            else router.push("/synchronizationFunc");
          } else if(!result.data.found) setWrongLogin(true);
            else console.log(result.data);
          }catch(err){
            console.log('err', err);
          }finally{
            setIsLoading(false);
          }
    }else{
      console.log('brak wszystkich danych');
    }
  }

  return (
    <>
    <StatusBar hidden={true} />
    {isGroup && <Redirect href="/group" />}
    <View style={style.bg}>
      {wrongLogin && <Alert close={setWrongLogin} ok={Dictionary.Ok[lang]} text={Dictionary.WrongLogin[lang]} />}
      {isLoading && <Loading lang={lang}/>}
      <Text style={global.h1}>{Dictionary.Welcome[lang]}</Text>
      <Image source={require('../assets/splash.png')} style={style.MainImage} resizeMode='contain' />
      <Text style={global.h2}>{Dictionary.LogIn[lang]}</Text>
      <View style={style.InputHolder}>
        <Input name={Dictionary.UserName[lang]} value={login} onChange={e => setLogin(e.trim())}/>
        <Input name={Dictionary.Password[lang]} type='password' value={password} onChange={e => setPassword(e)}/>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 15}}>
          <Pressable onPress={() => setSaveLogin(!saveLogin)} style={{width: 20, height: 20, borderWidth: 1, borderColor: 'grey', marginRight: 7, backgroundColor: (saveLogin ? colors.button : colors.background), justifyContent: 'center', alignItems: 'center'}}>
            {saveLogin && <Entypo name="check" size={14} color="white" />}
          </Pressable>
          <Text style={global.h5}>{Dictionary.SaveLogin[lang]}</Text>
      </View>
      <Text style={global.h5}>{Dictionary.ForgotPassword[lang]}</Text>
      <Button name={Dictionary.LogIn[lang]} onPress={() => LogIn()}/>
      <Text style={global.h4}>{Dictionary.NewUser[lang]} <Link href="/register"><Text style={[style.h4, {textDecorationLine: 'underline'}]}>{Dictionary.SignUp[lang]}</Text></Link></Text>
    </View>
    </>
  );
}

export default loginIndex;