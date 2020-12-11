import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

export const command = 'verify';

export const desc = 'Verifies the packages listed in the config';

export const builder = {};

export const handler = (): void => {
  const configPath = path.resolve('.oratrixrc.json');
  const configExists = fs.existsSync(configPath);
  // check if config file exists
  if (!configExists) {
    console.log('🚫 No oratrix config found in the current directory.');
    process.exit(1);
  }

  console.log('✅ Oratrix config found.');

  // load config from disk
  const configJSON = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configJSON);

  // phase-1: check for deprecated packages
  const deprecated: string[] = [];

  config.packages.forEach((pkg: any) => {
    // get package info from NPM
    const packageInfoJSON = execSync(`npm show ${pkg.name} --json`, {
      encoding: 'utf-8',
    });
    const packageInfo = JSON.parse(packageInfoJSON);
    // check if package is deprecated
    if (packageInfo.deprecated === 'this version has been deprecated') {
      deprecated.push(pkg.name);
    }
  });

  if (deprecated.length === 0) {
    console.log('🎉 No deprecated packages found.');
  } else {
    // format deprecated array as string
    const output = deprecated.map((elem) => chalk.bold.red(elem)).join(' ');
    console.log(`🚫 The following packages are deprecated: ${output}`);
  }

  // phase-2: check for required package.json fields
  const missingResults: Record<string, string[]> = {};
  // util function - TO BE REMOVED
  const isEmpty = (value: any) => {
    return !value || value === '';
  };

  config.packages.forEach((pkg: any) => {
    // get package info from NPM
    const packageInfoJSON = execSync(`npm show ${pkg.name} --json`, {
      encoding: 'utf-8',
    });
    const packageInfo = JSON.parse(packageInfoJSON);

    // get missing package fields
    const missingFields: string[] = config.required.filter((field: string) => {
      const exists = Object.hasOwnProperty.call(packageInfo, field);
      const empty = isEmpty(packageInfo[field]);
      return !exists || empty;
    });

    if (missingFields.length !== 0) {
      missingResults[pkg.name] = missingFields;
    }
  });

  if (Object.keys(missingResults).length === 0) {
    console.log('🎉 All packages contain required fields.');
  } else {
    console.log('🚫 Some packages missing required fields.');
    Object.keys(missingResults).forEach((packageName) => {
      // format missing fields
      const arrow = chalk.yellow('▶');
      const name = chalk.bold.yellow(packageName);
      const missing = missingResults[packageName]
        .map((elem) => chalk.bold.red(elem))
        .join(' ');
      console.log(`   ${arrow} package ${name} is missing: ${missing}`);
    });
  }
};
