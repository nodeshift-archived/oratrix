/**
 * This is an 'extracted' yargs command that communicates with
 * core/business layer.
 */
import * as yargs from 'yargs';
import Licenses from '../core/licenses';

export const command = 'licenses';

export const desc = 'Searches for licenses of the project.';

export const builder = {
  allows: {
    alias: 'a',
    describe: 'Comma separated list of allowed licenses.',
    default: false,
  },
};

export const handler = async (argv: yargs.Arguments): Promise<void> => {
  const licenses = new Licenses();
  const result = await licenses.run(argv.cwd as string);
  // TODO: print out the license information using cli-table3
  console.log(result);
};
