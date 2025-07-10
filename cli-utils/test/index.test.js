const assert = require('node:assert').strict;

describe('Simple Test', function () {
  it('first test', () => {
    const l1 = ['a', 'b', 'c', 'd'];
    const l2 = ['a', 'b', 'c', 'd'];
    assert.deepEqual(l1, l2, 'The two lists should be equal');
  });
  it('second test', async () => {
    const data = { name: 'second test' };
    const getData = () => (new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    }));
    await assert.doesNotReject(getData(), 'The promise should resolve without error');
  });
});