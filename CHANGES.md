# CHANGES for coveradge

## ?

- Breaking change: Minimum of Node 10
- Breaking change: Change `color` to `passColor` and add `failColor`
- Breaking change: Remove `pct` param within `textTemplate` in favor of
    new options (i.e., `failingConditionPct` as well as each condition
    with `Pct` as suffix, e.g., `statementsPct` and `statementsThreshold`).
- Enhancement: Change color if meeting user-chosen nyc thresholds (e.g.,
    100%), passing on the calculated `failingCondition` (the first
    condition within the optional `conditions` to fail), and the new
    optional `*Threshold` params, to `textTemplate`
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
