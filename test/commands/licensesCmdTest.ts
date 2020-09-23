import * as assert from 'assert';
import * as LicensesCmd from '../../src/commands/licensesCmd';

describe('A Licenses command', () => {
  it('Should contain the properties', () => {
    assert.strictEqual(LicensesCmd.command, 'licenses');
    assert.strictEqual(LicensesCmd.desc, 'Searches for licenses of the project.');
    assert.strictEqual(LicensesCmd.builder.allows.alias, 'a');
    assert.strictEqual(
      LicensesCmd.builder.allows.describe,
      'Comma separated list of allowed licenses.'
    );
    assert.strictEqual(LicensesCmd.builder.allows.default, false);
  });
});
