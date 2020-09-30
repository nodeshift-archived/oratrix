import * as assert from 'assert';
import LicenseChecker from '../../src/util/licenseChecker';

const NUMBER_OF_LICENSES_DEPENDENCIES = 80;

describe('A LicenceChecker', () => {
  const licenseChecker = new LicenseChecker();
  it('Should return license data', async () => {
    const result = await licenseChecker.search(process.cwd());
    assert.strictEqual(result.length, NUMBER_OF_LICENSES_DEPENDENCIES);
  });
});
