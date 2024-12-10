// database.js
import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';
import * as GF from '../GlobalFunction';

const db = SQLite.openDatabaseSync('LocalDataBase.db');

export const prepareDataBase = () => {
  db.execSync(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE IF NOT EXISTS users (idGlobal INTEGER, login varchar(30), password varchar(30), name varchar(30), surname varchar(30), sessionKey varchar(15), groupsid varchar(50), currentGroupId INT NULL, logout INTEGER);
    DROP TABLE IF EXISTS settings;
    CREATE TABLE IF NOT EXISTS settings (lang varchar(3));
    INSERT INTO settings (lang) VALUES ("pl");
    DROP TABLE IF EXISTS account;
    CREATE TABLE account (Id int(11) NOT NULL, Code int(11) NOT NULL, Active int(11) NOT NULL, Name varchar(50) NOT NULL, Balance float NOT NULL, IconId int(11) NOT NULL, Color varchar(20) NOT NULL, Status int(11) NOT NULL, GroupsId int(11) NOT NULL, UpdateDate date NOT NULL);
    DROP TABLE IF EXISTS category;
    CREATE TABLE category ( Id int(11) NOT NULL, Name varchar(50) NOT NULL, Type int(11) NOT NULL, Planned float DEFAULT NULL, IconId int(11) NOT NULL, Color varchar(20) NOT NULL, GroupsId int(11) DEFAULT NULL);
    DROP TABLE IF EXISTS finance;
    CREATE TABLE finance ( Id int(11) NOT NULL, CategoryId int(11) NOT NULL, AccountCode int(11) NOT NULL, Amount float NOT NULL, Date date NOT NULL, Description varchar(150) DEFAULT NULL);
    DROP TABLE IF EXISTS groups;
    CREATE TABLE groups ( Id int(11) NOT NULL, Name varchar(100) NOT NULL, Code varchar(10) NOT NULL);
    DROP TABLE IF EXISTS icon;
    CREATE TABLE icon ( Id int(11) NOT NULL, Type int(11) NOT NULL, Picture varchar(25) NOT NULL);
    DROP TABLE IF EXISTS planning;
    CREATE TABLE planning ( Id int(11) NOT NULL, CategoryId int(11) NOT NULL, Date date NOT NULL, PlannedAmount float NOT NULL, GroupsId int(11) NOT NULL, Status int(11) NOT NULL);
    DROP TABLE IF EXISTS transfer;
    CREATE TABLE transfer ( Id int(11) NOT NULL, FromAccountCode int(11) NOT NULL, ToAccountCode int(11) NOT NULL, Amount float NOT NULL, Date date NOT NULL, Description varchar(150) DEFAULT NULL);
    DROP TABLE IF EXISTS icontype;
    CREATE TABLE iconType ( Id int(11) NOT NULL, NamePL varchar(50), NameEN varchar(50));
    `);
}

export const checkDB = () => {
  const firstRow = db.getFirstSync("SELECT name FROM sqlite_master WHERE type='table' AND name='users';");
  return firstRow;
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
    "DELETE FROM users WHERE login like ?;", name
  )
}

export const hashPassword = (password) => {
  return CryptoJS.MD5(password).toString();
};

export const insertUser = (idGlobal, login, password, name, surname, groupsId, saveLogin) => {
  password = hashPassword(password);
  var CurrentGroup;
  if(groupsId == null || groupsId == '') CurrentGroup = null;
  else{
    if(groupsId.indexOf(',')==-1) CurrentGroup = parseInt(groupsId)
    else CurrentGroup = parseInt(groupsId.slice(0,groupsId.indexOf(',')))
  }
  db.runSync(
    "INSERT INTO users (idGlobal, login, password, name, surname, groupsid, currentGroupId, logout) VALUES (?,?,?,?,?,?,?,?);", idGlobal, login, password, name, surname, groupsId, CurrentGroup, (saveLogin ? 1 : 0)
  )
}

export const addFirstGroup = (idGroups, idGlobal) => {
  db.runSync(
    "UPDATE users SET groupsId = ?, currentGroupId = ? WHERE idGlobal = ?;", idGroups, idGroups, idGlobal
  )
}

export const joinGroup = (idGroup, idGlobal) => {
  const result = db.getFirstSync(`SELECT groupsid FROM users WHERE idGlobal = ${idGlobal}`)
  db.runSync(
    `UPDATE users SET groupsid = '${result.groupsid+','+idGroup}', currentGroupId=${idGroup} WHERE idGlobal = ${idGlobal}`
  )
}

export const addSessionKeyToUser = (idGlobal, sessionKey) => {
  db.runSync(
    "UPDATE users set sessionKey = ? WHERE idGlobal = ?;", sessionKey, idGlobal
  )
}

export const insertData = (tableName, data) => {
  db.runSync(`DELETE FROM ${tableName}`);
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
    query = `SELECT sum(${ColumnToSum}) as balance, Name as nazwa, IconId FROM ${TableName} WHERE Code = ${whereAccountId} AND ${condition}`;
  }
  const result = db.getFirstSync(query)
  return result;
}

export const selectValueFromColumn = (TableName, Column, whereColumn, whereValue) => {
  const result = db.getAllSync(`SELECT ${Column} FROM ${TableName} WHERE ${whereColumn} IN (${whereValue});`);
  return result;
}

export const selectFinance = (whereAccountId, fromDate, toDate, transfer, groupId) => {
  if(whereAccountId==-1){
    query = `SELECT f.CategoryId, c.name, i.picture, c.color, ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN account a ON f.accountCode = a.Code INNER JOIN category c ON f.categoryId = c.Id INNER JOIN icon i ON c.IconId = i.Id WHERE f.Date BETWEEN '${fromDate}' AND '${toDate}' AND a.Status=1 AND c.Type = '${transfer}' AND a.Active=1 AND a.GroupsId = ${groupId} GROUP BY f.CategoryId ORDER BY ROUND(SUM(f.amount),2) DESC;`;
  }else{
    query = `SELECT f.CategoryId, c.name, i.picture, c.color, ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN account a ON f.accountCode = a.Code INNER JOIN category c ON f.categoryId = c.Id INNER JOIN icon i ON c.IconId = i.Id WHERE f.AccountCode = ${whereAccountId} AND f.Date BETWEEN '${fromDate}' AND '${toDate}' AND c.Type = '${transfer}' AND a.Active=1 GROUP BY f.CategoryId ORDER BY ROUND(SUM(f.amount),2) DESC;`;
  }
  const result = db.getAllSync(query);
  return result;
}

export const selectPeriodSum = (whereAccountId, fromDate, toDate, transfer, groupId) => {
  if(whereAccountId==-1){
    query = `SELECT ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN account a ON a.Code = f.AccountCode INNER JOIN category c ON f.categoryId = c.Id WHERE f.Date BETWEEN '${fromDate}' AND '${toDate}' AND a.Status=1 AND c.Type = '${transfer}' AND a.Active=1 AND a.GroupsId= ${groupId};`;
  }else{
    query = `SELECT ROUND(SUM(f.amount),2) as suma FROM finance f INNER JOIN category c ON f.categoryId = c.Id WHERE f.AccountCode = ${whereAccountId} AND f.Date BETWEEN '${fromDate}' AND '${toDate}' AND c.Type = '${transfer}';`;
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

export const insertPlanning = (incomeTable, expanseTable, date, groupId) => {
  const now = date.getFullYear()+'-'+GF.addZeroToDate((date.getMonth()+1))+'-'+GF.addZeroToDate(date.getDate());
  incomeTable.map((item) => {
    if(item.PlannedAmount>0){
      db.runSync(
        `INSERT INTO planning (Id, CategoryId, Date, PlannedAmount, GroupsId, Status) VALUES (${item.Id}, ${item.CategoryId}, '${item.Date}', ${item.PlannedAmount}, ${groupId}, 1)`
      )
    }
  })
  expanseTable.map((item) => {
    if(item.PlannedAmount>0){
      db.runSync(
        `INSERT INTO planning (Id, CategoryId, Date, PlannedAmount, GroupsId, Status) VALUES (${item.Id}, ${item.CategoryId}, '${item.Date}', ${item.PlannedAmount}, ${groupId}, 1)`
      )
    }
  })
}

export const addFinance = (financeId, accountId, accountCode, value, categoryId, date, description, transfer) => {
  const data = db.getFirstSync(`SELECT Code, Name, Balance, IconId, Color, Status, GroupsId FROM account WHERE Code = ${accountCode} AND Active=1`);
  db.runSync(
    `UPDATE account SET Active=0 WHERE Code=${accountCode} AND Active=1`
  )
  var temp;
  if(transfer==1) temp = parseFloat(data.Balance)-parseFloat(value);
  else temp = parseFloat(data.Balance)+parseFloat(value);
  console.log(temp)
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${accountId}, ${data.Code}, 1, '${data.Name}', ${temp}, '${data.IconId}', '${data.Color}', ${data.Status}, '${data.GroupsId}', '${date}')`
  )
  db.runSync(
    `INSERT INTO finance (Id, CategoryId, AccountCode, Amount, Date, Description) VALUES (${financeId}, ${categoryId}, ${accountCode}, ${value}, '${date}', '${description}')`
  )
}

