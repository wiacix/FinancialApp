import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import style from '../settings/styles/LogScreen';
import Dictionary from '../settings/Dictionary/Dictionary';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useRouter } from 'expo-router';
import * as DB from '../settings/Database/query'

export default function group() {
  const [lang, setLang] = useState('pl'); //'pl' & 'en'
  const router = useRouter();
  const [user, setUser] = useState([]);
  const [template, setTemplate] = useState(0);
  const [groupCode, setGroupCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    DB.fetchUsers(setUser);
  }, []);

  useEffect(() => {
    if (user.length > 0) {
      setName(user[0].name);
    }
  }, [user])

  const JoinGroup = () => {
    
  }

  const CreateGroup = () => {

  }

  return (
    <>
    <StatusBar style="auto" />
    <View style={style.bg}>
      <Text style={style.h1}>{Dictionary.Welcome[lang]}, {name}!</Text>
      <Image source={require('../assets/Background.png')} style={style.MainImage} resizeMode='contain' />
      {template==0 ? ( //Join or create
            <>
                <Text style={style.h2}>{Dictionary.GroupInfoh1[lang]}</Text>
                <Text style={style.h3}>{Dictionary.GroupInfoh2[lang]}</Text>
                <Button name={Dictionary.JoinGroup[lang]} onPress={() => setTemplate(1)}/>
                <Button name={Dictionary.CreateGroup[lang]} onPress={() => setTemplate(2)}/>
            </>
      ): template==1 ? ( //Join group
            <>
                <Text style={style.h2}>{Dictionary.JoinGroup[lang]}</Text>
                <Text style={style.h3}>{Dictionary.InputGroupCode[lang]}</Text>
                <Input name={Dictionary.GroupCode[lang]} value={groupCode} onChange={e => setGroupCode(e)}/>
                <Button name={Dictionary.JoinGroup[lang]} onPress={() => JoinGroup()}/>
            </>
      ) : ( //Create group
            <>
                <Text style={style.h2}>{Dictionary.CreateGroup[lang]}</Text>
                <Text style={style.h3}>{Dictionary.InputGroupName[lang]}</Text>
                <Input name={Dictionary.GroupName[lang]} value={groupName} onChange={e => setGroupName(e)}/>
                <Button name={Dictionary.CreateGroup[lang]} onPress={() => CreateGroup()}/>
            </>
      )}
    </View>
    </>
  );
}
