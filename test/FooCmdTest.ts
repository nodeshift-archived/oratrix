import * as FooCmd from '../src/commands/FooCmd';
import * as assert from 'assert';

describe('A Foo command', () => {

  it('Should contain the properties', () => {
    assert.equal(FooCmd.command, 'foo');
    assert.equal(FooCmd.desc, 'Prints hello world.');
    assert.equal(FooCmd.builder.uppercase.alias, 'u');
    assert.equal(FooCmd.builder.uppercase.describe, 'Prints the message in uppercase.');
    assert.equal(FooCmd.builder.uppercase.default, false);
  });

});
