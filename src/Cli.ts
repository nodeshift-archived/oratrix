#!/usr/bin/env node

import yargs from 'yargs';

import Option from './Option';

// Initialize the options.
const options = {
  fields: Option.fields(),
  organization: Option.organization()
};

yargs
  .commandDir('commands')
  .demandCommand(1)
  .options(options).argv;
