/**
 * This is an 'extracted' yargs command that communicates with
 * core/business layer.
 */
import * as yargs from 'yargs';
import chalk from 'chalk';

import Validator, { Options } from '../core/validator';
import Report from '../util/report';

export const command = 'validate';

export const desc = 'Searches for mandatory package.json fields';

export const builder = {
  organization: {
    alias: 'o',
    describe: 'GitHub organization oratrix will validate',
    default: null,
  },
  config: {
    alias: 'c',
    describe: 'Custom file with the required package.json fields',
    default: null,
  },
};

export const handler = async (argv: yargs.Arguments): Promise<void> => {
  const validator = new Validator();
  const validatorOptions: Options = {
    config: argv.config as string,
  };

  const result = await validator.run(
    argv.organization as string,
    validatorOptions
  );

  console.log(`${chalk.bold('Oratrix report')}\n`);
  // We need the required fields here:
  // console.log(`${Report.createValidatorReport(null, result)}\n`);

  if (result.length > 0) {
    throw Error(`You have ${result.length} field(s) missing.`);
  }
};
