import { execSync } from "child_process"
import { readFileSync } from "fs"
import { existsSync } from "fs"
import { writeFileSync } from "fs"
import { resolve } from "path"
import { PackageFormat } from "../config/PackageFormat"
import { getPathToPackages } from "../util/fileHelpers"



export const command = 'verify'

export const desc = 'Verifies'

export const builder = {}

export async function handler() {
  const pathToFile = getPathToPackages();
  if (!existsSync(pathToFile)) {
    console.log("Current location is missing packages file")
    return;
  }

  const file = readFileSync(pathToFile, "utf8")
  const packageContent: PackageFormat = JSON.parse(file);
  for (const packageName in packageContent.packages) {
    const result = execSync(`npm show ${packageName}`, { encoding: "utf8" });
    const match = result.match("DEPRECATED");
    if (match && match.length > 0) {
      console.log(`Package ${packageName} is deprecated`)
    }
  }
  console.log("Successfully verified packages file")
}
