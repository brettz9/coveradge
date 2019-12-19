'use strict';

const {promisify} = require('util');
const {
  writeFile: writeFileOriginal /* unlink: unlinkOriginal, openSync */
} = require('fs');
// const {join} = require('path');
// const {spawn} = require('child_process');

const {BadgeFactory} = require('gh-badges');
// const {convertFile} = require('convert-svg-to-png');

/**
 * @param {CoveradgeOptions} cfg
 * @returns {void}
 */
async function coveradge (cfg) {
  // Todo: Make this code dynamic and work here!

  // eslint-disable-next-line global-require
  const coverageSummary = require('../../coverage/coverage-summary.json');

  const writeFile = promisify(writeFileOriginal);
  // const unlink = promisify(unlinkOriginal);
  const {pct} = coverageSummary.total.statements;

  /*
  const format = 'png';
  const out = openSync('coverage-badge.' + format, 'a');
  spawn('./node_modules/.bin/badge', [
    `Coverage ${pct}%`,
    ':orange',
    '.' + format
  ], {
    stdio: [process.stdin, out, process.stderr]
  });
  */

  // Only CLI handles image conversion
  const bf = new BadgeFactory();
  const format = {
    text: ['Coverage', `${pct}%`],
    color: 'orange',
    format: 'svg', // svg|json|png|jpg|gif
    // labelColor: 'black',
    template: 'flat' // 'flat'|'flat-square'|'for-the-badge'|'plastic'|'social'
  };
  const badge = bf.create(format);

  const svgFilePath = 'coverage-badge.svg';
  await writeFile(svgFilePath, badge);
  console.log('Finished writing temporary SVG file...');

  // Works too
  // const outputFile = await convertFile(join(process.cwd(), svgFilePath));
  // console.log('Wrote file', outputFile);

  // await unlink(svgFilePath);
  // console.log('Cleaned up temporary SVG file');
  console.log('Done!');
}

module.exports = coveradge;
