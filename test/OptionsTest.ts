import * as assert from 'assert';
import * as option from '../src/option';

describe('CLI options', () => {
  it('Should contain fields option', () => {
    assert.strictEqual(option.fields().alias, 'f');
    assert.strictEqual(
      option.fields().description,
      'Path to json file that contains the fields.'
    );
    assert.strictEqual(option.fields().required, false);
  });

  it('Should contain organization option', () => {
    assert.strictEqual(option.organization().alias, 'o');
    assert.strictEqual(
      option.organization().description,
      'The name of the github organization to look at.'
    );
    assert.strictEqual(option.organization().required, false);
  });
});
