import getDB from './db/getDB';

exports.getDB = (db, options) => {
  const config = {
    db,
    ...options,
  };
  return getDB(config);
};
