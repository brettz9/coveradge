import {mkdir, readFile} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {execFile as ef} from 'child_process';
import {promisify} from 'util';

import {expect} from 'chai';
import {rimraf} from 'rimraf';

const __dirname = dirname(fileURLToPath(import.meta.url));

const execFile = promisify(ef);

const binFile = join(__dirname, '../bin/index.js');
const fixturesPath = join(__dirname, 'fixtures');
const resultsPath = join(__dirname, 'results');
const coveragePath = './test/fixtures/coverage-summary.json';

describe('CLI', function () {
  this.timeout(10000);
  before(async () => {
    await rimraf(resultsPath);
    await mkdir(resultsPath);
  });

  it('Gets help', async function () {
    const {stdout, stderr} = await execFile(binFile, ['-h']);
    expect(stderr).to.equal('');
    expect(stdout).to.contain(
      'Generate coverage badges during local'
    );
  });

  it('can be used as regular reporter', async function () {
    const {stdout, stderr} = await execFile('nyc', [
      '--reporter',
      // Has to be relative to `istanbul-reports`
      '../../../../../src/reporter.cjs',
      'node',
      './test-helpers/sample.cjs'
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.contain(
      'B branch test'
    );
  });

  it('Throws with bad format', async function () {
    const {stdout, stderr} = await execFile(binFile, [
      '--format', 'badFormat'
    ]);
    expect(stdout).to.equal('');
    expect(stderr).to.contain('Bad format');
  });

  it('Builds an SVG badge', async function () {
    const badgeFile = 'basic-badge.svg';
    const output = join(resultsPath, badgeFile);
    const {stdout, stderr} = await execFile(binFile, [
      '--coveragePath', coveragePath,
      '--output', output,
      '--logging', 'verbose'
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.contain('Statements').
      and.contain('%').and.contain('Done!');
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });

  it('Builds an SVG badge without logging', async function () {
    const badgeFile = 'basic-badge.svg';
    const output = join(resultsPath, badgeFile);
    const {stdout, stderr} = await execFile(binFile, [
      '--coveragePath', coveragePath,
      '--output', output
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.equal('');
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });

  it('Builds a PNG badge', async function () {
    const badgeFile = 'basic-badge.png';
    const output = join(resultsPath, badgeFile);
    const {stdout, stderr} = await execFile(binFile, [
      '--format', 'png',
      '--coveragePath', coveragePath,
      '--output', output,
      '--logging', 'verbose'
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.contain('Statements').
      and.contain('%').and.contain('Done!');
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });

  it('Builds badge with branches threshold', async function () {
    const badgeFile = 'branches-threshold.svg';
    const output = join(resultsPath, badgeFile);
    const {stdout, stderr} = await execFile(binFile, [
      '--branchesThreshold', '30-50',
      '--coveragePath', coveragePath,
      '--output', output,
      '--logging', 'verbose'
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.contain('Statements').
      and.contain('%').and.contain('Done!');
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });

  it(
    'Builds badge with `introTemplate` and default `introColor`',
    async function () {
      const badgeFile = 'introTemplate-default-introColor.svg';
      const output = join(resultsPath, badgeFile);
      const {stdout, stderr} = await execFile(binFile, [
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line no-template-curly-in-string -- Using templates ourselves
        '--introTemplate', '${"coverage".toUpperCase()}',
        '--coveragePath', coveragePath,
        '--output', output,
        '--logging', 'verbose'
      ]);
      expect(stderr).to.equal('');
      expect(stdout).to.contain('Statements').
        and.contain('%').and.contain('Done!');
      const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
      const results = await readFile(output, 'utf8');
      expect(results).to.equal(expected);
    }
  );

  it(
    'Builds badge with `introTemplate` and explicit `introColor`',
    async function () {
      const badgeFile = 'introTemplate-explicit-introColor.svg';
      const output = join(resultsPath, badgeFile);
      const {stdout, stderr} = await execFile(binFile, [
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line no-template-curly-in-string -- Using templates ourselves
        '--introTemplate', '${"coverage".toUpperCase()}',
        '--introColor', 'red,s{blue}',
        '--coveragePath', coveragePath,
        '--output', output,
        '--logging', 'verbose'
      ]);
      expect(stderr).to.equal('');
      expect(stdout).to.contain('Statements').
        and.contain('red').and.contain('s{blue}').
        and.contain('%').and.contain('Done!');
      const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
      const results = await readFile(output, 'utf8');
      expect(results).to.equal(expected);
    }
  );

  it('Builds badge with limited conditions', async function () {
    const badgeFile = 'limited-conditions.svg';
    const output = join(resultsPath, badgeFile);
    const {stdout, stderr} = await execFile(binFile, [
      '--conditions', 'statements,lines',
      '--coveragePath', coveragePath,
      '--output', output,
      '--logging', 'verbose'
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.contain('Statements').
      and.contain('%').and.contain('Done!');
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });

  it('Builds badge with `aggregateConditions`', async function () {
    const badgeFile = 'aggregateConditions.svg';
    const output = join(resultsPath, badgeFile);
    const {stdout, stderr} = await execFile(binFile, [
      '--statementsThreshold', '30',
      '--aggregateConditions',
      '--coveragePath', coveragePath,
      '--output', output,
      '--logging', 'verbose'
    ]);
    expect(stderr).to.equal('');
    expect(stdout).to.not.contain('Statements');
    expect(stdout).to.contain('Branches').
      and.to.contain('%').and.to.contain('Done!');
    const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
    const results = await readFile(output, 'utf8');
    expect(results).to.equal(expected);
  });

  it(
    'Builds badge with `aggregateConditions` resulting in medium range',
    async function () {
      const badgeFile = 'aggregateConditions-medium.svg';
      const output = join(resultsPath, badgeFile);
      const {stdout, stderr} = await execFile(binFile, [
        '--statementsThreshold', '30-90',
        '--linesThreshold', '30-90',
        '--branchesThreshold', '30-90',
        '--functionsThreshold', '30-90',
        '--aggregateConditions',
        '--coveragePath', coveragePath,
        '--output', output,
        '--logging', 'verbose'
      ]);
      expect(stderr).to.equal('');
      expect(stdout).to.contain('Statements').
        and.to.contain('%').and.to.contain('Done!');
      expect(stdout).to.not.contain('Branches');
      const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
      const results = await readFile(output, 'utf8');
      expect(results).to.equal(expected);
    }
  );

  it(
    'Builds badge with `aggregateConditions` resulting in passing range',
    async function () {
      const badgeFile = 'aggregateConditions-passing.svg';
      const output = join(resultsPath, badgeFile);
      const {stdout, stderr} = await execFile(binFile, [
        '--statementsThreshold', '30-50',
        '--linesThreshold', '30-40',
        '--branchesThreshold', '30-50',
        '--functionsThreshold', '30-40',
        '--aggregateConditions',
        '--coveragePath', coveragePath,
        '--output', output,
        '--logging', 'verbose'
      ]);
      expect(stderr).to.equal('');
      expect(stdout).to.contain('Statements').
        and.to.contain('%').and.to.contain('Done!');
      expect(stdout).to.not.contain('Branches');
      const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
      const results = await readFile(output, 'utf8');
      expect(results).to.equal(expected);
    }
  );
});
