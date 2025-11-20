
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deleteData } from '@/utils/database';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const deleteSchema = z.object({
  tableName: z.string().min(1, 'Table is required'),
  attribute: z.string().trim().min(1, 'Attribute is required').max(100),
  value: z.string().trim().min(1, 'Value is required').max(500)
});

export const DeleteTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [attribute, setAttribute] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableTables = ['appointments', 'doctor_patient_messages', 'health_records', 'medications'];

  const handleDelete = async () => {
    const validation = deleteSchema.safeParse({
      tableName: selectedTable,
      attribute,
      value
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
      await deleteData(selectedTable, attribute, value);

      toast({
        title: "Delete Successful",
        description: "Data deleted successfully",
      });
      setAttribute('');
      setValue('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Trash2 className="h-6 w-6 text-red-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Delete Data</h2>
          <p className="text-gray-600">Remove records from the healthcare database</p>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm text-red-800 font-medium">Warning: Deletion is permanent</p>
            <p className="text-sm text-red-700 mt-1">
              <strong>Available Tables:</strong> {availableTables.join(', ')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="delete-table">Enter a table to delete data</Label>
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
          <Label htmlFor="delete-attribute">Enter the name attribute</Label>
          <Input
            id="delete-attribute"
            placeholder="e.g., id, name, email"
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delete-value">What is the current value of the attribute?</Label>
          <Input
            id="delete-value"
            placeholder="Enter the value to identify the record"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handleDelete}
        disabled={isLoading}
        variant="destructive"
        className="bg-red-600 hover:bg-red-700"
      >
        {isLoading ? "Deleting..." : "Delete Data"}
      </Button>
    </div>
  );
};