export const editFinance = (financeId, oldAccountId, accountId, data) => {
  if(data.oldAccountId!=data.accountId){
    const Oldresult = db.getFirstSync(`SELECT Code, Name, Balance, IconId, Color, Status, GroupsId FROM account WHERE Code=${data.oldAccountId} AND Active=1`);
    const Newresult = db.getFirstSync(`SELECT Code, Name, Balance, IconId, Color, Status, GroupsId FROM account WHERE Code=${data.accountId} AND Active=1`);
    db.runSync(`UPDATE account SET Active=0 WHERE Code=${data.oldAccountId} AND Active=1`);
    db.runSync(`UPDATE account SET Active=0 WHERE Code=${data.accountId} AND Active=1`);
    let OldValue;
    let NewValue;
    if(data.transfer==1){
      OldValue = parseFloat(Oldresult.Balance)+parseFloat(data.oldAmount);
      NewValue = parseFloat(Newresult.Balance)-parseFloat(data.amount);
    }else{
      OldValue = parseFloat(Oldresult.Balance)-parseFloat(data.oldAmount);
      NewValue = parseFloat(Newresult.Balance)+parseFloat(data.amount);
    }
    db.runSync(
      `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${oldAccountId}, ${Oldresult.Code}, 1, '${Oldresult.Name}', ${OldValue}, '${Oldresult.IconId}', '${Oldresult.Color}', "${Oldresult.Status}", '${Oldresult.GroupsId}', '${data.date}')`
    )
    db.runSync(
      `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${accountId}, ${Newresult.Code}, 1, '${Newresult.Name}', ${NewValue}, '${Newresult.IconId}', '${Newresult.Color}', "${Newresult.Status}", '${Newresult.GroupsId}', '${data.date}')`
    )
    db.runSync(
      `UPDATE finance SET CategoryId=${data.categoryId}, AccountCode=${data.accountId}, Amount=${data.amount}, Date='${data.date}', Description='${data.description}' WHERE Id=${financeId}`
    )
  }else{
    let temp;
    if(data.transfer==1) temp = parseFloat(data.oldAmount)-parseFloat(data.amount);
    else temp = parseFloat(data.amount)-parseFloat(data.oldAmount);
    db.runSync( 
      `UPDATE account SET Balance = Balance + ? WHERE Code = ? AND Active = 1`, [parseFloat(temp), data.accountId] 
    );
    db.runSync(
      `UPDATE finance SET CategoryId=${data.categoryId}, AccountCode=${data.accountId}, Amount=${data.amount}, Date='${data.date}', Description='${data.description}' WHERE Id=${financeId}`
    )
  }
}

