#!/usr/bin/env node

import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

import {cliBasics} from 'command-line-basics';
import mainScript from '../src/coveradge.cjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, '../src/optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}
try {
  await mainScript(optionDefinitions);
} catch (err) {
  console.error(err);
}
