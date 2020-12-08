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
    console.log('❗️ No oratrix config found in the current directory.');
    process.exit(1);
  }

  console.log('✅ Oratrix config found.');

  // load config from disk
  const configJSON = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configJSON);

  // phase-1: check for deprecated packages
  const deprecated: Array<string> = [];

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
    const output = deprecated.reduce(
      (prev: string, curr: string) => `${prev} ${chalk.bold.red(curr)}`,
      ''
    );
    console.log(`❗️ The following packages are deprecated: ${output.trim()}`);
  }
};
