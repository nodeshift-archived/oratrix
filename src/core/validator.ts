import Table from 'cli-table3';
import chalk from 'chalk';
import FieldLoader from '../util/fieldLoader';
import Differ from '../util/differ';

class Validator {
  fieldLoader = new FieldLoader();
  differ = new Differ();

  async run(organization?: string): Promise<void> {
    if (organization) {
      this.runOrganizationCheck(organization);
    } else {
      this.runLocalCheck();
    }
  }

  async runLocalCheck(): Promise<void> {
    const requiredFields = await this.fieldLoader.loadFields();
    const packageFields = await this.fieldLoader.loadFields('./package.json');
    // get report from differ
    const report = this.differ.run(requiredFields, packageFields);

    // print report
    const table = new Table({
      head: ['Fields', 'Status'],
      style: {
        head: ['yellow'],
      },
    });

    Object.keys(requiredFields).forEach((field) => {
      const status =
        report.indexOf(field) === -1
          ? chalk.bgGreen.white(' PASS ')
          : chalk.bgRed.white(' MISSING ');

      table.push([field, status]);
    });

    console.log(`${chalk.bold('Oratrix report')}\n`);
    console.log(`${table.toString()}\n`);

    if (report.length > 0) {
      throw Error(`You have ${report.length} field(s) missing.`);
    }
  }

  runOrganizationCheck(organization: string): void {
    // todo!
    console.log(organization);
  }
}

export default Validator;
