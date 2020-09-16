import Option from '../src/Option';
import * as assert from 'assert';

describe('CLI options', () => {
  it('Should contain fields option', () => {
    assert.equal(Option.fields().alias, 'f');
    assert.equal(Option.fields().description, 'Path to json file that contains the fields.');
    assert.equal(Option.fields().required, false);
  });

  it('Should contain organization option', () => {
    assert.equal(Option.organization().alias, 'o');
    assert.equal(Option.organization().description, 'The name of the github organization to look at.');
    assert.equal(Option.organization().required, false);
  });
});