export const addAccount = (id, code, data, date) => {
  const now = date.getFullYear()+'-'+GF.addZeroToDate((date.getMonth()+1))+'-'+GF.addZeroToDate(date.getDate());
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${id}, ${code}, 1, '${data.name}', ${data.value}, ${data.icon}, '${data.color}', ${data.status}, ${data.groupId}, '${now}');`
  )
}

export const updateAccount = (id, code, data, date) => {
  const now = date.getFullYear()+'-'+GF.addZeroToDate((date.getMonth()+1))+'-'+GF.addZeroToDate(date.getDate());
  db.runSync(
    `UPDATE account SET Active=0 WHERE Id=${data.idKonta}`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${id}, ${code}, 1, '${data.name}', ${data.value}, ${data.icon}, '${data.color}', ${data.status}, ${data.groupId}, '${now}');`
  )
}

export const addTransfer = (data, transferId, dataFromAcc, dataToAcc) => {
  const date = new Date();
  const now = date.getFullYear()+'-'+GF.addZeroToDate((date.getMonth()+1))+'-'+GF.addZeroToDate(date.getDate());
  db.runSync(
    `UPDATE account set Active=0 WHERE Code IN (${data.fromAcc}, ${data.toAcc})`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${dataFromAcc}, ${data.fromAcc}, 1, (SELECT a.name FROM account a WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), (SELECT a1.Balance FROM account a1 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1)-${data.value}, (SELECT a2.IconId FROM account a2 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), (SELECT a3.Color FROM account a3 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), (SELECT a4.Status FROM account a4 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), ${data.groupId}, '${now}')`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${dataToAcc}, ${data.toAcc}, 1, (SELECT a.name FROM account a WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), (SELECT a1.Balance FROM account a1 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1)+${data.value}, (SELECT a2.IconId FROM account a2 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), (SELECT a3.Color FROM account a3 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), (SELECT a4.Status FROM account a4 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), ${data.groupId}, '${now}')`
  )
  db.runSync(
    `INSERT INTO transfer (Id, FromAccountCode, ToAccountCode, Amount, Date, Description) VALUES (${transferId}, ${data.fromAcc}, ${data.toAcc}, ${data.value}, '${data.date}', '${data.description}')`
  )
}

