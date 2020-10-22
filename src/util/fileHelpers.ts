import { join } from "path"

/**
 * Get location of the packages file
 */
export const getPathToPackages = () => {
    return join(process.cwd(), ".packages.json")
}