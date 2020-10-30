import * as assert from 'assert';
import proxyquire from 'proxyquire';
import fieldLoader from '../../src/util/fieldLoader';

describe('Field Loader', () => {
  it('should contain fields', async () => {
    const fields = await fieldLoader.loadFields();
    assert.ok(fields.author === '');
    assert.ok(typeof fields.dependencies === 'object');
    assert.ok(typeof fields.devDependencies == 'object');
    assert.ok(fields.description === '');
    assert.ok(fields.name === '');
    assert.ok(fields.version === '');
  });

  it('should return fields from URL', async () => {
    const fieldLoaderMocked = proxyquire('../../src/util/fieldLoader', {
      axios: {
        get: () =>
          Promise.resolve({
            status: 200,
            data: {
              name: 'nodeshift',
            },
          }),
      },
    }).default;

    try {
      const result = await fieldLoaderMocked.loadFieldsFromURL('http://...');
      assert.deepStrictEqual(result, { name: 'nodeshift' });
    } catch (err) {
      assert.ok(false);
    }
  });

  it('should throw an error - loadFieldsFromURL', async () => {
    const fieldLoaderMocked = proxyquire('../../src/util/fieldLoader', {
      axios: {
        get: () =>
          Promise.resolve({
            status: 404,
          }),
      },
    }).default;

    try {
      await fieldLoaderMocked.loadFieldsFromURL('http://...');
      assert.ok(false);
    } catch (err) {
      assert.ok(true);
    }
  });
});
