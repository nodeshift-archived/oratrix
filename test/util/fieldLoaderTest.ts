import * as assert from 'assert';
import proxyquire from 'proxyquire';
import FieldLoader from '../../src/util/fieldLoader';

describe('Field Loader', () => {
  it('should contain fields', async () => {
    const fields = await new FieldLoader().loadFields();
    assert.ok(fields.author === '');
    assert.ok(typeof fields.dependencies === 'object');
    assert.ok(typeof fields.devDependencies == 'object');
    assert.ok(fields.description === '');
    assert.ok(fields.name === '');
    assert.ok(fields.version === '');
  });

  it('should return fields from URL', async () => {
    const FieldLoaderMocked = proxyquire('../../src/util/fieldLoader', {
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

    const fieldLoader = new FieldLoaderMocked();

    try {
      const result = await fieldLoader.loadFieldsFromURL('http://...');
      assert.deepStrictEqual(result, { name: 'nodeshift' });
    } catch (err) {
      assert.ok(false);
    }
  });

  it('should throw an error - loadFieldsFromURL', async () => {
    const FieldLoaderMocked = proxyquire('../../src/util/fieldLoader', {
      axios: {
        get: () =>
          Promise.resolve({
            status: 404,
          }),
      },
    }).default;

    const fieldLoader = new FieldLoaderMocked();

    try {
      await fieldLoader.loadFieldsFromURL('http://...');
      assert.ok(false);
    } catch (err) {
      assert.ok(true);
    }
  });
});
