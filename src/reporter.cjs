'use strict';

const {join} = require('path');
const {ReportBase} = require('istanbul-lib-report');

const coveradge = require('./coveradge.cjs');

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
    // This works for a short-term Promise, but as not awaited, it doesn't work
    //  if longer, e.g., if converting our source fully to ESM and dynamically
    //  importing here
    // eslint-disable-next-line max-len -- Long
    // eslint-disable-next-line n/global-require, import/no-dynamic-require -- User-decided
    const pkg = require(join(this.opts.projectRoot, 'package.json'));
    const coverageSummary = node.getCoverageSummary();

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
