import * as assert from 'assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('Testing GitHub Fetcher', () => {
  it('Should throw an error if no repository is specified - hasPackageJSON method', async () => {
    const GithubFetcher = proxyquire('../../src/util/githubFetcher', {
      axios: {
        head: () => Promise.resolve(),
      },
    }).default;
    const githubFetcher = new GithubFetcher();
    try {
      await githubFetcher.hasPackageJSON();
      assert.ok(false);
    } catch (err) {
      assert.ok(true);
    }
  });

  it('should return package.json paths of valid repositories', async () => {
    const axiosGetStub = sinon.stub();
    axiosGetStub.onCall(0).resolves({
      data: [
        {
          name: 'opossum',
          html_url: 'https://github.com/nodeshift/opossum',
          archived: false,
        },
        {
          name: 'nodeshift',
          html_url: 'https://github.com/nodeshift/nodeshift',
          archived: false,
        },
      ],
    });
    axiosGetStub.onCall(1).resolves({
      data: [
        {
          name: 'node-rpm',
          html_url: 'https://github.com/nodeshift/node-rpm',
          archived: false,
        },
        {
          name: 'openshift-rest-client',
          html_url: 'https://github.com/nodeshift/openshift-rest-client',
          archived: true,
        },
      ],
    });
    axiosGetStub.onCall(2).resolves({
      data: [],
    });

    const axiosHeadStub = sinon.stub();
    axiosHeadStub.onCall(0).resolves({ status: 200 });
    axiosHeadStub.onCall(1).resolves({ status: 200 });
    axiosHeadStub.onCall(2).resolves({ status: 404 });

    const GithubFetcher = proxyquire('../../src/util/githubFetcher', {
      axios: {
        get: axiosGetStub,
        head: axiosHeadStub,
      },
    }).default;

    const githubFetcher = new GithubFetcher();

    const result = await githubFetcher.fetch(
      'https://github.com/nodeshift/nodeshift'
    );

    const expected = [
      'https://raw.githubusercontent.com/nodeshift/opossum/master/package.json',
      'https://raw.githubusercontent.com/nodeshift/nodeshift/master/package.json',
    ];

    assert.deepStrictEqual(result, expected);
  });

  it('Should throw error if no repos found in the organization', async () => {
    const axiosGetStub = sinon.stub();
    axiosGetStub.onCall(0).resolves({
      data: [],
    });

    const GithubFetcher = proxyquire('../../src/util/githubFetcher', {
      axios: { get: axiosGetStub },
    }).default;

    const githubFetcher = new GithubFetcher();

    try {
      await githubFetcher.fetch('https://github.com/nodeshift/nodeshift');
      assert.ok(false);
    } catch (err) {
      assert.ok(true);
    }
  });
});
