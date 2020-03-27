'use strict';

// Todo[engine:node@>=12.0.0]: Remove flat/flatMap polyfill
require('array-flat-polyfill');

// Tried promisified async methods but were puzzlingly not working
const {writeFileSync, unlinkSync} = require('fs');
const {resolve: pathResolve} = require('path');

const badgeUp = require('badge-up').v2;
const es6Templates = require('es6-template-strings');
const {loadNycConfig} = require('@istanbuljs/load-nyc-config');

/**
 * @param {CoveradgeOptions} cfg
 * @returns {void}
 */
async function coveradge (cfg) {
  const {
    format = 'svg',
    passColor = 'green,s{black}',
    failColor = 'orange,s{black}',
    mediumColor = 'yellow,s{black}',
    introTemplate = '',
    introColor = 'navy',
    aggregateConditions = false,
    output = 'coverage-badge',
    logging = 'off',
    coveragePath = './coverage/coverage-summary.json',
    // eslint-disable-next-line no-template-curly-in-string
    textTemplate = '${condition} ${conditionPct}%',

    // `coverageSummary` is not available by CLI but gets
    //  default (could allow JSON string, but probably not worth it)
    // eslint-disable-next-line global-require, import/no-dynamic-require
    coverageSummary = require(pathResolve(process.cwd(), coveragePath))
  } = cfg;

  if (!(new Set(['png', 'svg']).has(format))) {
    throw new TypeError('Bad format');
  }

  const log = (...args) => {
    if (logging !== 'off') {
      console.log(...args);
    }
  };
  const conditions = cfg.conditions ? cfg.conditions.split(',') : null;

  const nycConfig = cfg.nycConfig || await loadNycConfig();

  const possibleConditions = ['statements', 'branches', 'lines', 'functions'];
  const possibleConditionThresholds = possibleConditions.reduce(
    (o, condition) => {
      const threshold = cfg[condition + 'Threshold'];
      let low, medium;
      if (threshold) {
        const hyphenIdx = threshold.indexOf('-');
        low = threshold.slice(0, hyphenIdx);
        medium = threshold.slice(hyphenIdx + 1);
      }
      const watermark = nycConfig.watermarks &&
        nycConfig.watermarks[condition];
      // Priority to CLI condition threshold, then to nyc, then default to 100
      o['low_' + condition] = low
        ? parseFloat(low)
        : watermark
          ? watermark[0]
          : nycConfig[condition] || 100;
      o['medium_' + condition] = medium
        ? parseFloat(medium)
        : watermark
          ? watermark[1]
          : nycConfig[condition] || 100;
      return o;
    },
    {}
  );

  const getThresholdStatus = (condition) => {
    const threshold = possibleConditionThresholds['low_' + condition];
    const failing = coverageSummary.total[condition].pct < threshold;
    if (failing) {
      return 'failing';
    }
    const mediumThreshold = possibleConditionThresholds['medium_' + condition];
    const medium = coverageSummary.total[condition].pct < mediumThreshold;
    return medium ? 'medium' : 'passing';
  };

  const conditionsToCheck = conditions
    // User only wishes to check certain conditions
    ? [
      ...new Set(conditions.filter((condition) => {
        return possibleConditions.includes(condition);
      }))
    ]
    : possibleConditions;

  /**
  * @typedef {GenericArray} BadgeSection
  * @property {string} 0 string
  * @property {string} 1 color
  * @property {string} 2 [strokeColor]
  * @see https://github.com/yahoo/badge-up
  */

  /**
   * @param {"failing"|"medium"|"passing"} status
   * @param {"statements"|"branches"|"lines"|"functions"} condition
   * @returns {BadgeSection[]}
   */
  function getConditionBlocks (status, condition) {
    let color = status === 'failing'
      ? failColor
      : status === 'medium'
        ? mediumColor
        : passColor;

    const {
      pct: conditionPct,
      skipped: conditionSkipped,
      covered: conditionCovered,
      total: conditionTotal
    } = coverageSummary.total[condition];
    const currentInfoObj = {
      status,
      condition: condition.charAt().toUpperCase() + condition.slice(1),
      conditionPct,
      conditionSkipped,
      conditionCovered,
      conditionTotal
    };
    const text = es6Templates(
      textTemplate, {
        ...currentInfoObj,
        ...(
          // If user specified conditions, only allow these in template;
          //   otherwise, allow all
          conditions || possibleConditions
        ).reduce((o, cond) => {
          const {
            pct, skipped, covered, total
          } = coverageSummary.total[cond];
          o[cond + 'Pct'] = pct;
          o[cond + 'Skipped'] = skipped;
          o[cond + 'Covered'] = covered;
          o[cond + 'Total'] = total;
          o[cond + 'Threshold'] =
            possibleConditionThresholds['low_' + cond];
          o[cond + 'MediumThreshold'] =
            possibleConditionThresholds['medium_' + cond];
          return o;
        }, {})
      }
    );
    if (typeof color === 'string') {
      color = color.split(',');
    }

    return [
      [text, ...color]
    ];
  }
  let conditionBlocks;
  if (aggregateConditions) {
    let status = 'failing';
    let condition = conditionsToCheck.find(
      (cond) => getThresholdStatus(cond) === 'failing'
    );
    if (!condition) {
      condition = conditionsToCheck.find(
        (cond) => getThresholdStatus(cond) === 'medium'
      );
      if (condition) {
        status = 'medium';
      } else {
        status = 'passing';
        condition = conditionsToCheck[0];
      }
    }
    conditionBlocks = getConditionBlocks(
      status, condition
    );
  } else {
    conditionBlocks = conditionsToCheck.flatMap((condition) => {
      return getConditionBlocks(getThresholdStatus(condition), condition);
    });
  }

  const sections = [
    ...(introTemplate
      ? [[
        introTemplate,
        ...(typeof introColor === 'string'
          ? introColor.split(',')
          : introColor)
      ]]
      : []
    ),
    ...conditionBlocks
  ];
  log('sections', sections);

  const badge = await badgeUp(sections);

  // eslint-disable-next-line prefer-named-capture-group
  const outputBase = output.replace(/\.(png|svg)$/u, '');

  const svgFilePath = `${outputBase}.svg`;

  writeFileSync(pathResolve(process.cwd(), svgFilePath), badge + '\n');

  log('Finished writing temporary SVG file...');

  if (format === 'png') {
    // Make non-global as optional
    // eslint-disable-next-line global-require, node/no-unpublished-require
    const {convertFile} = require('convert-svg-to-png');
    const outputFile = await convertFile(
      pathResolve(process.cwd(), svgFilePath)
    );
    log('Wrote file', outputFile);
    unlinkSync(pathResolve(process.cwd(), svgFilePath));
    log('Cleaned up temporary SVG file');
  }

  log('Done!');
}

module.exports = coveradge;
