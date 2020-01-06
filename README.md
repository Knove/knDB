<h1 align="center">Kn-DB</h1>
<div align="center">

 Data persistence, Based on [Node.js](https://nodejs.org)

Data Storage for Lightweight Node.js Applications

[![npm package](https://img.shields.io/npm/v/kndb.svg?style=flat-square)](https://www.npmjs.org/package/kndb)

</div>

English | [简体中文](./README.CN.md)

At present, it is not so much a database as a lightweight data storage. 

If your application does not need to store a large amount of data, then you can consider Kn-DB! Get rid of the shackles of large third-party databases!

## Why use Kn-DB?

- Easy to import, very suitable for storing Non-large data! You can save any information you want to save!
- When promoting your Node.js application, you can avoid users having to install third-party databases (such as mySQL, mongoDB, etc.) to achieve data storage, which is more suitable for promotion.

## Installation

```sh
// with npm
npm install kndb

// with yarn
yarn add kndb
```

## Usage

Here is a quick example to get you started:

```javascript
const knDB = require('kndb');

const db = knDB.getDB('hello');

if (db.success) {
  db.get('knove');       // {}
  db.set('knove', { value: 7 });
  db.get('knove');       // { value: 7 }
} else {
  console.error(db.errorInfo);
}
```
Nested data：
```javascript
// now object is { innerValue: 2 }
const { object } = db.get('knove'); 

object.innerValue = 7;
db.set('knove', { object });

db.get('knove').object.innerValue; // 7
```
Too many levels are not recommended, this is a example of flat levels:
```javascript
db.set('knove', { 
  value1: 0,
  value2: 0
}); 

db.set('knove', { value1: 1 }); 

db.get('knove') // { value1: 1, value2: 0 }
```
Contrast：
```javascript
db.set('knove', { 
  object: { num1: 0, num2: 0 },
}); 

db.set('knove', { object: { num1: 2 } }); 

db.get('knove') // { object: { num1: 2 } }
```
## knDB API
### · getDB(db_name, [option])
Available options:
- type: getDB type, when type = check, if db is undefind, kndb will thorw error, default is create db
   
- position: db saved position, default is your project root position
```javascript
const options = {
    type: 'check',
    position: 'C:\\db', // Linux : 'opt/db/example'
}
const db = knDB.getDB('hello', options);
```
## db API
### · get(table_name)
```javascript
const tableData = db.get('knove'); 
```

### · set(table_name, setData)
```javascript
const setAction = db.set('knove', { a: 7 });
if (setAction.errorInfo) {
    console.error(setAction.errorInfo);
}
```
