import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import style from '../settings/styles/LogScreen';
import Input from '../components/Input';
import Dictionary from '../settings/Dictionary/Dictionary';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Link, useRouter, Redirect } from 'expo-router';
import * as DB from '../settings/Database/query'

const index = () => {
  const [lang, setLang] = useState('pl'); //'pl' & 'en'
  const [user, setUser] = useState([]);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    DB.createTable();
    DB.fetchUsers(setUser);

    //DB.deleteUser('Kamil');
    //DB.insertUser('test', 'pass', '123', '456');
  }, []);

  const LogIn = () => {
    if(!login && !password){
      console.log(user);
    }else{
      console.log('brak wszystkich danych');
    }
  }

  return (
    <>
    {user.length > 0 && <Redirect href="/group" />}
    <StatusBar style="auto" />
    <View style={style.bg}>
      <Text style={style.h1}>{Dictionary.Welcome[lang]}</Text>
      <Image source={require('../assets/Background.png')} style={style.MainImage} resizeMode='contain' />
      <Text style={style.h2}>{Dictionary.LogIn[lang]}</Text>
      <View style={style.InputHolder}>
        <Input name={Dictionary.UserName[lang]} value={login} onChange={e => setLogin(e)}/>
        <Input name={Dictionary.Password[lang]} type='password' value={password} onChange={e => setPassword(e)}/>
      </View>
      <Text style={style.h5}>{Dictionary.ForgotPassword[lang]}</Text>
      <Button name={Dictionary.LogIn[lang]} onPress={() => LogIn()}/>
      <Text style={style.h4}>{Dictionary.NewUser[lang]} <Link href="/register"><Text style={[style.h4, {textDecorationLine: 'underline'}]}>{Dictionary.SignUp[lang]}</Text></Link></Text>
    </View>
    </>
  );
}

export default index;