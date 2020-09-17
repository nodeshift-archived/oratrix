#!/usr/bin/env node

import yargs from 'yargs';
import * as option from './option';

// Initialize the options.
const options = {
  fields: option.fields(),
  organization: option.organization(),
};

yargs.commandDir('commands').demandCommand(1).options(options).argv;
