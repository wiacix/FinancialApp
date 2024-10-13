import axios from 'axios';
import * as DB from '../SQLite/query'

/*
Do uzupełnienia:
-groups -> Users -> GroupsId
-account (GroupsId)
-category (GroupsId)
-finance (AccountId)
-icon all
-planning (GroupsId)
-transfer (FromAccountId)

*/
export const downloadData = async (userId) => {
    let userGroupsId;
    let accountsId='';

    //Pobranie danych o użytkowniku
    let data = {
        idGlobal: userId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=get_users', data);
        if(result.data.response){
            userGroupsId = result.data.user[5];
        }
    }catch(err){
        console.log('1', err);
    }

    //Tabela Groups
    data = {
        FromTable: 'groups',
        WhereColumn: 'Id',
        WhereData: userGroupsId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        if(result.data.response){
            DB.insertData('groups', result.data.data);
        }
    }catch(err){
        console.log('2', err);
    }

    //Tabela Accounts
    data = {
        FromTable: 'account',
        WhereColumn: 'GroupsId',
        WhereData: userGroupsId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        result.data.data.forEach((row) => {
            accountsId += row.Code+',';
        })
        accountsId = accountsId.substring(0, accountsId.length-1);
        if(result.data.response){
            DB.insertData('account', result.data.data);
        }
    }catch(err){
        console.log('3', err);
    }

    //Tabela Category
    data = {
        FromTable: 'category',
        WhereColumn: 'GroupsId',
        WhereData: userGroupsId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        if(result.data.response){
            DB.insertData('category', result.data.data);
        }
    }catch(err){
        console.log('4', err);
    }

    //Tabela Account
    data = {
        FromTable: 'finance',
        WhereColumn: 'AccountCode',
        WhereData: accountsId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        if(result.data.response){
            DB.insertData('finance', result.data.data);
        }
    }catch(err){
        console.log('5', err);
    }

    //Tabela Icon
    data = {
        FromTable: 'icon',
        WhereColumn: '',
        WhereData: null,
        AllData: 1
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        if(result.data.response){
            DB.insertData('icon', result.data.data);
        }
    }catch(err){
        console.log('6', err);
    }

    //Tabela Planning
    data = {
        FromTable: 'planning',
        WhereColumn: 'GroupsId',
        WhereData: userGroupsId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        if(result.data.response){
            DB.insertData('planning ', result.data.data);
        }
    }catch(err){
        console.log('6', err);
    }

    //Tabela Transfer
    data = {
        FromTable: 'transfer',
        WhereColumn: 'FromAccountCode',
        WhereData: accountsId
    }
    try{
        const result = await axios.post(process.env.EXPO_PUBLIC_API_URL+'?action=synchronization', data);
        if(result.data.response){
            DB.insertData('transfer ', result.data.data);
        }
    }catch(err){
        console.log('6', err);
    }
}