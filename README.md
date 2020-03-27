[![npm](https://img.shields.io/npm/v/coveradge.svg)](https://www.npmjs.com/package/coveradge)
[![Dependencies](https://img.shields.io/david/brettz9/coveradge.svg)](https://david-dm.org/brettz9/coveradge)
[![devDependencies](https://img.shields.io/david/dev/brettz9/coveradge.svg)](https://david-dm.org/brettz9/coveradge?type=dev)

[![testing badge](https://raw.githubusercontent.com/brettz9/coveradge/master/badges/tests-badge.svg?sanitize=true)](badges/tests-badge.svg)
[![coverage badge](https://raw.githubusercontent.com/brettz9/coveradge/master/badges/coverage-badge.svg?sanitize=true)](badges/coverage-badge.svg)

[![Known Vulnerabilities](https://snyk.io/test/github/brettz9/coveradge/badge.svg)](https://snyk.io/test/github/brettz9/coveradge)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/coveradge.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/coveradge/alerts)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/coveradge.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/coveradge/context:javascript)

<!--[![License](https://img.shields.io/npm/l/coveradge.svg)](LICENSE-MIT.txt)-->
[![Licenses badge](https://raw.githubusercontent.com/brettz9/coveradge/master/badges/licenses-badge.svg?sanitize=true)](badges/licenses-badge.svg)

(see also [licenses for dev. deps.](https://raw.githubusercontent.com/brettz9/coveradge/master/badges/licenses-badge-dev.svg?sanitize=true))

[![issuehunt-to-marktext](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/r/brettz9/coveradge)

# coveradge

## Installation

If you need png export, run:

```
npm i -D coveradge convert-svg-to-png
```

Otherwise, just this:

```
npm i -D coveradge
```

## Usage

1. Ensure you have at least the following `reporter` in your `package.json`:

```json
{
  "nyc": {
    "reporter": [
      "json-summary"
    ]
  }
}
```

You may optionally set [coverage thresholds](https://github.com/istanbuljs/nyc#coverage-thresholds) and/or [watermarks](https://github.com/istanbuljs/nyc#high-and-low-watermarks):

```json
{
  "nyc": {
    "reporter": [
      "json-summary"
    ],
    "branches": 80,
    "lines": 80,
    "functions": 80,
    "statements": 80,
    "watermarks": {
      "lines": [80, 95],
      "functions": [80, 95],
      "branches": [80, 95],
      "statements": [80, 95]
    }
  }
}
```

The watermarks, if present, will be given precedence over the regular thresholds for determining color (though not as high of a precedence as command-line thresholds).

2. Add `--reporter coveradge` at the beginning of the `nyc` call. Alternatively,
e.g., if you need to build a coveradge badge after testing has already finished
for a merged coverage file, add a call to `coveradge` in your `package.json`
`scripts` at some point after running `nyc`.

3. Add any desired options. If using as an nyc `--reporter`, then add the options to `package.json` instead of a `coveradgeOptions` property. Otherwise, pass as CLI
or programmatic options. (See below for the choices.)

4. Add the badge to your README (e.g., `[![coverage badge](coverage-badge.svg)](coverage-badge.svg)`) or for a link that will also work on npmjs.com: `[![coverage badge](https://raw.githubusercontent.com/brettz9/coveradge/master/coverage-badge.svg?sanitize=true)](coverage-badge.svg)`

That's it!

## Options

[![CLI instructions](cli.svg)](cli.svg)

## See also

- Locally generated Mocha test result badges
  - [mocha-badge-generator](https://github.com/ianpogi5/mocha-badge-generator) (MIT)
  - [mocha-reporter-badge](https://github.com/albanm/mocha-reporter-badge) (MIT)
- Generate badges of license types (e.g., by permissiveness)
  - [license-badger](https://github.com/brettz9/license-badger) (MIT)

## To-dos

1. Add tests and coverage (including badge commented out above) to this repo
