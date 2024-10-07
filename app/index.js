import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
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

const index = () => {
  const [lang, setLang] = useState(''); //'pl' & 'en'
  const [user, setUser] = useState();
  const [login, setLogin] = useState('JustynaG');
  const [password, setPassword] = useState('A');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    DB.prepareDataBase();
    setUser(DB.fetchUsers());
    setLang(DB.fetchConfig().lang);
    
    //DB.deleteUser('Test');
    //DB.insertUser('test', 'pass', 'Kamil', '456');
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
            DB.insertUser(result.data.user[0], result.data.user[1], result.data.user[2], result.data.user[3], result.data.user[4], result.data.user[5]);
            DB.addSessionKeyToUser(result.data.user[0], result.data.sessionKey);
            if(result.data.user[5] == null || result.data.user[5] == "") router.push("/group");
            else router.push("/synchronizationFunc");
          } else console.log(result.data);
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
    {user && <Redirect href="/group" />}
    <StatusBar hidden={true} />
    <View style={style.bg}>
      {isLoading && <Loading lang={lang}/>}
      <Text style={global.h1}>{Dictionary.Welcome[lang]}</Text>
      <Image source={require('../assets/splash.png')} style={style.MainImage} resizeMode='contain' />
      <Text style={global.h2}>{Dictionary.LogIn[lang]}</Text>
      <View style={style.InputHolder}>
        <Input name={Dictionary.UserName[lang]} value={login} onChange={e => setLogin(e.trim())}/>
        <Input name={Dictionary.Password[lang]} type='password' value={password} onChange={e => setPassword(e)}/>
      </View>
      <Text style={global.h5}>{Dictionary.ForgotPassword[lang]}</Text>
      <Button name={Dictionary.LogIn[lang]} onPress={() => LogIn()}/>
      <Text style={global.h4}>{Dictionary.NewUser[lang]} <Link href="/register"><Text style={[style.h4, {textDecorationLine: 'underline'}]}>{Dictionary.SignUp[lang]}</Text></Link></Text>
    </View>
    </>
  );
}

export default index;