import * as assert from 'assert';
import GithubFetcher from '../src/util/githubFetcher';

describe('A GithubFetcher', () => {
  const githubFetcher = new GithubFetcher();
  it('Should check if the repository contains a package.json', async () => {
    const result = await githubFetcher.hasPackageJSON(
      'https://github.com/nodeshift/nodeshift'
    );
    assert.strictEqual(result, 200);
  });

  it('Should fetch all the package.json files from given github organization', async () => {
    const result = await githubFetcher.fetch('nodeshift');
    assert.strictEqual(result, 200);
  });
});
