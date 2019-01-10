import Status from '@utils/status.js';
import Persistence from '../persistence.js';
import BASIC from '../static/basic.js';

const shell = require('shelljs');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const path = require('path');

export default function (config) {
  // API
  const DB = config.db;
  const TYPE = config.type;
  const SAVE_POSITION = config.position;

  const processDir = SAVE_POSITION || process.cwd();
  const dataDir = path.join(processDir, 'kndb', 'data');
  const logDir = path.join(processDir, 'kndb', 'log');
  const dbFile = `${DB}.kndb`;

  Object.assign(config, {
    dataDir,
    dbFile,
    logDir,
  });

  let action = shell.mkdir('-p', dataDir, logDir);
  if (action.stderr) {
    return Status.Error(Persistence, config, `Create database/log folders failed, please check permissions or run programs in administrator mode! ErrorInfo: ${action.stderr}`);
  }

  action = shell.ls(dataDir);
  if (action.stderr) {
    return Status.Error(Persistence, config, `ErrorInfo: ${action.stderr}`);
  }

  // db is not created
  if (action instanceof Array && !action.includes(dbFile)) {
    if (TYPE === BASIC.TYPE.CHECK) {
      return Status.Error(Persistence, config, `CHECK mode, database is undefined! ErrorInfo: ${action.stderr}`);
    }
    const basicDB = BASIC.BASIC_DB;
    const nowDate = new Date();
    Object.assign(basicDB, {
      db_id: uuidv1(),
      db_name: config.db,
      db_create_date: nowDate,
      db_update_date: nowDate,
    });
    try {
      fs.writeFileSync(path.join(dataDir, dbFile), JSON.stringify(basicDB));
    } catch (e) {
      return Status.Error(Persistence, config, `create db failed! ErrorInfo: ${e}`);
    }
  }

  // db data put memory
  let dataBase;
  try {
    dataBase = JSON.parse(fs.readFileSync(path.join(dataDir, dbFile)).toString());
  } catch (e) {
    return Status.Error(Persistence, config, 'read db data failed!');
  }

  return Status.Success(Persistence, config, dataBase);
}
