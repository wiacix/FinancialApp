import { StatusBar } from 'expo-status-bar';
import { Text, View, Image } from 'react-native';
import style from '../settings/styles/LogScreen';
import global from '../settings/styles/Global';
import Dictionary from '../settings/Dictionary/Dictionary';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useRouter } from 'expo-router';
import * as DB from '../settings/SQLite/query'
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import Loading from '../components/Loading';

export default function group() {
  const [lang, setLang] = useState(DB.fetchConfig().lang); //'pl' & 'en'
  const router = useRouter();
  const [user, setUser] = useState(DB.fetchUsers());
  const [sessionKey, setSessionKey] = useState('');
  const [template, setTemplate] = useState(0);
  const [groupCode, setGroupCode] = useState('');
  const [groupName, setGroupName] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(user.name);
    setSessionKey(user.sessionKey);
  }, []);

  const JoinGroup = async () => {
    if(groupCode){
      setIsLoading(true);
      const data = {
        groupCode: groupCode,
        userId: user.idGlobal
      }
      try {
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=join_group', data);
        if(result.data.response){
          DB.addFirstGroup(result.data.GroupId[0], user.idGlobal);
          router.push("/synchronizationFunc");
        }
      }catch(err){
        console.log('err', err);
      }finally{
        setIsLoading(false);
      }
    }
  }

  const CreateGroup = async () => {
    if(groupName){
      setIsLoading(true);
      const data = {
        groupName: groupName,
        userId: user.idGlobal
      }
      try {
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=add_group', data);
        if(result.data.response){
          DB.addFirstGroup(result.data.GroupId[0], user.idGlobal);
          router.push("/synchronizationFunc");
        }
      }catch(err){
        console.log('err', err);
      }finally{
        setIsLoading(false);
      }
    }
  }

  return (
    <>
    <StatusBar hidden={true} />
    <View style={style.bg}>
      {isLoading && <Loading lang={lang}/>}
      <Text style={global.h1}>{Dictionary.Welcome[lang]}, {name}!</Text>
      <Image source={require('../assets/splash.png')} style={style.MainImage} resizeMode='contain' />
      {template==0 ? ( //Join or create
            <>
              <Text style={global.h2}>{Dictionary.GroupInfoh1[lang]}</Text>
              <Text style={{...global.h3, width: '95%'}}>{Dictionary.GroupInfoh2[lang]}</Text>
              <Button name={Dictionary.JoinGroup[lang]} onPress={() => setTemplate(1)}/>
              <Button name={Dictionary.CreateGroup[lang]} onPress={() => setTemplate(2)}/>
            </>
      ): template==1 ? ( //Join group
            <>
              <Ionicons name="arrow-back" size={34} color="white" style={global.leftTopIcon} onPress={() => setTemplate(0)} />
              <Text style={global.h2}>{Dictionary.JoinGroup[lang]}</Text>
              <Text style={{...global.h3, width: '95%'}}>{Dictionary.InputGroupCode[lang]}</Text>
              <Input name={Dictionary.GroupCode[lang]} value={groupCode} onChange={e => setGroupCode(e)}/>
              <Button name={Dictionary.JoinGroup[lang]} onPress={() => JoinGroup()}/>
            </>
      ) : ( //Create group
            <>
              <Ionicons name="arrow-back" size={34} color="white" style={global.leftTopIcon} onPress={() => setTemplate(0)} />
              <Text style={global.h2}>{Dictionary.CreateGroup[lang]}</Text>
              <Text style={{...global.h3, width: '95%'}}>{Dictionary.InputGroupName[lang]}</Text>
              <Input name={Dictionary.GroupName[lang]} value={groupName} onChange={e => setGroupName(e)}/>
              <Button name={Dictionary.CreateGroup[lang]} onPress={() => CreateGroup()}/>
            </>
      )}
    </View>
    </>
  );
}
