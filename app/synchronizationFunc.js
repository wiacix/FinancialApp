import * as synchronization from '../settings/SQLite/synchronization'
import { useEffect, useState } from 'react';
import * as DB from '../settings/SQLite/query'
import Loading from '../components/Loading';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native'
import { router } from 'expo-router';
import global from '../settings/styles/Global'

const synchronizationFunc = () => {
    const [user, setUser] = useState(DB.fetchUsers());
    const [lang, setLang] = useState(DB.fetchConfig().lang);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        try{
            synchronization.downloadData(user.idGlobal);
        }catch(err){
            console.log('err', err);
        }finally{
            setTimeout(() => {
                setIsLoading(false);
                router.push("/home/");
            }, 1000)
        }
    }, [])

    return (
        <>
        <StatusBar hidden={true} />
        <View style={global.bg}>
            {isLoading && <Loading lang={lang}/>}
        </View>
        </>
    )
}

export default synchronizationFunc;