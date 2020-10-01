import axios from 'axios';

type JSObject = Record<string, unknown>;

// To avoid throwing errors with 404.
axios.defaults.validateStatus = () => true;

const PACKAGE_JSON = '/master/package.json';
const GITHUB = 'github.com';
const RAW_GITHUB = 'raw.githubusercontent.com';

class GithubFetcher {
  /**
   * Gets all repositories from given github organization.
   * @param organization organization to look at.
   */
  async getRepositories(organization: string): Promise<JSObject[]> {
    const repositories: JSObject[] = [];
    // collect all repositories from github
    let page = 1;
    let pageIsEmpty = false;
    while (!pageIsEmpty) {
      const { data } = await axios.get(
        `https://api.github.com/orgs/${organization}/repos?per_page=50&page=${page}`
      );
      // no more data to parse
      if (!Array.isArray(data) || data.length === 0) {
        pageIsEmpty = true;
        continue;
      }
      repositories.push(...(data as JSObject[]));
      page++;
    }
    return repositories;
  }

  /**
   * Checks if the given repository has a package.json file.
   * @param repository github repository to check
   * @returns boolean true if package.json exists, false otherwise.
   */
  async hasPackageJSON(repository: string): Promise<boolean> {
    if (!repository || !repository.trim()) {
      throw Error('Repository cannot be empty.');
    }
    return (await axios.head(repository)).status === 200;
  }

  async fetch(organization: string): Promise<string[]> {
    const repositories = await this.getRepositories(organization);
    const repositoriesPaths: string[] = repositories
      .filter((repo) => !repo.archived)
      .map((repo) => repo.html_url as string)
      .map((repo) => repo.replace(GITHUB, RAW_GITHUB) + PACKAGE_JSON);

    if (repositoriesPaths.length === 0) {
      throw Error(`No repos found for the ${organization} organization!`);
    }
    // check if repositories have a package.json file
    const packageMatrix = await Promise.all(
      repositoriesPaths.map(async (repo) => await this.hasPackageJSON(repo))
    );
    // filter repositoriesPaths array
    const result = repositoriesPaths.filter((_, index) => packageMatrix[index]);
    return result;
  }
}

export default GithubFetcher;
