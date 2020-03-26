'use strict';

const {promisify} = require('util');
const {join} = require('path');
const {spawn} = require('child_process');
const {
  writeFile: writeFileOriginal, unlink: unlinkOriginal, openSync
} = require('fs');

const {BadgeFactory} = require('gh-badges');
const es6Templates = require('es6-template-strings');
const {loadNycConfig} = require('@istanbuljs/load-nyc-config');

const writeFile = promisify(writeFileOriginal);
const unlink = promisify(unlinkOriginal);

/**
 * @param {CoveradgeOptions} cfg
 * @returns {void}
 */
async function coveradge (cfg) {
  const {
    format = 'svg',
    passColor = 'green',
    failColor = 'orange',
    template = 'flat',
    output = 'coverage-badge',
    coveragePath = './coverage/coverage-summary.json',
    // eslint-disable-next-line no-template-curly-in-string
    textTemplate = 'Coverage ${failingConditionPct}%'
  } = cfg;
  const conditions = (cfg.conditions || '').split(',');
  const nycConfig = await loadNycConfig();

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const coverageSummary = require(join(process.cwd(), coveragePath));

  const possibleConditions = ['statements', 'branches', 'lines', 'functions'];
  const possibleConditionThresholds = possibleConditions.reduce(
    (o, condition) => {
      // Priority to CLI condition threshold, then to nyc, then default to 100
      o[condition] = cfg[condition + 'Threshold'] ||
        nycConfig[condition] || 100;
      return o;
    },
    {}
  );

  const failsThreshold = (condition) => {
    const threshold = possibleConditionThresholds[condition];
    return coverageSummary.total[condition] < threshold;
  };

  const conditionsToCheck = conditions.length
    // User only wishes to check certain conditions
    ? [
      ...new Set(conditions.filter((condition) => {
        return possibleConditions.includes(condition);
      }))
    ]
    : possibleConditions;

  const failingCondition = conditionsToCheck.find(
    (thr) => failsThreshold(thr)
  );
  const color = failingCondition
    ? failColor
    : passColor;

  const text = es6Templates(
    textTemplate, {
      failingCondition,
      failingConditionPct: coverageSummary.total[failingCondition],
      ...(
        // If user specified conditions, only allow these in template;
        //   otherwise, allow all
        conditions.length ? conditions : possibleConditions
      ).reduce((o, condition) => {
        o[condition + 'Pct'] = coverageSummary.total[condition].pct;
        o[condition + 'Threshold'] = possibleConditionThresholds[condition];
        return o;
      }, {})
    }
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
  const outputBase = output.replace(/\.(png|svg)$/u, '');

  const svgFilePath = `${outputBase}.svg`;
  await writeFile(svgFilePath, badge);
  console.log('Finished writing temporary SVG file...');

  if (format !== 'svg') {
    // For PNG, need conversion as built-in doesn't work for non-SVG images
    const out = openSync(`${outputBase}.${format}`, 'a');
    spawn('./node_modules/.bin/badge', [
      text,
      `:${color}`,
      `.${format}`
    ], {
      stdio: [process.stdin, out, process.stderr]
    });
    // Make non-global as optional
    // eslint-disable-next-line global-require, node/no-unpublished-require
    const {convertFile} = require('convert-svg-to-png');
    const outputFile = await convertFile(join(process.cwd(), svgFilePath));
    console.log('Wrote file', outputFile);
    await unlink(svgFilePath);
    console.log('Cleaned up temporary SVG file');
  }

  console.log('Done!');
}

module.exports = coveradge;
