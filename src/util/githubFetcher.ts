import axios from 'axios';
import fieldLoader from '../util/fieldLoader';
import { Options } from '../core/validator';

type JSObject = Record<string, unknown>;

// To avoid throwing errors with 404.
axios.defaults.validateStatus = () => true;

const PACKAGE_JSON = '/master/package.json';
const GITHUB = 'github.com';
const RAW_GITHUB = 'raw.githubusercontent.com';

/**
 * Gets all repositories from given github organization.
 * @param organization organization to look at.
 */
async function getRepositories(
  organization: string,
  options?: Options
): Promise<JSObject[]> {
  const repositories: JSObject[] = [];
  const axiosOptions = {
    headers: {
      Authorization: options?.token ? `token ${options.token}` : '',
    },
  };
  // collect all repositories from github
  let page = 1;
  let pageIsEmpty = false;
  while (!pageIsEmpty) {
    const { data, status } = await axios.get(
      `https://api.github.com/orgs/${organization}/repos?per_page=50&page=${page}`,
      axiosOptions
    );

    if (status !== 200 && status !== 404) {
      throw new Error(
        data.message || 'An error occurred when fetching from GitHub'
      );
    }

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
async function hasPackageJSON(
  repository: string,
  options?: Options
): Promise<boolean> {
  if (!repository || !repository.trim()) {
    throw Error('Repository cannot be empty.');
  }
  const axiosOptions = {
    headers: {
      Authorization: options?.token ? `token ${options.token}` : '',
    },
  };
  return (await axios.head(repository, axiosOptions)).status === 200;
}

async function fetch(
  organization: string,
  options?: Options
): Promise<string[]> {
  const repositories = await getRepositories(organization, options);
  const repositoriesPaths: string[] = repositories
    .filter((repo) => !repo.archived)
    .map((repo) => repo.html_url as string)
    .map((repo) => repo.replace(GITHUB, RAW_GITHUB) + PACKAGE_JSON);

  if (repositoriesPaths.length === 0) {
    throw Error(`No repos found for the ${organization} organization!`);
  }
  // check if repositories have a package.json file
  const packageMatrix = await Promise.all(
    repositoriesPaths.map(async (repo) => await hasPackageJSON(repo, options))
  );
  // filter repositoriesPaths array
  const result = repositoriesPaths.filter((_, index) => packageMatrix[index]);
  return result;
}

async function fetchRepo(query: string, options?: Options): Promise<JSObject> {
  const axiosOptions = {
    headers: {
      Authorization: options?.token ? `token ${options.token}` : '',
    },
  };
  // fetch repo info from GitHub
  const { data, status } = await axios.get(
    `https://api.github.com/repos/${query}`,
    axiosOptions
  );

  if (status !== 200) {
    throw new Error(
      data.message || 'An error occurred when fetching from GitHub'
    );
  }

  if (data.archived) {
    throw new Error(`The repository ${query} has been archived!`);
  }

  const repoPath = data.html_url.replace(GITHUB, RAW_GITHUB) + PACKAGE_JSON;
  const isNodeProject = hasPackageJSON(repoPath);

  if (!isNodeProject) {
    throw new Error(`Can't find package.json for the ${query} repo`);
  }

  const fields = await fieldLoader.loadFieldsFromURL(repoPath);
  return fields;
}

export default {
  fetch,
  fetchRepo,
};
