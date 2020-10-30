import * as assert from 'assert';
import sinon from 'sinon';
import rewire from 'rewire';
import proxyquire from 'proxyquire';

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
    const fieldLoadedStub = sinon.stub();

    fieldLoadedStub
      .onCall(0)
      .resolves({ name: '', description: '', author: '' });

    fieldLoadedStub.onCall(1).resolves({
      name: 'some-value',
      description: 'some-value',
      author: 'some-value',
    });

    const mockedValidator = proxyquire('../../src/core/validator', {
      '../util/fieldLoader': {
        loadFields: fieldLoadedStub,
      },
    }).default;

    try {
      await mockedValidator.run();
      assert.ok(true);
    } catch (err) {
      console.log(err);
      assert.ok(false);
    }
  });

  it('should throw error when required fields are missing - runLocalCheck', async () => {
    const fieldLoadedStub = sinon.stub();

    fieldLoadedStub
      .onCall(0)
      .resolves({ name: '', description: '', author: '' });

    fieldLoadedStub.onCall(1).resolves({
      name: 'some-value',
      description: 'some-value',
    });

    const mockedValidator = proxyquire('../../src/core/validator', {
      '../util/fieldLoader': {
        loadFields: fieldLoadedStub,
      },
    }).default;

    try {
      await mockedValidator.run({});
      assert.ok(false);
    } catch (err) {
      assert.ok(true);
    }
  });

  it('should call the runLocalCheck method', async () => {
    const runLocalCheckMock = sinon.stub().resolves();
    const runOrgCheckMock = sinon.stub().resolves();

    const validator = rewire('../../src/core/validator');
    validator.__set__('runLocalCheck', runLocalCheckMock);
    validator.__set__('runOrganizationCheck', runOrgCheckMock);

    await validator.default.run();
    assert.ok(runLocalCheckMock.called);
    assert.ok(!runOrgCheckMock.called);
  });

  it('should call the runOrganizationCheck method', async () => {
    const runLocalCheckMock = sinon.stub().resolves();
    const runOrgCheckMock = sinon.stub().resolves();

    runLocalCheckMock.resolves();
    runOrgCheckMock.resolves();
    const validator = rewire('../../src/core/validator');

    validator.__set__('runLocalCheck', runLocalCheckMock);
    validator.__set__('runOrganizationCheck', runOrgCheckMock);

    await validator.default.run('nodeshift');
    assert.ok(!runLocalCheckMock.called);
    assert.ok(runOrgCheckMock.called);
    assert.ok(runOrgCheckMock.calledWith('nodeshift'));
  });
});
