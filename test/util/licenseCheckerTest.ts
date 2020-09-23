import * as assert from 'assert';
import LicenseChecker from '../../src/util/licenseChecker';

describe('A LicenceChecker', () => {
  const licenseChecker = new LicenseChecker();
  it('Should check licenses', async () => {
    const result = await licenseChecker.search(process.cwd());
    
    // TODO to remove this code.
    licenseChecker.data.forEach(ld => {
      console.log(ld.url, ld.moduleName);
    });

    assert.strictEqual(result.length, 77);
  });
});
