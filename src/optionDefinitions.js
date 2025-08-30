import {readFile} from 'fs/promises';

import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(await readFile(join(__dirname, '../package.json')));

const getChalkTemplateSingleEscape = (s) => {
  return s.replaceAll(/[\{\}\\]/gv, (ch) => {
    return `\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getChalkTemplateEscape = (s) => {
  return s.replaceAll(/[\{\}\\]/gv, (ch) => {
    return `\\\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getBracketedChalkTemplateEscape = (s) => {
  return '{' + getChalkTemplateEscape(s) + '}';
};

/* eslint-disable jsdoc/require-property -- Ok */
// Todo: We really need a comamnd-line-args-TO-typedef-jsdoc generator!
/**
* @typedef {object} CoveradgeOptions
*/
/* eslint-enable jsdoc/require-property -- Ok */

const optionDefinitions = [
  {
    name: 'output', alias: 'o', type: String, defaultOption: true,
    description: 'Output file (extension not needed); defaults to ' +
      '"coverage-badge"',
    typeLabel: '{underline file}'
  },
  {
    name: 'coveragePath', type: String,
    description: 'Path of coverage JSON file relative to the current ' +
      'working directory; defaults to "./coverage/coverage-summary.json"',
    typeLabel: '{underline coveragePath}'
  },
  {
    name: 'format', alias: 'f', type: String,
    description: 'The output format (defaults to "svg"); to use "png", you ' +
      'must add to your dependencies, `convert-svg-to-png` and ' +
      '`puppeteer`.',
    typeLabel: '{underline "svg"|"png"}'
  },
  {
    name: 'passColor', type: String,
    description: 'The badge background color for success; follow by comma ' +
      'for additional (e.g., to add a stroke color); ' +
      getChalkTemplateSingleEscape('defaults to "green,s{black}"'),
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'failColor', type: String,
    description: 'The badge background color for failure; follow by comma ' +
      'for additional (e.g., to add a stroke color); ' +
      getChalkTemplateSingleEscape('defaults to "orange,s{black}"'),
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'mediumColor', type: String,
    description: 'The badge background color when falling within a ' +
      'watermark range; follow by comma for additional (e.g., to add ' +
      'a stroke color) ' +
      getChalkTemplateSingleEscape('defaults to "CCCC00,s{black}" (a ' +
      'dark yellow background)'),
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'introTemplate', type: String,
    description: 'Used to create an intro section separate from the result ' +
      'portion(s) of the badge. If set to the empty string, will have no ' +
      'intro. Defaults to "".',
    typeLabel: '{underline introTemplate}'
  },
  {
    name: 'introColor', type: String,
    description: 'The badge background color for failure; follow by comma ' +
      'for additional (e.g., to add a stroke color)' +
      'defaults to "navy"',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'textTemplate', type: String,
    description: 'Template for text of coverage badge; passed ' +
      'each condition with `Pct`, `Skipped`, `Covered`, `Total`, ' +
      ' `Threshold`, and `MediumThreshold` as suffix (e.g., ' +
      '`statementsPct` and `statementsThreshold`) to indicate percentage, ' +
      'number skipped, number covered, and total covered, as well as ' +
      '`condition`, `conditionPct`, etc. (the first failing ' +
      'of `conditions` if `aggregateConditions` is set and the currently ' +
      'iterated condition otherwise). Defaults to: ' +
      getChalkTemplateSingleEscape(
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line no-template-curly-in-string -- Our own templates
        '"${condition} ${conditionPct}%".'
      ),
    typeLabel: '{underline textTemplate}'
  },
  {
    name: 'aggregateConditions', type: Boolean,
    description: 'Whether to have only one run of `textTemplate` (with ' +
    '`condition`/`conditionPct`/etc. and the color being based ' +
    'on aggregate results--i.e., based on whether *any* of `conditions` fail).'
  },
  {
    name: 'conditions', type: String,
    description: 'The conditions to check against thresholds (to determine ' +
      'whether to use the ok or failing color). May use commma-delimited ' +
      'list of "statements", "branches", "lines", and/or "functions". Note ' +
      'that the order is significant as it will determine the badge sequence ' +
      'when `aggregateConditions` is not set, and as the first type to fail ' +
      'will be used for `condition*`, `conditionPct`, etc. in ' +
      'the `textTemplate`. The default is the list of all conditions in the ' +
      'order just listed.',
    typeLabel: '{underline comma-separated list of values}'
  },

  {
    name: 'statementsThreshold', type: String,
    description: 'The minimum statements threshold precent which is safe ' +
      'from being considered a failure. May also be followed by a hyphen ' +
      'and another number to indicate the medium range (used by ' +
      '`mediumColor`). Defaults to the nyc config for ' +
      '`watermarks.statements`, or, if not present, to nyc config for ' +
      '`statements`, or failing that, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'branchesThreshold', type: String,
    description: 'The minimum branches threshold precent which is safe ' +
      'from being considered a failure. May also be followed by a hyphen ' +
      'and another number to indicate the medium range (used by ' +
      '`mediumColor`). Defaults to the nyc config for ' +
      '`watermarks.branches`, or, if not present, to nyc config for ' +
      '`branches`, or failing that, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'linesThreshold', type: String,
    description: 'The minimum lines threshold precent which is safe ' +
      'from being considered a failure. May also be followed by a hyphen ' +
      'and another number to indicate the medium range (used by ' +
      '`mediumColor`). Defaults to the nyc config for ' +
      '`watermarks.lines`, or, if not present, to nyc config for ' +
      '`lines`, or failing that, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'functionsThreshold', type: String,
    description: 'The minimum functions threshold precent which is safe ' +
      'from being considered a failure. May also be followed by a hyphen ' +
      'and another number to indicate the medium range (used by ' +
      '`mediumColor`). Defaults to the nyc config for ' +
      '`watermarks.functions`, or, if not present, to nyc config for ' +
      '`functions`, or failing that, to 100.',
    typeLabel: '{underline threshold-number}'
  },
  {
    name: 'logging', type: String,
    description: 'Logging level; default is "off".',
    typeLabel: '{underline "verbose"|"off"}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic coveradge [--passColor=aColor] [--failColor=aColor] ' +
        '[--mediumColor=aColor] [--format="svg"|"png"] output}'
  },
  {
    optionList: optionDefinitions
  }
];

export {optionDefinitions as definitions, cliSections as sections};
