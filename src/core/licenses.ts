import LicenseChecker from '../util/licenseChecker';

class Licenses {
  async run(directory:string): Promise<string> {
    const licenseChecker = new LicenseChecker();
    const licenses = await licenseChecker.search(directory);
    let result = '';
    licenses.forEach(l => {
      result += l.name + ',' + l.licenses + '\n';
    })
    return result;
  }
}

export default Licenses;
