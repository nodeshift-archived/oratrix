/**
 * This is an 'extracted' yargs command that communicates with
 * core/business layer.
 */
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import * as yargs from 'yargs';

import validator, { Options } from '../core/validator';

export const command = 'validate';

export const desc = 'Searches for mandatory package.json fields';

export const builder = {
  organization: {
    alias: 'o',
    describe: 'GitHub organization oratrix will validate',
    default: undefined,
  },
  repo: {
    alias: 'r',
    describe: 'GitHub repository oratrix will validate',
    default: undefined,
  },
  config: {
    alias: 'c',
    describe: 'Custom file with the required package.json fields',
    default: undefined,
  },
  token: {
    alias: 't',
    describe: 'GitHub oauth token',
    default: undefined,
  },
};

export const handler = async (argv: yargs.Arguments): Promise<void> => {
  const options: Options = {
    organization: argv.organization as string,
    repo: argv.repo as string,
    config: argv.config as string,
    token: (argv.token as string) || (process.env.GITHUB_TOKEN as string),
  };

  try {
    await validator.run(options);
  } catch (err) {
    console.log('\n', logSymbols.error, chalk.red.bold(err.message), '\n');
    process.exit(1);
  }
};
