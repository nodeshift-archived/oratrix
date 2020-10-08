import * as assert from 'assert';
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
});
