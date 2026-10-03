/**
 * Completeness Calculator
 *
 * Dynamically calculates the completeness percentage of a land parcel
 * by traversing all fields in the parcel object and counting
 * null, undefined, empty string, or missing fields.
 */

import { LandParcel } from '../types/landParcel';

interface FieldInfo {
  path: string;
  value: unknown;
}

function traverseObject(obj: unknown, path: string = '', fields: FieldInfo[] = []): FieldInfo[] {
  if (obj === null || obj === undefined) {
    fields.push({ path, value: null });
    return fields;
  }

  if (typeof obj !== 'object') {
    fields.push({ path, value: obj });
    return fields;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      fields.push({ path, value: [] });
    } else {
      obj.forEach((item, index) => {
        traverseObject(item, `${path}[${index}]`, fields);
      });
    }
    return fields;
  }

  // For objects, traverse each property
  for (const [key, value] of Object.entries(obj)) {
    const newPath = path ? `${path}.${key}` : key;
    traverseObject(value, newPath, fields);
  }

  return fields;
}

export interface CompletenessResult {
  totalFields: number;
  availableFields: number;
  missingFields: number;
  completenessPercentage: number;
  missingFieldNames: string[];
}

export function calculateCompleteness(parcel: unknown): CompletenessResult {
  const fields = traverseObject(parcel);

  let availableFields = 0;
  let missingFields = 0;
  const missingFieldNames: string[] = [];

  fields.forEach(field => {
    const isMissing =
      field.value === null ||
      field.value === undefined ||
      field.value === '' ||
      (Array.isArray(field.value) && field.value.length === 0);

    if (isMissing) {
      missingFields++;
      missingFieldNames.push(field.path);
    } else {
      availableFields++;
    }
  });

  const totalFields = fields.length;
  const completenessPercentage = totalFields > 0
    ? Math.round((availableFields / totalFields) * 100)
    : 0;

  return {
    totalFields,
    availableFields,
    missingFields,
    completenessPercentage,
    missingFieldNames
  };
}