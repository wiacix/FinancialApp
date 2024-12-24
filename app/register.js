import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import style from '../settings/styles/LogScreen';
import global from '../settings/styles/Global';
import Input from '../components/Input';
import Dictionary from '../settings/Dictionary/Dictionary';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { router } from 'expo-router';
import * as DB from '../settings/SQLite/query'
import axios from 'axios';
import Loading from '../components/Loading';

export default function register() {
  const [lang, setLang] = useState(''); //'pl' & 'en'
  const [user, setUser] = useState();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(DB.fetchUsers());
    setLang(DB.fetchConfig().lang);
  }, []);

  useEffect(() => {
    if(user) router.push('/group');
  }, [user]);

  const SignUp = async () => {
    if(login && password && name && surname){
      setIsLoading(true);
      const data = {
        login: login,
        password: DB.hashPassword(password),
        name: name,
        surname: surname
      }
        try {
          const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=register_user', data);
          if(result.data.response){
            DB.insertUser(result.data.userId[0], login, password, name, surname, null);
            DB.addSessionKeyToUser(result.data.userId[0], result.data.sessionKey);
            router.push("/group");
          }
        }catch(err){
          console.log('err', err);
        }finally{
          setIsLoading(false);
        }

    }else{
      console.log('Brak wszystkich danych');
    }
  }

  return (
    <>
    <StatusBar hidden={true} />
    <View style={style.bg}>
      {isLoading && <Loading lang={lang}/>}
      <Text style={global.h1}>{Dictionary.Welcome[lang]}</Text>
      <Image source={require('../assets/splash.png')} style={style.MainImage} resizeMode='contain' />
      <Text style={global.h2}>{Dictionary.SignUp[lang]}</Text>
      <View style={style.InputHolder}>
        <Input name={Dictionary.UserName[lang]} value={login} onChange={e => setLogin(e.trim())}/>
        <Input name={Dictionary.Password[lang]} type='password' value={password} onChange={e => setPassword(e)}/>
        <Input name={Dictionary.Name[lang]} value={name} onChange={e => setName(e.trim())}/>
        <Input name={Dictionary.Surname[lang]} value={surname} onChange={e => setSurname(e.trim())}/>
      </View>
      <Button name={Dictionary.SignUp[lang]} onPress={() => SignUp()}/>
    </View>
    </>
  );
}
