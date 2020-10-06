import chalk from 'chalk';
import FieldLoader from '../util/fieldLoader';
import Differ from '../util/differ';
import GithubFetcher from '../util/githubFetcher';
import Report from '../util/report';

export interface Options {
  config?: string;
}

class Validator {
  fieldLoader = new FieldLoader();
  differ = new Differ();

  async run(organization?: string, options: Options = {}): Promise<void> {
    if (organization) {
      await this.runOrganizationCheck(organization, options);
    } else {
      await this.runLocalCheck(options);
    }
  }

  async runLocalCheck(options: Options): Promise<void> {
    const requiredFields = await this.fieldLoader.loadFields(options.config);
    const packageFields = await this.fieldLoader.loadFields('./package.json');
    const report = this.differ.run(requiredFields, packageFields);

    console.log(`\n${chalk.bold('Oratrix report')}\n`);

    const output = Report.createValidatorReport(
      Object.keys(requiredFields),
      report
    );

    console.log(`${output}\n`);

    if (report.length > 0) {
      throw new Error(`You have ${report.length} field(s) missing`);
    }
  }

  async runOrganizationCheck(
    organization: string,
    options: Options
  ): Promise<void> {
    const ghFetcher = new GithubFetcher();
    const result = await ghFetcher.fetch(organization);
    console.log(result);
  }
}

export default Validator;
