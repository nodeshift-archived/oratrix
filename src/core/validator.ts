import chalk from 'chalk';
import fieldLoader from '../util/fieldLoader';
import differ from '../util/differ';
import ghFetcher from '../util/githubFetcher';
import report from '../util/report';

export interface Options {
  config?: string;
  token?: string;
}

async function runLocalCheck(options: Options): Promise<void> {
  const requiredFields = await fieldLoader.loadFields(options.config);
  const packageFields = await fieldLoader.loadFields('./package.json');
  const reportData = differ.run(requiredFields, packageFields);

  console.log(`\n${chalk.bold('Oratrix report')}\n`);

  const output = report.createValidatorReport(
    Object.keys(requiredFields),
    reportData
  );

  console.log(`${output}`);

  if (reportData.length > 0) {
    throw new Error(`You have ${reportData.length} field(s) missing`);
  }
}

async function runOrganizationCheck(
  organization: string,
  options: Options
): Promise<void> {
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
    const reportData = differ.run(requiredFields, repoPackage);

    const output = report.createValidatorReport(
      Object.keys(requiredFields),
      reportData
    );

    console.log(output);
    if (reportData.length > 0) errorCount++;
  });

  if (errorCount > 0) {
    throw new Error(`Found inconsistencies in ${errorCount} repo(s)`);
  }
}

async function run(
  organization?: string,
  options: Options = {}
): Promise<void> {
  if (organization) {
    await runOrganizationCheck(organization, options);
  } else {
    await runLocalCheck(options);
  }
}

export default {
  run,
};
