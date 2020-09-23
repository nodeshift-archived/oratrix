/**
 * This is an 'extracted' yargs command that communicates with
 * core/business layer.
 */
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

export const handler = function (argv:any): void {
  const licenses = new Licenses();
  licenses.run(argv.cwd);
};
