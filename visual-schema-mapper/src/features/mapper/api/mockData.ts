import { SchemaField } from '@/features/mapper/types';

export const SOURCE_FIELDS: SchemaField[] = [
  { id: 'p_id', label: 'Product ID', type: 'string', required: false },
  { id: 'cost_eur', label: 'Cost (EUR)', type: 'number', required: false },
  { id: 'is_active_flag', label: 'Is Active', type: 'boolean', required: false },
  { id: 'available_from', label: 'Available From', type: 'date', required: false },
  { id: 'desc_short', label: 'Short Description', type: 'string', required: false },
];

export const TARGET_FIELDS: SchemaField[] = [
  { id: 'ean', label: 'EAN', type: 'string', required: true },
  { id: 'price', label: 'Price', type: 'number', required: true },
  { id: 'active', label: 'Active', type: 'boolean', required: true },
  { id: 'release_date', label: 'Release Date', type: 'date', required: false },
];
