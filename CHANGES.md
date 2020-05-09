# CHANGES for coveradge

## 0.6.0

- Refactoring: Remove unneeded code
- Linting: As per latest ash-nazg; apply sauron-node rather than sauron
- npm: Change to stable badge-up version
- npm: Change to maintained `cypress-multi-reporters`
- npm: Add `prepare` script
- npm: Ignore mocha files
- npm: Update devDeps

## 0.5.0

- Breaking change: Minimum of Node 10
- Breaking change: Switch to `badge-up` so we can use different colors
  together; drop `template` argument as a result.
- Breaking change: Change `color` to `passColor` and add `failColor`
- Breaking change: Remove `pct` param within `textTemplate` in favor of
    new options (i.e., `conditionPct` as well as each condition
    with `Pct` as suffix, e.g., `statementsPct` and `statementsThreshold`).
- Enhancement: Change color if meeting user-chosen nyc thresholds (e.g.,
    100%), passing on the calculated `condition` (the first
    condition within the optional `conditions` to fail or not pass medium,
    or if all are passing, then the first), and the new optional
    `*Threshold` params, to `textTemplate`
- Enhancement: Allow [watermarks](https://github.com/istanbuljs/nyc#high-and-low-watermarks)
    from nyc or within threshold CLI options
- Enhancement: Allow use as a regular nyc custom reporter (`--reporter coveradge`)
- Enhancement: Allow reporting (with colors) for each condition or by aggregate
- Enhancement: Allow intro section
- Enhancement: Allow programmatic API to access `coverageSummary` JSON
- Linting: As per latest ash-nazg
- Docs: Add badges (license, testing, npm, lgtm)
- Docs: Add coveradge badge for coveradge itself
- Maintenance: 4 sp. for MD files
- Testing: Begin Mocha + nyc tests
- npm: Update devDeps.

## 0.4.0

- npm: Update `command-line-basics` dep. and devDeps.

## 0.3.0

- Docs: Clarify installation
- npm: Rename script to build-cli-svg
- npm: Update dep. command-line-basics
- npm: Update devDeps

## 0.2.0

- Linting (ESLint): Latest as per ash-nazg
- npm: Remove large `convert-svg-to-png` as a dep.; can still be used
  but must now be added by user
- npm: Remove `.nyc_output` in npm
- npm: Bump devDeps

## 0.1.0

- Initial commit
