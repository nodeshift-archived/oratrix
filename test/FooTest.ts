import Foo from '../src/core/Foo';
import * as assert from 'assert';

describe('A Foo', () => {

  const foo = new Foo();
  it('Should return hello', () => {
    assert.equal(foo.run('hello', false), 'hello');
  });

  it('Should return hello uppercase', () => {
    assert.equal(foo.run('hello', true), 'HELLO');
  });
});
