import * as assert from 'assert';
import Report from '../../src/util/report';
import FieldLoader from '../../src/util/fieldLoader';

const fieldLoader = new FieldLoader();
let requiredFields: string[];

before(async () => {
  requiredFields = Object.keys(await fieldLoader.loadFields());
});

describe('Report', () => {
  it('should create report for validator command', () => {
    const tableDataTest = ['test'];
    const result = Report.createValidatorReport(requiredFields, tableDataTest);
    assert.ok(result.includes('Fields'));
    assert.ok(result.includes('Status'));
    assert.ok(result.includes('name'));
    assert.ok(result.includes('version'));
    assert.ok(result.includes('description'));
    assert.ok(result.includes('author'));
    assert.ok(result.includes('license'));
    assert.ok(result.includes('dependencies'));
    assert.ok(result.includes('devDependencies'));
  });
});
