import axios from 'axios';

// To avoid throwing errors with 404.
axios.defaults.validateStatus = (_) => true;

const PACKAGE_JSON = '/master/package.json';
const GITHUB = 'github.com';
const RAW_GITHUB = 'raw.githubusercontent.com';

class GithubFetcher {
  /**
   * Gets all repositories from given github organization.
   * @param organization organization to look at.
   */
  async getRepositories(organization: string) {
    const result = await axios.get(
      `https://api.github.com/orgs/${organization}/repos\?per_page\=50`
    );
    const repositories: string[] = [];
    result.data.forEach((resultData: { html_url: string }) =>
      repositories.push(resultData.html_url)
    );
    return repositories;
  }

  /**
   * Checks if the given repository has a package.json file.
   * @param repository github repository to check
   * @returns number status 200 if package.json exists.
   */
  async hasPackageJSON(repository: string): Promise<number> {
    if (!repository || !repository.trim()) {
      throw Error('Repository cannot be empty.');
    }
    return (await axios.head(repository)).status;
  }

  /**
   * Appends '/blob/master/package.json' to the repository URL.
   * Changes from 'github.com' to 'raw.githubusercontent.com'.
   */
  prepare(repositories: string[]) {
    return repositories.map((repository) => {
      repository = repository.replace(GITHUB, RAW_GITHUB);
      return repository + PACKAGE_JSON;
    });
  }

  async fetch(organization: string) {
    const repositories = await this.getRepositories(organization);
    const rawRepositories = this.prepare(repositories);
    rawRepositories.forEach(async (repository) => {
      const status = await this.hasPackageJSON(repository);
      if (status === 200) {
        const result = await axios.get(repository);
        // console.log(result.data);
      }
    });
  }
}

export default GithubFetcher;
