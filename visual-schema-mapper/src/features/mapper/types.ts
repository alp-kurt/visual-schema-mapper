export type FieldType = 'string' | 'number' | 'boolean' | 'date';

export interface SchemaField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
}

export interface Mapping {
  sourceId: string;
  targetId: string;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}
