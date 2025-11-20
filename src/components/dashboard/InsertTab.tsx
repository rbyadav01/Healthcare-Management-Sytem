
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertData } from '@/utils/database';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const insertSchema = z.object({
  tableName: z.string().min(1, 'Table is required'),
  attributes: z.string().trim().min(1, 'Attributes are required').max(500),
  values: z.string().trim().min(1, 'Values are required').max(2000)
});

export const InsertTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [attributes, setAttributes] = useState('');
  const [values, setValues] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableTables = ['appointments', 'doctor_patient_messages', 'health_records', 'medications'];

  const handleInsert = async () => {
    const validation = insertSchema.safeParse({
      tableName: selectedTable,
      attributes,
      values
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const attributeArray = attributes.split(',').map(attr => attr.trim());
      const valueArray = values.split(',').map(val => val.trim());

      if (attributeArray.length !== valueArray.length) {
        toast({
          title: "Mismatch Error",
          description: "Number of attributes must match number of values",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Convert arrays to object
      const data: Record<string, any> = {};
      attributeArray.forEach((attr, index) => {
        data[attr] = valueArray[index];
      });

      await insertData(selectedTable, data);

      toast({
        title: "Insert Successful",
        description: "Data inserted successfully",
      });
      setAttributes('');
      setValues('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to insert data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Plus className="h-6 w-6 text-green-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Insert Data</h2>
          <p className="text-gray-600">Add new records to the healthcare database</p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Available Tables:</strong> {availableTables.join(', ')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="insert-table">Enter a table to insert data</Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger>
              <SelectValue placeholder="Choose table..." />
            </SelectTrigger>
            <SelectContent>
              {availableTables.map((table) => (
                <SelectItem key={table} value={table}>{table}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attributes">Enter the name attribute/s separated by comma?</Label>
          <Input
            id="attributes"
            placeholder="e.g., name, email, phone"
            value={attributes}
            onChange={(e) => setAttributes(e.target.value)}
          />
          <p className="text-xs text-gray-500">Separate multiple attributes with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="values">Enter the values separated by comma</Label>
          <Input
            id="values"
            placeholder="e.g., John Doe, john@email.com, 123-456-7890"
            value={values}
            onChange={(e) => setValues(e.target.value)}
          />
          <p className="text-xs text-gray-500">Separate multiple values with commas</p>
        </div>
      </div>

      <Button 
        onClick={handleInsert}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading ? "Inserting..." : "Insert Data"}
      </Button>
    </div>
  );
};
