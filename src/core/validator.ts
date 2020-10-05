import FieldLoader from '../util/fieldLoader';
import Differ from '../util/differ';
import GithubFetcher from '../util/githubFetcher';

export interface Options {
  config?: string;
}

class Validator {
  fieldLoader = new FieldLoader();
  differ = new Differ();

  async run(organization?: string, options: Options = {}): Promise<string[]> {
    if (organization) {
      return this.runOrganizationCheck(organization, options);
    } else {
      return this.runLocalCheck(options);
    }
  }

  async runLocalCheck(options: Options): Promise<string[]> {
    const requiredFields = await this.fieldLoader.loadFields(options.config);
    const packageFields = await this.fieldLoader.loadFields('./package.json');
    const report = this.differ.run(requiredFields, packageFields);
    return report;
  }

  async runOrganizationCheck(
    organization: string,
    options: Options
  ): Promise<string[]> {
    const ghFetcher = new GithubFetcher();
    const result = await ghFetcher.fetch(organization);
    return result;
  }
}

export default Validator;
