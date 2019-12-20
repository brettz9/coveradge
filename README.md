<!--
[![coverage badge](coverage-badge.svg)](coverage-badge.svg)
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

That's it!

## Options

[![CLI instructions](cli.svg)](cli.svg)

## To-dos

1. Add tests and coverage (including badge commented out above) to this repo
