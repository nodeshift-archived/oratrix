import Table from 'cli-table3';
import chalk from 'chalk';

/**
 * This class is responsible to create stdout reports for the commands.
 */
export default class Report {
  /**
   * Creates a cli-table3 report for the validator command.
   * @param tableData the data to be passed to cli-table3 to construct the report.
   * @param requiredFields The fields considered required to have in package.json
   */
  static createValidatorReport(requiredFields: Record<string, unknown>, tableData: string[]): string {
    // print report
    const table = new Table({
      head: ['Fields', 'Status'],
      style: {
        head: ['yellow'],
      },
    });

    Object.keys(requiredFields).forEach((field) => {
      const status =
      tableData.indexOf(field) === -1
          ? chalk.bgGreen.white(' PASS ')
          : chalk.bgRed.white(' MISSING ');

      table.push([field, status]);
    });

    return table.toString();

    // console.log(`${chalk.bold('Oratrix report')}\n`);
    // console.log(`${table.toString()}\n`);

    // if (tableData.length > 0) {
    //   throw Error(`You have ${tableData.length} field(s) missing.`);
    // }
  }
}
