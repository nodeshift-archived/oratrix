import * as assert from 'assert';
import LicenseChecker from '../../src/util/licenseChecker';

describe('A LicenceChecker', () => {
  const licenseChecker = new LicenseChecker();
  it('Should return license data', async () => {
    const result = await licenseChecker.search(process.cwd());
    assert.strictEqual(result.length, 77);
  });
});
