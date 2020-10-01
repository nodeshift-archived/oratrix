import FieldLoader from '../util/fieldLoader';
import Differ from '../util/differ';
import GithubFetcher from '../util/githubFetcher';

class Validator {
  fieldLoader = new FieldLoader();
  differ = new Differ();

  async run(organization?: string): Promise<string[]> {
    if (organization) {
      return this.runOrganizationCheck(organization);
    } else {
      return this.runLocalCheck();
    }
  }

  async runLocalCheck(): Promise<string[]> {
    const requiredFields = await this.fieldLoader.loadFields();
    const packageFields = await this.fieldLoader.loadFields('./package.json');
    const report = this.differ.run(requiredFields, packageFields);
    return report;
  }

  async runOrganizationCheck(organization: string): Promise<string[]> {
    const ghFetcher = new GithubFetcher();
    const result = await ghFetcher.fetch(organization);
    return result;
  }
}

export default Validator;
