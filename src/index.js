'use strict';

const {promisify} = require('util');
const {join} = require('path');
const {spawn} = require('child_process');
const {
  writeFile: writeFileOriginal, unlink: unlinkOriginal, openSync
} = require('fs');

const {BadgeFactory} = require('gh-badges');
const {convertFile} = require('convert-svg-to-png');
const es6Templates = require('es6-template-strings');

const writeFile = promisify(writeFileOriginal);
const unlink = promisify(unlinkOriginal);

/**
 * @param {CoveradgeOptions} cfg
 * @returns {void}
 */
async function coveradge ({
  format = 'svg', color = 'orange', template = 'flat',
  output = 'coverage-badge',
  coveragePath = './coverage/coverage-summary.json',
  // eslint-disable-next-line no-template-curly-in-string
  textTemplate = 'Coverage ${pct}%'
}) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const coverageSummary = require(join(process.cwd(), coveragePath));

  const {pct} = coverageSummary.total.statements;

  const text = es6Templates(
    textTemplate, {pct}
  );

  // Only CLI handles image conversion
  const bf = new BadgeFactory();
  const formatInfo = {
    text: text.split(' '),
    color,
    // Doesn't work properly with other image formats (only "svg" and "json")
    format, // svg|json|png|jpg|gif
    // labelColor: 'black',
    template // 'flat'|'flat-square'|'for-the-badge'|'plastic'|'social'
  };
  const badge = bf.create(formatInfo);

  // eslint-disable-next-line prefer-named-capture-group
  output = output.replace(/\.(png|svg)$/u, '');

  const svgFilePath = `${output}.svg`;
  await writeFile(svgFilePath, badge);
  console.log('Finished writing temporary SVG file...');

  if (format !== 'svg') {
    // For PNG, need conversion as built-in doesn't work for non-SVG images
    const out = openSync(`${output}.${format}`, 'a');
    spawn('./node_modules/.bin/badge', [
      text,
      `:${color}`,
      `.${format}`
    ], {
      stdio: [process.stdin, out, process.stderr]
    });
    const outputFile = await convertFile(join(process.cwd(), svgFilePath));
    console.log('Wrote file', outputFile);
    await unlink(svgFilePath);
    console.log('Cleaned up temporary SVG file');
  }

  console.log('Done!');
}

module.exports = coveradge;
