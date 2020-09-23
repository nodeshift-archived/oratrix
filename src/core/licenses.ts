import LicenseChecker from '../util/licenseChecker';

class Licenses {

  async run(directory:string): Promise<void> {
    const licenseChecker = new LicenseChecker();
    const licenses = await licenseChecker.search(directory);

    // Do some transformation and/or use cli-table to print out the data.
    let result = '';
    licenses.forEach(l => {
      result += l.moduleName + ',' + l.licenses + '\n';
    })
    // console.log(result);
  }

}

export default Licenses;
