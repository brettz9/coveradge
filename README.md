<!--
[![coverage badge](https://raw.githubusercontent.com/brettz9/coveradge/master/coverage-badge.svg?sanitize=true)](coverage-badge.svg)
-->

# coveradge

## Installation

```
npm i -P coveradge
```

## Usage

1. Ensure you have at least the following `reporter` in your `package.json`:

```json
"nyc": {
  "reporter": [
    "json-summary"
  ]
}
```

2. Add a call to `coveradge` in your `package.json` `scripts` at some point
    after running `nyc`.

3. Add the badge to your README (e.g., `[![coverage badge](coverage-badge.svg)](coverage-badge.svg)`) or for a link that will also work on npmjs.com: `[![coverage badge](https://raw.githubusercontent.com/brettz9/coveradge/master/coverage-badge.svg?sanitize=true)](coverage-badge.svg)`

That's it!

## Options

[![CLI instructions](cli.svg)](cli.svg)

## See also

- Locally generated Mocha test result badges
  - [mocha-reporter-badge](https://github.com/albanm/mocha-reporter-badge) (MIT)
  - [mocha-badge-generator](https://github.com/ianpogi5/mocha-badge-generator) (GPL)

## To-dos

1. Option to change color if meeting user-chosen nyc thresholds (e.g., 100%)
1. Add tests and coverage (including badge commented out above) to this repo
