import * as assert from 'assert';
import LicenseChecker from '../../src/util/licenseChecker';

describe('A LicenceChecker', () => {
  const licenseChecker = new LicenseChecker();
  it('Should check licenses', async () => {
    const result = await licenseChecker.search(process.cwd());
    result.forEach(r => {
      console.log(r.name, r.licenses);
    });
    assert.strictEqual(result.length, 77);
  });
});
