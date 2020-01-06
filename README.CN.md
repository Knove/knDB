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

- 导入方便，非常适合存储非大型数据！可以保存你想保存的任何信息！
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
  db.get('knove');       // {}
  db.set('knove', { value: 7 });
  db.get('knove');       // { value: 7 }
} else {
  console.error(db.errorInfo);
}
```
嵌套数据使用也很方便：

```javascript
// 现在这里object的初值是 { innerValue: 2 }
const { object } = db.get('knove'); 

object.innerValue = 7;
db.set('knove', { object });

db.get('knove').object.innerValue; // 7
```
不推荐层级太多，推荐数据扁平。一个比较复杂的例子：
```javascript
db.set('knove', { 
  value1: 0,
  value2: 0
}); 

db.set('knove', { value1: 1 }); 

db.get('knove') // { value1: 1, value2: 0 }
```
即在处理第一级的数据时，set 时不用管同级的其他元素。例子这里没有传入 value2，value2 的值不会变化。

但是如果 第一级元素是一个 object，则 object 中全部元素都会被覆盖：
```javascript
db.set('knove', { 
  object: { num1: 0, num2: 0 },
}); 

db.set('knove', { object: { num1: 2 } }); 

db.get('knove') // { object: { num1: 2 } }
```

## KnDB API
### · getDB(db_name, [option])
#### db_name：库名
#### option配置项:
- type: 可不填，定义获取数据库实例时的获取方式，在没有找到数据库的情况下，会新建一个空数据库。但当type为check时，则会抛出错误。
- position: 可不填，数据库存储的位置，默认为当前Node.js程序根目录。
```javascript
const options = {
    type: 'check',
    position: 'C:\\db', // Linux : 'opt/db/example'
}
const db = knDB.getDB('hello', options);
```
## DB API
### · get(table_name)
#### table_name： 表名
```javascript
const tableData = db.get('knove'); 
```

### · set(table_name, setData)
#### table_name： 表名
#### setData 传表中某个字段的数据
```javascript
const setAction = db.set('knove', { a: 7 });
if (setAction.errorInfo) {
    console.error(setAction.errorInfo);
}
```
