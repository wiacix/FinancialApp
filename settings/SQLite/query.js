// database.js
import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';

const db = SQLite.openDatabaseSync('LocalDataBase.db');

export const createTable = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, login varchar(30), password varchar(30), name varchar(30), surname varchar(30));
    DROP TABLE settings;
    CREATE TABLE IF NOT EXISTS settings (lang varchar(3));
    INSERT INTO settings (lang) VALUES ("en");
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
    "DELETE FROM users WHERE name = ?;", name
  )
}

const hashPassword = (password) => {
  return CryptoJS.MD5(password).toString();
};

export const insertUser = (login, password, name, surname) => {
  password = hashPassword(password);
  db.runSync(
    "INSERT INTO users (login, password, name, surname) VALUES (?,?,?,?)", login, password, name, surname
  )
}
