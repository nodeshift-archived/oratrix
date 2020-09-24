#!/usr/bin/env node

import yargs from 'yargs';

yargs.commandDir('commands').demandCommand(1).options({
  cwd: {
    type: 'string',
    default: process.cwd(),
    required: false,
    description: 'The current working directory',
  },
}).argv;
 