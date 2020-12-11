import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

export const command = 'verify';

export const desc = 'Verifies the packages listed in the config';

export const builder = {
  // strict: {
  //   boolean: true,
  //   describe: 'Return with error code 1 if a single check has failed',
  //   default: false,
  // },
};

export const handler = (): void => {
  // phase-1: check for deprecated packages
  const checkDeprecated = (config: any) => {
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
      if (config.strict) process.exit(1);
    }
  };

  // phase-2: check for required package.json fields
  const checkRequired = (config: any) => {
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
      const missingFields: string[] = config.required.filter(
        (field: string) => {
          const exists = Object.hasOwnProperty.call(packageInfo, field);
          const empty = isEmpty(packageInfo[field]);
          return !exists || empty;
        }
      );

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
      if (config.strict) process.exit(1);
    }
  };

  // phase-3 check allowed values on package fields
  const checkAllowed = (config: any) => {
    const groups: any = {};

    config.packages.forEach((pkg: any) => {
      // get package info from NPM
      const packageInfoJSON = execSync(`npm show ${pkg.name} --json`, {
        encoding: 'utf-8',
      });
      const packageInfo = JSON.parse(packageInfoJSON);

      // init package check state
      const nonAllowed: any = {};

      Object.keys(config.allowed).forEach((field) => {
        // search for field value in the allowed group
        const search = config.allowed[field].indexOf(packageInfo[field]);
        // if no results add group to local field group
        if (search === -1 && packageInfo[field]) {
          nonAllowed[field] = packageInfo[field];
        }
      });

      // check if we have non-allowed fields
      if (Object.keys(nonAllowed).length > 0) {
        groups[pkg.name] = nonAllowed;
      }
    });

    // format output
    if (Object.keys(groups).length === 0) {
      console.log(`🎉 All packages fields include allowed values.`);
    } else {
      console.log('🚫 Some packages include non-allowed field values.');
      Object.entries(groups).forEach(([pkg, fields]) => {
        const arrow = chalk.yellow('▶');
        const name = chalk.yellow.bold(pkg);
        // iterate through missing fields
        Object.entries(fields as any[]).forEach(([field, value]) => {
          // build output format
          const fld = chalk.yellow.bold(field);
          const val = chalk.red.bold(value);
          console.log(
            `   ${arrow} package ${name} includes non-allowed ${fld}: ${val}`
          );
        });
      });
      if (config.strict) process.exit(1);
    }
  };

  // parse oratrix config
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

  const checks = [checkDeprecated, checkRequired, checkAllowed];

  // iterate through checks
  checks.forEach((fn) => fn(config));
};
