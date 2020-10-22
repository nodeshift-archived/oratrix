type ObjectJSON = Record<string, unknown>;
type Field = string | number | ObjectJSON;

const isEmpty = (value: Field): boolean => {
  if (value) {
    return value === '';
  }
  return true;
};

export const run = (
  requiredFields: ObjectJSON,
  packageFields: ObjectJSON
): string[] => {
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
};
