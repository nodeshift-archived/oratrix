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
  const Pkg = new Package();
  if (argv.organization) {
    Pkg.runOrganizationCheck(argv.organization as string);
  } else {
    Pkg.runLocalCheck();
  }
};
