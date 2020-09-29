/**
 * This is an 'extracted' yargs command that communicates with
 * core/business layer.
 */
import * as yargs from 'yargs';
import Package from '../core/package';

export const command = 'check';

export const desc = 'Searches for mandatory package.json fields';

export const builder = {
  organization: {
    alias: 'o',
    describe: 'GitHub organization oratrix will check',
    default: null,
  },
};

export const handler = async (argv: yargs.Arguments): Promise<void> => {
  const pkg = new Package();
  pkg.run(argv.organization as string);
};
