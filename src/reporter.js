'use strict';

const {join} = require('path');
const {ReportBase} = require('istanbul-lib-report');

const coveradge = require('./coveradge.js');

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
    // eslint-disable-next-line node/global-require, import/no-dynamic-require
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

module.exports = LintBadgeReport;
