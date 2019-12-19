#!/usr/bin/env node
'use strict';

const {cliBasics} = require('command-line-basics');
const mainScript = require('../src/index.js');

const optionDefinitions = cliBasics(
  './src/optionDefinitions.js'
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

// Use `optionDefinitions`
mainScript(optionDefinitions);
