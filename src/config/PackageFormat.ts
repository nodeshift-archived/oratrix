

/**
 * Metadata for packages
 */
export interface PackageFormat {
    version: number
    packages?: {
        [name: string]: {
            // To express categories
            category: string,
            // To express flavours
            labels?: string[],
            // To losely define what version was checked or recomended
            version?: string
            // To include some packages that we recommend that will work only with express.
            subpackages?: string[]
        }
    }
}

