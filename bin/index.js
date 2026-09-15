#!/usr/bin/env node

import {join} from 'node:path';
import {cliBasics} from 'command-line-basics';
import mainScript from '../src/coveradge.cjs';

const optionDefinitions = await cliBasics(
  join(import.meta.dirname, '/../src/optionDefinitions.js'),
  {
    packageJsonPath: join(import.meta.dirname, '/../package.json')
  }
);

if (!optionDefinitions) { // cliBasics handled
  process.exit(0);
}
try {
  await mainScript(optionDefinitions);
} catch (err) {
  console.error(err);
}
