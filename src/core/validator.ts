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

    console.log(`${output}`);

    if (report.length > 0) {
      throw new Error(`You have ${report.length} field(s) missing`);
    }
  }

  async runOrganizationCheck(
    organization: string,
    options: Options
  ): Promise<void> {
    const ghFetcher = new GithubFetcher();
    const packagePaths = await ghFetcher.fetch(organization);
    const requiredFields = await this.fieldLoader.loadFields(options.config);

    const packageData = await Promise.all(
      packagePaths.map(
        async (path) => await this.fieldLoader.loadFieldsFromURL(path)
      )
    );

    console.log(`\n${chalk.bold('Oratrix report')}`);
    let errorCount = 0;

    packageData.forEach((repoPackage, index) => {
      const repoName = packagePaths[index]
        .replace(`https://raw.githubusercontent.com/`, '')
        .replace('/master/package.json', '');

      console.log(`\n|== ${chalk.cyan.bold(repoName)} ==|\n`);
      const report = this.differ.run(requiredFields, repoPackage);

      const output = Report.createValidatorReport(
        Object.keys(requiredFields),
        report
      );

      console.log(`${output}`);
      if (report.length > 0) errorCount++;
    });

    if (errorCount > 0) {
      throw new Error(`Found inconsistencies in ${errorCount} repo(s)`);
    }
  }
}

export default Validator;
