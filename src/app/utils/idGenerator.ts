import { Model } from "mongoose";

/**
 * Generates a sequential ID for any model
 * @param model - The Mongoose model
 * @param idField - The field name to use for the ID (default: 'id')
 * @param prefix - Optional prefix for the ID
 * @param padLength - Length to pad the numeric part (default: 3)
 * @returns A promise that resolves to the generated ID
 */
const generateSequentialId = async <T>(
  model: Model<T>,
  idField: string = "id",
  prefix: string = "",
  padLength: number = 3
): Promise<string> => {
  // Create a sort object to sort by the specified ID field
  const sortObject: { [key: string]: 1 | -1 } = {};
  sortObject[idField] = -1; // Sort in descending order

  // Create a projection object to retrieve only the ID field
  const projectionObject: Record<string, number> = {};
  projectionObject[idField] = 1;

  // Find the last document with the highest ID
  const lastDocument = await model
    .findOne({}, projectionObject)
    .sort(sortObject)
    .lean();

  let newNumber = 1;

  // If a document exists, extract and increment its number
  if (lastDocument) {
    const lastId = lastDocument[idField as keyof typeof lastDocument] as string;

    if (lastId) {
      // If there's a prefix, remove it before parsing
      const numericPart = prefix ? lastId.replace(prefix, "") : lastId;

      const lastNumber = parseInt(numericPart);
      if (!isNaN(lastNumber)) {
        newNumber = lastNumber + 1;
      }
    }
  }

  // Format with leading zeros and optional prefix
  return `${prefix}${newNumber.toString().padStart(padLength, "0")}`;
};

export default generateSequentialId;
