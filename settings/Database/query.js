// database.js
import * as SQLite from 'expo-sqlite';
import CryptoJS from 'crypto-js';

const db = SQLite.openDatabase('LocalDataBase.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, login varchar(30), password varchar(30), name varchar(30), surname varchar(30));',
      [],
      () => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error creating table: ', error);
      }
    );
  });
};

export const fetchUsers = (callback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (_, { rows: { _array } }) => {
          callback(_array);
        },
        (_, error) => {
          console.log('Error fetching users: ', error);
        }
      );
    });
  };

const hashPassword = (password) => {
    return CryptoJS.MD5(password).toString();
};

export const insertUser = (login, password, name, surname) => {
    const hashedPassword = hashPassword(password);
    db.transaction(tx => {
        tx.executeSql(
        'INSERT INTO users (login, password, name, surname) VALUES (?, ?, ?, ?);',
        [login, hashedPassword, name, surname],
        (_, result) => {
            console.log('User inserted successfully: ', result);
        },
        (_, error) => {
            console.log('Error inserting user: ', error);
        }
        );
    });
};

export const deleteUser = (login) => {
    db.transaction(tx => {
        tx.executeSql(
        'DELETE FROM users WHERE name = ?;',
        [login],
        (_, result) => {
            console.log('User ', login, 'deleted, result: ', result);
        },
        (_, error) => {
            console.log('Error deleting user: ', error);
        }
        );
    });
};