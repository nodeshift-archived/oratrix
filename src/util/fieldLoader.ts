/**
 * Loads the mandatory fields to be checked.
 */
import { promises as fs } from 'fs';
import path from 'path';

type CustomPath = string | undefined | null;

class FieldLoader {
  async loadFields(customPath: CustomPath): Promise<Record<string, unknown>> {
    const location = customPath
      ? path.join(process.cwd(), customPath)
      : path.join(__dirname, 'fields.json');

    const fieldsRaw = await fs.readFile(location, { encoding: 'utf-8' });
    const fields = JSON.parse(fieldsRaw);
    return fields;
  }
}

export default FieldLoader;
