import {mkdirSync, readFile as rf} from 'fs';
import {execFile as ef} from 'child_process';
import {promisify} from 'util';
import {join} from 'path';

import rimraf from 'rimraf';

const execFile = promisify(ef);
const readFile = promisify(rf);

const binFile = join(__dirname, '../bin/index.js');
const fixturesPath = join(__dirname, 'fixtures');
const resultsPath = join(__dirname, 'results');
const coveragePath = './test/fixtures/coverage-summary.json';

describe('CLI', function () {
  this.timeout(10000);
  before((done) => {
    rimraf(resultsPath, () => {
      mkdirSync(resultsPath);
      done();
    });
  });

  it('Gets help', async function () {
    const {stdout, stderr} = await execFile(binFile, ['-h']);
    expect(stderr).to.equal('');
    expect(stdout).to.contain(
      'Generate coverage badges during local'
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
    expect(stdout).to.contain('Statements')
      .and.contain('%').and.contain('Done!');
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
    expect(stdout).to.contain('Statements')
      .and.contain('%').and.contain('Done!');
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
    expect(stdout).to.contain('Statements')
      .and.contain('%').and.contain('Done!');
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
        // eslint-disable-next-line no-template-curly-in-string
        '--introTemplate', '${"coverage".toUpperCase()}',
        '--coveragePath', coveragePath,
        '--output', output,
        '--logging', 'verbose'
      ]);
      expect(stderr).to.equal('');
      expect(stdout).to.contain('Statements')
        .and.contain('%').and.contain('Done!');
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
        // eslint-disable-next-line no-template-curly-in-string
        '--introTemplate', '${"coverage".toUpperCase()}',
        '--introColor', 'red,s{blue}',
        '--coveragePath', coveragePath,
        '--output', output,
        '--logging', 'verbose'
      ]);
      expect(stderr).to.equal('');
      expect(stdout).to.contain('Statements')
        .and.contain('red').and.contain('s{blue}')
        .and.contain('%').and.contain('Done!');
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
    expect(stdout).to.contain('Statements')
      .and.contain('%').and.contain('Done!');
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
    expect(stdout).to.contain('Branches')
      .and.to.contain('%').and.to.contain('Done!');
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
      expect(stdout).to.contain('Statements')
        .and.to.contain('%').and.to.contain('Done!');
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
      expect(stdout).to.contain('Statements')
        .and.to.contain('%').and.to.contain('Done!');
      expect(stdout).to.not.contain('Branches');
      const expected = await readFile(join(fixturesPath, badgeFile), 'utf8');
      const results = await readFile(output, 'utf8');
      expect(results).to.equal(expected);
    }
  );
});
