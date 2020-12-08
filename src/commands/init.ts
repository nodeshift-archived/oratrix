import fs from 'fs';
import path from 'path';
import { js as beautify } from 'js-beautify';

export const command = 'init';

export const desc = 'Initializes `oratrix.config.js` file';

export const builder = {};

export const handler = (): void => {
  // get full path
  const filepath = path.resolve('oratrix.config.js');
  const exists = fs.existsSync(filepath);
  // check if a oratrix config file already exists
  if (exists) {
    console.log('❗️ config file already exists in your directory.');
    return;
  }
  // config contents as string
  const contents =
    'module.exports = {\nversion: 1,\n// required: [],\n// allowed: {},\n// packages: []\n};';
  // format config before write it to file
  const config = beautify(contents, {
    indent_size: 2,
    space_in_empty_paren: true,
  });

  fs.writeFileSync(filepath, config, { encoding: 'utf-8' });
  console.log('✨ config file successfully initialized.');
};
