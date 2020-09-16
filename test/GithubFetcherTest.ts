import GithubFetcher from '../src/util/GithubFetcher';
import * as assert from 'assert';

describe('A GithubFetcher', () => {

  const githubFetcher = new GithubFetcher();
  it('Should check if the repository contains a package.json', async () => {
    const result = await githubFetcher.hasPackageJSON('https://github.com/nodeshift/nodeshift');
    assert.equal(result, 200);
  });

  it('Should fetch all the package.json files from given github organization', async () => {
    const result = await githubFetcher.fetch('nodeshift');
    assert.equal(result, 200);
  });

});
