/**
 * This is an 'extracted' yargs command that communicates with
 * core/business layer.
 */
import Foo from '../core/Foo';

export const command = 'foo';

export const desc = 'Prints hello world.';

export const builder = {
  uppercase: {
    alias: 'u',
    describe: 'Prints the message in uppercase.',
    default: false,
  },
};

export const handler = function (argv: any) {
  const foo = new Foo();
  foo.run('hello world', argv.uppercase);
};
