import LicenseChecker from '../util/licenseChecker';
import { LicenseData } from '../core/licenseData';

class Licenses {

  licenseData: LicenseData[] = [];

  async run(directory:string): Promise<LicenseData[]> {
    const licenseChecker = new LicenseChecker();
    this.licenseData = await licenseChecker.search(directory);
    return this.licenseData;
  }

}

export default Licenses;
