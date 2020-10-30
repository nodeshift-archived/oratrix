type ObjectJSON = Record<string, unknown>;
type Field = string | number | ObjectJSON;

function isEmpty(value: Field): boolean {
  return !value || value === '';
}

function run(requiredFields: ObjectJSON, packageFields: ObjectJSON): string[] {
  // transform object to array
  const requiredFieldsArray = Object.keys(requiredFields);
  // get missing fields
  const diff = requiredFieldsArray.filter((field) => {
    const exists = Object.hasOwnProperty.call(packageFields, field);
    const empty = isEmpty(packageFields[field] as Field);
    return !exists || empty;
  });
  // return result
  return diff;
}

export default {
  run,
};
