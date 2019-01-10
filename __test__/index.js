const knDB = require('../dist/index');

const db = knDB.getDB('hello', {
  position: 'D:\\logs',
});

if (db.success) {
  console.log(db.get('knove'));
  console.log(db.set('knove', { a: 5 }));
  console.log(db.get('knove'));
} else {
  console.error(db.errorInfo);
}
