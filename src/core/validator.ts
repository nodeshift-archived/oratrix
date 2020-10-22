import chalk from 'chalk';
import * as fieldLoader from '../util/fieldLoader';
import * as differ from '../util/differ';
import * as ghFetcher from '../util/githubFetcher';
import { createValidatorReport } from '../util/report';

export interface Options {
  config?: string;
  token?: string;
}

const runLocalCheck = async (options: Options): Promise<void> => {
  const requiredFields = await fieldLoader.loadFields(options.config);
  const packageFields = await fieldLoader.loadFields('./package.json');
  const report = differ.run(requiredFields, packageFields);

  console.log(`\n${chalk.bold('Oratrix report')}\n`);

  const output = createValidatorReport(Object.keys(requiredFields), report);

  console.log(`${output}`);

  if (report.length > 0) {
    throw new Error(`You have ${report.length} field(s) missing`);
  }
};

const runOrganizationCheck = async (
  organization: string,
  options: Options
): Promise<void> => {
  const packagePaths = await ghFetcher.fetch(organization, options);
  const requiredFields = await fieldLoader.loadFields(options.config);

  const packageData = await Promise.all(
    packagePaths.map(
      async (path: string) => await fieldLoader.loadFieldsFromURL(path)
    )
  );

  console.log(`\n${chalk.bold('Oratrix report')}`);
  let errorCount = 0;

  packageData.forEach((repoPackage, index) => {
    const repoName = packagePaths[index]
      .replace(`https://raw.githubusercontent.com/`, '')
      .replace('/master/package.json', '');

    console.log(`\n|== ${chalk.cyan.bold(repoName)} ==|\n`);
    const report = differ.run(requiredFields, repoPackage);

    const output = createValidatorReport(Object.keys(requiredFields), report);

    console.log(`${output}`);
    if (report.length > 0) errorCount++;
  });

  if (errorCount > 0) {
    throw new Error(`Found inconsistencies in ${errorCount} repo(s)`);
  }
};

export const run = async (
  organization?: string,
  options: Options = {}
): Promise<void> => {
  if (organization) {
    await runOrganizationCheck(organization, options);
  } else {
    await runLocalCheck(options);
  }
};
