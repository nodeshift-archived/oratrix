import Table from 'cli-table3';
import chalk from 'chalk';

/**
 * Creates a cli-table3 report for the validator command.
 * @param tableData the data to be passed to cli-table3 to construct the report.
 * @param requiredFields The fields considered required to have in package.json
 */
export const createValidatorReport = (
  requiredFields: string[],
  tableData: string[]
): string => {
  // print report
  const table = new Table({
    head: ['Fields', 'Status'],
    style: {
      head: ['yellow'],
    },
  });

  requiredFields.forEach((field) => {
    const status =
      tableData.indexOf(field) === -1
        ? chalk.bgGreen.white(' PASS ')
        : chalk.bgRed.white(' MISSING ');

    table.push([field, status]);
  });

  return table.toString();
};
