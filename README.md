# Oratrix
![Node.js CI](https://github.com/nodeshift/oratrix/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nodeshift/oratrix/badge.svg?branch=coverage)](https://coveralls.io/github/nodeshift/oratrix?branch=coverage)

## What is it

Oratrix is a CLI application for checking package.json consistency across repositories.

> More information about the project's name [here](https://commons.wikimedia.org/wiki/File:Amazona_oratrix_1zz.jpg)

## Install

To install globally: `npm install -g oratrix`

Use with npx: `npx oratrix validate`

or to use in an npm script

```json
$ npm install oratrix --save-dev

// inside package.json
scripts: {
  "oratrix": "oratrix validate" 
}

$ npm run oratrix
```

## Core concepts

### Commands

By default if you run `oratrix`, it will show you the help page.

**validate** - searches for mandatory package.json fields

**help** - shows the help page

### Advanced Options

Oratrix's `validate` command can also accept options that allow you to customize oratrix's behavior.

**config**

Custom json file with the required package.json fields.

**organization**

GitHub organization oratrix will validate

**token**

GitHub's oAuth token oratrix will use when contacting GitHub's API

**help** 

Shows the below help

```sh
$ oratrix validate

Searches for mandatory package.json fields

Options:
      --help          Show help                                        [boolean]
      --version       Show version number                              [boolean]
      --cwd           The current working directory
                [string] [default: "<YOUR-CURRENT-WORKING-DIRECTORY>"]

  -o, --organization  GitHub organization oratrix will validate

  -c, --config        Custom file with the required package.json fields
  
  -t, --token         GitHub oauth token
```
