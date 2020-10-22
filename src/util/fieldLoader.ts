/**
 * Loads the mandatory fields to be checked.
 */
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';

// To avoid throwing errors with 404.
axios.defaults.validateStatus = () => true;

/**
 * Loads the package.json required fields as a JS object (default ../config/fields.json)
 * @param customPath the path of the custom specified required fields (optional)
 * @returns the required fields as a JS object
 */
async function loadFields(
  customPath?: string
): Promise<Record<string, unknown>> {
  const location = customPath
    ? path.join(process.cwd(), customPath)
    : path.join(__dirname, '..', 'config', 'fields.json');

  const fieldsRaw = await fs.readFile(location, { encoding: 'utf-8' });
  const fields = JSON.parse(fieldsRaw);
  return fields;
}

/**
 * Loads the package.json fields from a URL
 * @param url the url that the package.json exists
 * @returns the package.json fields as a JS object
 */
async function loadFieldsFromURL(
  url: string
): Promise<Record<string, unknown>> {
  const { status, data } = await axios.get(url);
  if (status !== 200) {
    throw Error('Package.json could not be fetched from URL');
  }
  return data;
}

export default {
  loadFields,
  loadFieldsFromURL,
};
