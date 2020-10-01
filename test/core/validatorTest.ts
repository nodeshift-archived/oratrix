import * as assert from 'assert';
import Validator from '../../src/core/validator';

const validator = new Validator();

describe('A validator', () => {
  it('Should return the validation data', async () => {
    const result = await validator.run();
    assert.ok(result.length > 0);
  });

  it('Should contain missing description field', async () => {
    const result = await validator.run();
    assert.strictEqual(result[0], 'description');
  });

});
