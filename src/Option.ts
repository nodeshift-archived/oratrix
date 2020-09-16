/**
 * Extracted detailed yargs options.
 */
export default class Option {
  public static fields() {
    const fields = {
      description: 'Path to json file that contains the fields.',
      required: false,
      alias: 'f',
    };
    return fields;
  }

  public static organization() {
    const organization = {
      description: 'The name of the github organization to look at.',
      required: false,
      alias: 'o',
    };
    return organization;
  }
}
