import {mkdir, readFile} from 'fs/promises';

import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

import rimraf from 'rimraf';

import coveradge from '../src/coveradge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fixturesPath = join(__dirname, 'fixtures');
const resultsPath = join(__dirname, 'results');
const coveragePath = './test/fixtures/coverage-summary.json';

describe('Programmatic', function () {
  this.timeout(10000);
  before((done) => {
    rimraf(resultsPath, () => {
      mkdir(resultsPath);
      done();
    });
  });
  it('Works with watermark config', async function () {
    const badgeFile = 'watermark-config.svg';
    const output = join(resultsPath, badgeFile);
    await coveradge({
      coveragePath,
      output,
      nycConfig: {
        watermarks: {
          branches: [30, 50]
        }
      },
      logging: 'verbose'
    });
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });
  it('Works with watermark config but missing condition', async function () {
    const badgeFile = 'watermark-config-missing-condition.svg';
    const output = join(resultsPath, badgeFile);
    await coveradge({
      coveragePath,
      output,
      nycConfig: {
        watermarks: {}
      },
      logging: 'verbose'
    });
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });
  it('Works with a color array', async function () {
    const badgeFile = 'color-array.svg';
    const output = join(resultsPath, badgeFile);
    await coveradge({
      coveragePath,
      output,
      branchesThreshold: '30-50',
      failColor: ['blue', 's{yellow}'],
      logging: 'verbose'
    });
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });
  it('Works with an introColor array', async function () {
    const badgeFile = 'introTemplate-introColor-array.svg';
    const output = join(resultsPath, badgeFile);
    await coveradge({
      // eslint-disable-next-line no-template-curly-in-string
      introTemplate: '${"coverage".toUpperCase()}',
      introColor: ['yellow', 's{red}'],
      coveragePath,
      output,
      logging: 'verbose'
    });
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });
});
