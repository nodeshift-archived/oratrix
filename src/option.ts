/**
 * Extracted detailed yargs options.
 */
export const fields = () => ({
  description: 'Path to json file that contains the fields.',
  required: false,
  alias: 'f',
});

export const organization = () => ({
  description: 'The name of the github organization to look at.',
  required: false,
  alias: 'o',
});

export const cwd = () => ({
  description: 'The current working directory',
  default: process.cwd()
});
