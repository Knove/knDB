<h1 align="center">Kn-DB</h1>
<div align="center">

 基于 [Node.js](https://nodejs.org)的数据持久化方案，适合轻量级Node.js应用

[![npm package](https://img.shields.io/npm/v/kndb.svg?style=flat-square)](https://www.npmjs.org/package/kndb)

</div>

[English](./README.md) | 简体中文
## 简介
Kn-DB是基于原生Node.js的数据持久化方案。

目前与其说是数据库，不如说可以用来轻量的数据保存，如果你的应用不需要存储大量的数据，那么你可以考虑Kn-DB！摆脱大型第三方数据库的束缚！

## 为什么我要用它?

- Node.js导入方便，非常适合存储非大型数据！可以保存你想保存的任何信息！
- 在推广你的Node.js应用时候可以避免用户必须安装第三方数据库（例如 mySQL, mongoDB 等）才能实现数据存储，更适合推广。

## 安装

```sh
// 使用 npm
npm install kndb

// 或使用 yarn
yarn add kndb
```

## 使用

使用非常简洁方便，一切都是同步运行：

```javascript
const knDB = require('kndb');

const db = knDB.getDB('hello');

if (db.success) {
  db.get('knove');       // { a: 0, b: 6 }
  db.set('knove', { a: 7 });
  db.get('knove');       // { a: 7, b: 5 }
} else {
  console.error(db.errorInfo);
}

```

## knDB API
### · getDB(db_name, [option])
配置项:
- type: 定义获取数据库实例时的获取方式，可不填，则没有找到数据库的情况下，会新建一个空数据库。但当type为check时，则会抛出错误。
- position: 数据库存储的位置，默认为你的Node.js程序根目录。也可指定为任意目录。
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