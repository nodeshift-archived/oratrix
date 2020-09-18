import * as assert from 'assert';
import Foo from '../src/core/foo';

describe('A Foo', () => {
  const foo = new Foo();
  it('Should return hello', () => {
    assert.strictEqual(foo.run('hello', false), 'hello');
  });

  it('Should return hello uppercase', () => {
    assert.strictEqual(foo.run('hello', true), 'HELLO');
  });
});
