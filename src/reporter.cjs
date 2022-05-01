// This approach no longer works because from CJS, we can only get imports
//  asynchronously, and the istanbul-reports code isn't (async)
//  promise-friendly in its `onStart` triggering.

// This file currently not importable by istanbul
// import {readFile} from 'fs/promises';
// import {join} from 'path';
// import {ReportBase} from 'istanbul-lib-report';
// import coveradge from './coveradge.js';

'use strict';

const {readFile} = require('fs/promises');
const {join} = require('path');
const {ReportBase} = require('istanbul-lib-report');

/**
* @typedef {PlainObject} CoveradgeReporterOptions
* @property {todo} todo
*/

/**
 * @extends ReportBase
 */
class LintBadgeReport extends ReportBase {
  /**
   * @param {CoveradgeIstanbulReporterOptions} opts
   */
  constructor (opts) {
    super();

    this.opts = opts;
  }

  /**
   * @param {IstanbulNode} node
   * @param {IstanbulContext} context
   * @returns {Promise<void>}
   */
  async onStart (node, context) {
    const coverageSummary = node.getCoverageSummary();

    const coveradge = await import('./coveradge.js');

    const pkg = JSON.parse(
      await readFile(join(this.opts.projectRoot, 'package.json'))
    );

    await coveradge({
      ...pkg.coveradgeOptions,
      // Need to change here into same format as file
      coverageSummary: {total: coverageSummary.data},
      nycConfig: this.opts
    });
  }
}

// export default LintBadgeReport;
module.exports = LintBadgeReport;
