// database.js
import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';

const db = SQLite.openDatabaseSync('LocalDataBase.db');

export const prepareDataBase = () => {
  db.execSync(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, idGlobal INTEGER, login varchar(30), password varchar(30), name varchar(30), surname varchar(30), sessionKey varchar(15), groupsid varchar(50));
    DROP TABLE IF EXISTS settings;
    CREATE TABLE IF NOT EXISTS settings (lang varchar(3));
    INSERT INTO settings (lang) VALUES ("pl");
    DROP TABLE IF EXISTS account;
    CREATE TABLE account (Id int(11) NOT NULL, Active int(11) NOT NULL, Name varchar(50) NOT NULL, Balance float NOT NULL, IconId int(11) NOT NULL, Color varchar(20) NOT NULL, Status int(11) NOT NULL, GroupsId int(11) NOT NULL, UpdateDate date NOT NULL);
    DROP TABLE IF EXISTS category;
    CREATE TABLE category ( Id int(11) NOT NULL, Name varchar(50) NOT NULL, Type int(11) NOT NULL, Planned float DEFAULT NULL, IconId int(11) NOT NULL, Color varchar(20) NOT NULL, GroupsId int(11) DEFAULT NULL);
    DROP TABLE IF EXISTS finance;
    CREATE TABLE finance ( Id int(11) NOT NULL, CategoryId int(11) NOT NULL, AccountId int(11) NOT NULL, Amount float NOT NULL, Date date NOT NULL, Description varchar(150) DEFAULT NULL);
    DROP TABLE IF EXISTS groups;
    CREATE TABLE groups ( Id int(11) NOT NULL, Name varchar(50) NOT NULL, Code varchar(6) NOT NULL);
    DROP TABLE IF EXISTS icon;
    CREATE TABLE icon ( Id int(11) NOT NULL, Type int(11) NOT NULL, Picture varchar(25) NOT NULL);
    DROP TABLE IF EXISTS planning;
    CREATE TABLE planning ( Id int(11) NOT NULL, CategoryId int(11) NOT NULL, Date date NOT NULL, PlannedAmount float NOT NULL, GroupsId int(11) NOT NULL, Status int(11) NOT NULL);
    DROP TABLE IF EXISTS transfer;
    CREATE TABLE transfer ( Id int(11) NOT NULL, FromAccountId int(11) NOT NULL, ToAccountId int(11) NOT NULL, Amount float NOT NULL, Date date NOT NULL, Description varchar(150) DEFAULT NULL);
    `);
}

export const fetchConfig = () => {
  const firstRow = db.getFirstSync("SELECT * FROM settings");
  return firstRow;
}

export const fetchUsers = () => {
  const firstRow = db.getFirstSync('SELECT * FROM users');
  return firstRow;
}

export const deleteUser = (name) => {
  db.runSync(
    "DELETE FROM users WHERE name like ?;", name
  )
}

export const hashPassword = (password) => {
  return CryptoJS.MD5(password).toString();
};

export const insertUser = (idGlobal, login, password, name, surname, groupsId) => {
  password = hashPassword(password);
  db.runSync(
    "INSERT INTO users (idGlobal, login, password, name, surname, groupsid) VALUES (?,?,?,?,?,?);", idGlobal, login, password, name, surname, groupsId
  )
}

export const addFirstGroup = (idGroups, idGlobal) => {
  db.runSync(
    "UPDATE users SET groupsId = ? WHERE idGlobal = ?;", idGroups, idGlobal
  )
}

export const addSessionKeyToUser = (idGlobal, sessionKey) => {
  db.runSync(
    "UPDATE users set sessionKey = ? WHERE idGlobal = ?;", sessionKey, idGlobal
  )
}

export const insertData = (tableName, data) => {
  const columns = Object.keys(data[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

  data.forEach((row) => {
    const values = columns.map((column) => row[column]);
    db.runAsync(
      query, values
    )
  })
}

export const selectSumFromTable = (TableName, ColumnToSum, whereAccountId, condition) => {
  let query;
  if(whereAccountId==-1){
    query = `SELECT sum(${ColumnToSum}) as balance, 'Suma' as nazwa FROM ${TableName} WHERE Status = 1 AND ${condition}`;
  }else{
    query = `SELECT sum(${ColumnToSum}) as balance, Name as nazwa, IconId FROM ${TableName} WHERE Id = ${whereAccountId} AND ${condition}`;
  }
  const result = db.getFirstSync(query)
  return result;
}

export const selectValueFromColumn = (TableName, Column, whereColumn, whereValue) => {
  const result = db.getAllSync(`SELECT ${Column} FROM ${TableName} WHERE ${whereColumn} IN (${whereValue});`);
  return result;
}

export const selectFinance = (whereAccountId, fromDate, toDate, transfer) => {
  if(whereAccountId==-1){
    query = `SELECT f.CategoryId, c.name, i.picture, c.color, ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN account a ON f.accountId = a.Id INNER JOIN category c ON f.categoryId = c.Id INNER JOIN icon i ON c.IconId = i.Id WHERE f.Date BETWEEN '${fromDate}' AND '${toDate}' AND a.Status=1 AND c.Type = '${transfer}' GROUP BY f.CategoryId ORDER BY ROUND(SUM(f.amount),2) DESC;`;
  }else{
    query = `SELECT f.CategoryId, c.name, i.picture, c.color, ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN account a ON f.accountId = a.Id INNER JOIN category c ON f.categoryId = c.Id INNER JOIN icon i ON c.IconId = i.Id WHERE f.AccountId = ${whereAccountId} AND f.Date BETWEEN '${fromDate}' AND '${toDate}' AND c.Type = '${transfer}' GROUP BY f.CategoryId ORDER BY ROUND(SUM(f.amount),2) DESC;`;
  }
  const result = db.getAllSync(query);
  return result;
}

export const selectPeriodSum = (whereAccountId, fromDate, toDate, transfer) => {
  if(whereAccountId==-1){
    query = `SELECT ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN account a ON a.Id = f.AccountId INNER JOIN category c ON f.categoryId = c.Id WHERE f.Date BETWEEN '${fromDate}' AND '${toDate}' AND a.Status=1 AND c.Type = '${transfer}';`;
  }else{
    query = `SELECT ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN category c ON f.categoryId = c.Id WHERE f.AccountId = ${whereAccountId} AND f.Date BETWEEN '${fromDate}' AND '${toDate}' AND c.Type = '${transfer}';`;
  }
  const result = db.getAllSync(query);
  return result;
}

export const selectValueFromColumnCondition = (TableName, Column, whereCondition) => {
  const result = db.getAllSync(`SELECT ${Column} FROM ${TableName} WHERE ${whereCondition} ;`);
  return result;
}

export const selectWithoutFrom = (Column) => {
  const result = db.getAllSync(`SELECT ${Column} ;`);
  return result;
}

export const updateValue = (updateTable, updateSet, updateCondition) => {
  db.runSync(
    `UPDATE ${updateTable} SET ${updateSet} WHERE ${updateCondition};`
  )
}

export const insertPlanning = (incomeTable, expanseTable, date) => {
  const now = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  incomeTable.map((item) => {
    if(item.Value>0){
      db.runSync(
        `INSERT INTO planning (Id, CategoryId, Date, PlannedAmount, GroupsId, Status) VALUES ((SELECT max(Id)+1 FROM planning), ${item.Id}, '${now}', ${item.Value}, 5, 1)`
      )
    }
  })
  expanseTable.map((item) => {
    if(item.Value>0){
      db.runSync(
        `INSERT INTO planning (Id, CategoryId, Date, PlannedAmount, GroupsId, Status) VALUES ((SELECT max(Id)+1 FROM planning), ${item.Id}, '${now}', ${item.Value}, 5, 1)`
      )
    }
  })
}