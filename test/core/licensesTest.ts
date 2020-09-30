import * as assert from 'assert';
import Licenses from '../../src/core/licenses';

const licenses = new Licenses();
before(async () => {
  await licenses.run(process.cwd());
});

describe('A License finder', () => {
  it('Should return the licenses of the dependencies', () => {
    assert.ok(licenses.licenseData.length > 0);
  });

  it('Should find oratrix license information', () => {
    const result = licenses.licenseData.filter((ld) =>
      ld.moduleName.includes('oratrix')
    );
    assert.strictEqual(result[0].licenses, 'Apache-2.0');
    assert.strictEqual(result[0].publisher, 'Red Hat, Inc.');
  });
});
