import * as checker from 'license-checker';

interface LicenseData {
  licenses: string;
  repository: string;
  publisher: string;
  email: string;
  url: string;
  path: string;
  licenseFile: string;
  moduleName: string;
}

export default class LicenseChecker {

  data: LicenseData[] = [];

  /**
   * Searches for licenses of a node.js project.
   * It returns project level direct dependencies and its sub-dependencies,
   * for production dependencies only.
   * @param directory The directory of the project root to search for licenses
   */
  async search(directory: string): Promise<LicenseData[]> {
    return new Promise((resolve, reject) => {
      const options = { start: directory, production: true };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      checker.init(options, (error: string, result: any) => {
        if (error) {
          reject(error);
        } else {
          this.data = this.mapResult(result);
          resolve(this.data);
        }
      });
    });
  }

  /**
   * Maps the result returned from license-checker in a custom
   * type LicenseData.
   * @param result A result data returned by license-checker.
   * @returns LicenseData[]
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapResult(result: any): LicenseData[] {
    return Object.keys(result).map((r) => {
      result[r].moduleName = r;

      const licenseData: LicenseData = {
        licenses: result[r].licenses,
        repository: result[r].repository,
        publisher: result[r].publisher,
        email: result[r].email,
        url: result[r].url,
        path: result[r].path,
        licenseFile: result[r].licenseFile,
        moduleName: result[r].moduleName,
      };

      this.data.push(licenseData);
      return licenseData;
    })
  }
}
