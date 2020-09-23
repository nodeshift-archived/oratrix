import * as assert from 'assert';
import Licenses from '../../src/core/licenses';

describe('A License', () => {
  const licenses = new Licenses();
  it('Should return the licenses', async () => {
    await licenses.run(process.cwd());
    assert.strictEqual(1, 2);
  });

});
