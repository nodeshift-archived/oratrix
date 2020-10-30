import { existsSync } from "fs"
import { readFileSync } from "fs"
import { writeFileSync } from "fs"
import { PackageFormat } from "../config/PackageFormat"
import { getPathToPackages } from "../util/fileHelpers"

const prompts = require('prompts');


export const command = 'add <package>'

export const desc = 'Add new package to `.packages.json` file'

export const builder = (args: any) => {
  args.positional('package', {
    describe: 'Package name',
    type: 'string'
  });
};


export async function handler(params: any) {
  const name = params.package;
  const pathToFile = getPathToPackages();
  if (!existsSync(pathToFile)) {
    console.log("Current location is missing packages file")
    return;
  }

  if (!name) {
    console.log("Name should be provided provided")
    return;
  }

  const file = readFileSync(pathToFile, "utf8")
  const packageContent: PackageFormat = JSON.parse(file);

  const response = await prompts([{
    type: 'text',
    name: 'category',
    message: 'Category for your package?'
  }]);

  if (packageContent.packages) {
    packageContent.packages[name] = {
      ...response
    }
    writeFileSync(pathToFile, JSON.stringify(packageContent, null, 2));
    console.log(`Successfully initialized packages file`)
  }
}

