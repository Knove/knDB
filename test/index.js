const assert = require('assert');
const knDB = require('../dist/index');

const db = knDB.getDB('hello', {
  // position: 'D:\\logs',
});

describe('#index.js', () => {

  it('set { value: 1 }, now value = 1 ', () => {
    db.set('knove', { value: 1 });
    const { value } = db.get('knove');
    assert.strictEqual(value, 1);
  });

  it('set { value: { innerValue: 2 } }, now value.innerValue = 2 ', () => {

    const value = { 
      innerValue: 2,
      otherValue: 0
    };

    const object = { number : 0 };


    db.set('knove', { value, object });

    assert.strictEqual(db.get('knove').value.innerValue, 2);
  });

  it('complex test', () => {
    const { value } = db.get('knove');

    value.innerValue = 3;
    db.set('knove', { value });

    assert.strictEqual(db.get('knove').value.innerValue, 3);
    assert.strictEqual(value.innerValue, 3);
    assert.strictEqual(db.get('knove').value.otherValue, 0);
    assert.strictEqual(db.get('knove').object.number, 0);
  });

  it('memory test', () => {
    const { value } = db.get('knove');

    value.innerValue = 4;

    assert.strictEqual(db.get('knove').value.innerValue, 4);
    assert.strictEqual(value.innerValue, 4);
  });
});
