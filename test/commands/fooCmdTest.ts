import * as assert from 'assert';
import * as FooCmd from '../../src/commands/fooCmd';

describe('A Foo command', () => {
  it('Should contain the properties', () => {
    assert.strictEqual(FooCmd.command, 'foo');
    assert.strictEqual(FooCmd.desc, 'Prints hello world.');
    assert.strictEqual(FooCmd.builder.uppercase.alias, 'u');
    assert.strictEqual(
      FooCmd.builder.uppercase.describe,
      'Prints the message in uppercase.'
    );
    assert.strictEqual(FooCmd.builder.uppercase.default, false);
  });
});
