import * as checker from 'license-checker';

interface License {
  name: string;
  licenses: string | string[];
}

export default class LicenseChecker {
  /**
   * Searches for licenses of a node.js project.
   * It returns project level direct dependencies and its sub-dependencies,
   * for production dependencies only.
   * @param directory The directory of the project root to search for licenses
   */
  async search(directory: string): Promise<License[]> {
    return new Promise((resolve, reject) => {
      const options = { start: directory, production: true };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      checker.init(options, (error: string, jsonArray: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            Object.keys(jsonArray).map((json) => {
              jsonArray[json].dependency = json;

              const license: License = {
                name: jsonArray[json].dependency,
                licenses: jsonArray[json].licenses,
              };

              return license;
            })
          );
        }
      });
    });
  }
}