export const deleteTransfer = (data, dataFromAcc, dataToAcc) => {
  const date = new Date();
  const now = date.getFullYear()+'-'+GF.addZeroToDate((date.getMonth()+1))+'-'+GF.addZeroToDate(date.getDate());
  let query = `SELECT * FROM transfer WHERE Id = ${data.transferId}`
  const result = db.getFirstSync(query);
  db.runSync(
    `UPDATE account SET Active=0 WHERE Code IN (${result.FromAccountCode}, ${result.ToAccountCode}) AND Active=1`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${dataFromAcc}, ${result.FromAccountCode}, 1, (SELECT a.name FROM account a WHERE Code=${result.FromAccountCode} ORDER BY Id desc limit 1), (SELECT a1.Balance FROM account a1 WHERE Code=${result.FromAccountCode} ORDER BY Id desc limit 1)+${result.Amount}, (SELECT a2.IconId FROM account a2 WHERE Code=${result.FromAccountCode} ORDER BY Id desc limit 1), (SELECT a3.Color FROM account a3 WHERE Code=${result.FromAccountCode} ORDER BY Id desc limit 1), (SELECT a4.Status FROM account a4 WHERE Code=${result.FromAccountCode} ORDER BY Id desc limit 1), ${data.groupId}, '${now}')`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${dataToAcc}, ${result.ToAccountCode}, 1, (SELECT a.name FROM account a WHERE Code=${result.ToAccountCode} ORDER BY Id desc limit 1), (SELECT a1.Balance FROM account a1 WHERE Code=${result.ToAccountCode} ORDER BY Id desc limit 1)-${result.Amount}, (SELECT a2.IconId FROM account a2 WHERE Code=${result.ToAccountCode} ORDER BY Id desc limit 1), (SELECT a3.Color FROM account a3 WHERE Code=${result.ToAccountCode} ORDER BY Id desc limit 1), (SELECT a4.Status FROM account a4 WHERE Code=${result.ToAccountCode} ORDER BY Id desc limit 1), ${data.groupId}, '${now}')`
  )
  db.runSync(
    `DELETE FROM transfer WHERE Id = ${data.transferId}`
  )
}

export const EditTransfer = (data, dataFromAcc, dataToAcc) => {
  const date = new Date();
  const now = date.getFullYear()+'-'+GF.addZeroToDate((date.getMonth()+1))+'-'+GF.addZeroToDate(date.getDate());
  db.runSync(
    `UPDATE account set Active=0 WHERE Code IN (${data.fromAcc}, ${data.toAcc})`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${dataFromAcc}, ${data.fromAcc}, 1, (SELECT a.name FROM account a WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), (SELECT a1.Balance FROM account a1 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1)-${data.value}, (SELECT a2.IconId FROM account a2 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), (SELECT a3.Color FROM account a3 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), (SELECT a4.Status FROM account a4 WHERE Code=${data.fromAcc} ORDER BY Id desc limit 1), ${data.groupId}, '${now}')`
  )
  db.runSync(
    `INSERT INTO account (Id, Code, Active, Name, Balance, IconId, Color, Status, GroupsId, UpdateDate) VALUES (${dataToAcc}, ${data.toAcc}, 1, (SELECT a.name FROM account a WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), (SELECT a1.Balance FROM account a1 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1)+${data.value}, (SELECT a2.IconId FROM account a2 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), (SELECT a3.Color FROM account a3 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), (SELECT a4.Status FROM account a4 WHERE Code=${data.toAcc} ORDER BY Id desc limit 1), ${data.groupId}, '${now}')`
  )
  db.runSync(
    `UPDATE transfer SET Amount=Amount+${data.value}, Date='${data.date}', Description='${data.description}' WHERE Id = ${data.transferId}`
  )
}

export const categoryManager = (id, data) => {
  const plan = (data.planned==0 ? null : data.planned);
  if(data.id==-1){
    db.runSync(
      `INSERT INTO category (Id, Name, Type, Planned, IconId, Color, GroupsId) VALUES (${id}, '${data.name}', ${data.type}, ${plan}, ${data.icon}, '${data.color}', ${data.groupid})`
    )
  }else{
    db.runSync(
      `UPDATE category SET Name='${data.name}', Type=${data.type}, Planned=${plan}, IconId=${data.icon}, Color='${data.color}', GroupsId=${data.groupid} WHERE Id=${data.id}`
    )
  }
}

export const deleteFinance = (data) => {
  let value = data.value;
  if(data.transfer==1) value = (-1)*value;
  db.runSync(
    `UPDATE account SET Balance=Balance-${value} WHERE Active=1 AND GroupsId=${data.groupid} AND Code = (SELECT Code FROM finance WHERE Id=${data.id})`
  )
  db.runSync(
    `DELETE FROM finance WHERE Id=${data.id}`
  )
}