import * as assert from 'assert';
import sinon from 'sinon';
import Validator from '../../src/core/validator';

const log = console.log;

describe(`Validator`, () => {
  before(() => {
    /* suppress console.log for this test */
    console.log = () => undefined;
  });

  after(() => {
    console.log = log;
  });

  it('should exit with no errors - runLocalCheck', async () => {
    const validator = new Validator();
    const fieldLoadedStub = sinon.stub(validator.fieldLoader, 'loadFields');

    fieldLoadedStub
      .onCall(0)
      .resolves({ name: '', description: '', author: '' });

    fieldLoadedStub.onCall(1).resolves({
      name: 'some-value',
      description: 'some-value',
      author: 'some-value',
    });

    try {
      await validator.runLocalCheck({});
      assert.ok(true);
    } catch (err) {
      assert.ok(false);
    }
  });

  it('should throw error when required fields are missing - runLocalCheck', async () => {
    const validator = new Validator();
    const fieldLoadedStub = sinon.stub(validator.fieldLoader, 'loadFields');

    fieldLoadedStub
      .onCall(0)
      .resolves({ name: '', description: '', author: '' });

    fieldLoadedStub.onCall(1).resolves({
      name: 'some-value',
      description: 'some-value',
    });

    try {
      await validator.runLocalCheck({});
      assert.ok(false);
    } catch (err) {
      assert.ok(true);
    }
  });
});
