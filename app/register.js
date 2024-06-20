import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import style from '../settings/styles/LogScreen';
import Input from '../components/Input';
import Dictionary from '../settings/Dictionary/Dictionary';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { useRouter } from 'expo-router';
import * as DB from '../settings/Database/query'

export default function register() {
  const [lang, setLang] = useState('pl'); //'pl' & 'en'
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const SignUp = () => {
    if(login && password && name && surname){
      DB.insertUser(login, password, name, surname);
      router.push("/group");
    }else{
      console.log('Brak wszystkich danych');
    }
  }

  return (
    <>
    <StatusBar style="auto" />
    <View style={style.bg}>
      <Text style={style.h1}>{Dictionary.Welcome[lang]}</Text>
      <Image source={require('../assets/Background.png')} style={style.MainImage} resizeMode='contain' />
      <Text style={style.h2}>{Dictionary.SignUp[lang]}</Text>
      <View style={style.InputHolder}>
        <Input name={Dictionary.UserName[lang]} value={login} onChange={e => setLogin(e)}/>
        <Input name={Dictionary.Password[lang]} type='password' value={password} onChange={e => setPassword(e)}/>
        <Input name={Dictionary.Name[lang]} value={name} onChange={e => setName(e)}/>
        <Input name={Dictionary.Surname[lang]} value={surname} onChange={e => setSurname(e)}/>
      </View>
      <Button name={Dictionary.SignUp[lang]} onPress={() => SignUp()}/>
    </View>
    </>
  );
}
