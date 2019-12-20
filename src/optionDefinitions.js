'use strict';

const pkg = require('../package.json');

// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/**
* @typedef {PlainObject} CoveradgeOptions
*/

const optionDefinitions = [
  {
    name: 'output', alias: 'o', type: String, defaultOption: true,
    description: 'Output file (extension not needed); defaults to ' +
      '"coverage-badge"',
    typeLabel: '{underline file}'
  },
  {
    name: 'format', alias: 'f', type: String,
    description: 'The output format (defaults to "svg")',
    typeLabel: '{underline "svg"|"png"}'
  },
  {
    name: 'color', alias: 'c', type: String,
    description: 'The badge background color (gh-badges color: https://www.npmjs.com/package/gh-badges#colors); ' +
      'defaults to "orange"',
    typeLabel: '{underline color}'
  },
  {
    name: 'textTemplate', type: String,
    // eslint-disable-next-line no-template-curly-in-string
    description: '; defaults to: "Coverage ${pct}%"',
    typeLabel: '{underline textTemplate}'
  },
  {
    name: 'template', alias: 't', type: String,
    description: 'template style (gh-badges templates: https://github.com/badges/shields/tree/master/gh-badges/templates); defaults to "flat"',
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
      '\n\n{italic coveradge --color=green [--format=svg|png] output}'
  },
  {
    optionList: optionDefinitions
  }
];

exports.definitions = optionDefinitions;
exports.sections = cliSections;
