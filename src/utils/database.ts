import { supabase } from '@/integrations/supabase/client';

/**
 * Modern database utilities using Supabase with proper RLS enforcement
 */

// Available tables that users can query
const AVAILABLE_TABLES = [
  'appointments',
  'doctor_patient_messages',
  'health_records',
  'medical_conditions',
  'medications',
  'test_results'
];

function isValidTable(tableName: string): boolean {
  return AVAILABLE_TABLES.includes(tableName);
}

/**
 * Search for records in a table
 */
export async function searchTable(
  tableName: string,
  attribute: string,
  value: string
): Promise<any[]> {
  if (!isValidTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .eq(attribute, value);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

/**
 * Insert data into a table
 */
export async function insertData(
  tableName: string,
  data: Record<string, any>
): Promise<boolean> {
  if (!isValidTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    const { error } = await supabase
      .from(tableName as any)
      .insert([data]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Insert error:', error);
    throw error;
  }
}

/**
 * Update data in a table
 */
export async function updateData(
  tableName: string,
  attribute: string,
  currentValue: string,
  updates: Record<string, any>
): Promise<boolean> {
  if (!isValidTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    const { error } = await supabase
      .from(tableName as any)
      .update(updates)
      .eq(attribute, currentValue);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}

/**
 * Delete data from a table
 */
export async function deleteData(
  tableName: string,
  attribute: string,
  value: string
): Promise<boolean> {
  if (!isValidTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    const { error } = await supabase
      .from(tableName as any)
      .delete()
      .eq(attribute, value);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}
