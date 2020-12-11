import fs from 'fs';
import path from 'path';

export const command = 'init';

export const desc = 'Initializes `oratrix.config.js` file';

export const builder = {};

export const handler = (): void => {
  // get full path
  const configPath = path.resolve('.oratrixrc.json');
  const exists = fs.existsSync(configPath);
  // check if a oratrix config file already exists
  if (exists) {
    console.log('🚫 Config file already exists in your directory.');
    return;
  }
  // config contents as js-object
  const initConfig = {
    version: 1,
    required: [],
    allowed: {},
    packages: [],
  };

  fs.writeFileSync(configPath, JSON.stringify(initConfig, null, 2), {
    encoding: 'utf-8',
  });
  console.log('✨ Config file successfully initialized.');
};
