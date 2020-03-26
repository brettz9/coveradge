'use strict';

const pkg = require('../package.json');

/* eslint-disable jsdoc/require-property */
// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/**
* @typedef {PlainObject} CoveradgeOptions
*/
/* eslint-enable jsdoc/require-property */

const optionDefinitions = [
  {
    name: 'output', alias: 'o', type: String, defaultOption: true,
    description: 'Output file (extension not needed); defaults to ' +
      '"coverage-badge"',
    typeLabel: '{underline file}'
  },
  {
    name: 'format', alias: 'f', type: String,
    description: 'The output format (defaults to "svg"); to use "png", you ' +
      'must install, e.g., add to your dependencies, `convert-svg-to-png`.',
    typeLabel: '{underline "svg"|"png"}'
  },
  {
    name: 'passColor', type: String,
    description: 'The badge background color for success (gh-badges color: https://www.npmjs.com/package/gh-badges#colors); ' +
      'defaults to "green"',
    typeLabel: '{underline color}'
  },
  {
    name: 'failColor', type: String,
    description: 'The badge background color for failure (gh-badges color: https://www.npmjs.com/package/gh-badges#colors); ' +
      'defaults to "orange"',
    typeLabel: '{underline color}'
  },
  {
    name: 'conditions', type: String,
    description: 'The conditions to check against thresholds (to determine ' +
      'whether to use the ok or failing color). May use commma-delimited ' +
      'list of "statements", "branches", "lines", and/or "functions". Note ' +
      'that the order is significant, as the first type to fail will be ' +
      'used for `failingCondition` and `failingConditionPct` in the ' +
      '`textTemplate`. The default is the list of all conditions in the ' +
      'order just listed.',
    typeLabel: '{underline comma-separated list of values}'
  },

  {
    name: 'statementsThreshold', type: Number,
    description: 'The minimum statements threshold precent which is safe ' +
      'from being considered a failure. Defaults to the nyc config for ' +
      '`statements` or, if not present, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'branchesThreshold', type: Number,
    description: 'The minimum branches threshold precent which is safe ' +
      'from being considered a failure. Defaults to the nyc config for ' +
      '`branches` or, if not present, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'linesThreshold', type: Number,
    description: 'The minimum lines threshold precent which is safe ' +
      'from being considered a failure. Defaults to the nyc config for ' +
      '`lines` or, if not present, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'functionsThreshold', type: Number,
    description: 'The minimum functions threshold precent which is safe ' +
      'from being considered a failure. Defaults to the nyc config for ' +
      '`functions` or, if not present, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'textTemplate', type: String,
    description: 'Template for text of coverage badge; passed ' +
      '`failingCondition` and `failingConditionPct` (depending on ' +
      '`conditions`) as well as each condition with `Pct` and ' +
      '`Threshold` as suffix (e.g., `statementsPct` and ' +
      '`statementsThreshold`). Defaults to: ' +
      '"Coverage $\\{failingConditionPct\\}%".',
    typeLabel: '{underline textTemplate}'
  },
  {
    name: 'template', alias: 't', type: String,
    description: 'Template style (gh-badges templates: https://github.com/badges/shields/tree/master/gh-badges/templates); defaults to "flat"',
    typeLabel: '{underline ' +
      '"flat"|"flat-square"|"for-the-badge"|"plastic"|"social"' +
    '}'
  },
  {
    name: 'coveragePath', type: String,
    description: 'Path of coverage JSON file relative to the current ' +
      'working directory; defaults to "./coverage/coverage-summary.json"',
    typeLabel: '{underline coveragePath}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic coveradge [--color=aColor] [--format="svg"|"png"] output}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
