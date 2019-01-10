import Status from '@utils/status.js';

const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const { produce } = require('immer');
const shell = require('shelljs');

export default class Persistence {
  constructor(config, dataBase) {
    this.dataBase = dataBase;

    this.config = config;

    this.success = config.success;

    this.errorInfo = config.errorInfo;

    this.tableDataMemory = {};
  }

  // get: get target table all data , performance is low
  get = (table) => {
    if (this.success) {
      let dataBase;
      let updateFlag = false; // update memory flag

      try {
        dataBase = JSON.parse(fs.readFileSync(path.join(this.config.dataDir, this.config.dbFile)).toString());
      } catch (e) {
        console.error(e);
        return {};
      }
      if (this.dataBase.db_update_date !== dataBase.db_update_date) {
        updateFlag = true;
        this.dataBase = dataBase;
      }

      const tableId = this.dataBase.db_data[table];
      if (!tableId) return {};

      const tablePosi = path.join(this.config.dataDir, 'bin', tableId);

      const action = shell.ls(tablePosi);
      if (action.stderr) {
        console.warn(`get ${table} faild! memory not found ${table}, but table is record in db.`);
        return {};
      }

      let tableData = this.tableDataMemory[tableId];
      // if update time is different or memory data is empty , will found db file
      if (updateFlag || !this.tableDataMemory[tableId]) {
        try {
          tableData = JSON.parse(fs.readFileSync(tablePosi).toString());
        } catch (e) {
          console.error(e);
          return {};
        }
        this.tableDataMemory[tableId] = tableData;
      }

      return tableData;
    }
    console.error(`getDB is faild! ErrorInfo: ${this.errorInfo}`);
    return {};
  };

  // set: set target table all data, performance is low
  set = (table, setData) => {
    let dataBase;
    let updateFlag = false; // update memory flag
    const nowDate = new Date();

    try {
      dataBase = JSON.parse(fs.readFileSync(path.join(this.config.dataDir, this.config.dbFile)).toString());
    } catch (e) {
      console.error(e);
      return Status.errorInfo(e);
    }
    if (this.dataBase.db_update_date !== dataBase.db_update_date) {
      updateFlag = true;
    }

    let tableId = dataBase.db_data[table];
    let tableData = {};
    let tablePosi;
    // if has tableId in db_data, is update data, else is create new data
    if (tableId) {
      tablePosi = path.join(this.config.dataDir, 'bin', tableId);
      tableData = this.tableDataMemory[tableId];

      if ((!updateFlag && !tableData) || updateFlag) {
        try {
          tableData = JSON.parse(fs.readFileSync(tablePosi).toString());
        } catch (e) {
          console.error(e);
          return Status.errorInfo(e);
        }
      }
    } else {
      tableId = uuidv1();
      tablePosi = path.join(this.config.dataDir, 'bin', tableId);
      const action = shell.mkdir('-p', path.join(this.config.dataDir, 'bin'));
      if (action.stderr) {
        return Status.errorInfo(`Create table file failed, please check permissions or run programs in administrator mode! ErrorInfo: ${action.stderr}`);
      }
    }
    const newData = produce(tableData, (draftState) => {
      Object.assign(draftState, setData);
    });
    try {
      fs.writeFileSync(tablePosi, JSON.stringify(newData));
    } catch (e) {
      return Status.errorInfo(e);
    }

    // dataBase info update
    dataBase.db_update_date = nowDate;
    this.dataBase = dataBase;
    this.tableDataMemory[this.config.dbFile] = newData;
    dataBase.db_data[table] = tableId;
    fs.writeFileSync(path.join(this.config.dataDir, this.config.dbFile), JSON.stringify(dataBase));

    return Status.successInfo();
  };
}
