
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateData } from '@/utils/database';
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const updateSchema = z.object({
  tableName: z.string().min(1, 'Table is required'),
  attribute: z.string().trim().min(1, 'Attribute is required').max(100),
  currentValue: z.string().trim().min(1, 'Current value is required').max(500),
  newValue: z.string().trim().min(1, 'New value is required').max(500)
});

export const UpdateTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [attribute, setAttribute] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableTables = ['appointments', 'doctor_patient_messages', 'health_records', 'medications'];

  const handleUpdate = async () => {
    const validation = updateSchema.safeParse({
      tableName: selectedTable,
      attribute,
      currentValue,
      newValue
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
      const updates: Record<string, any> = { [attribute]: newValue };
      await updateData(selectedTable, attribute, currentValue, updates);

      toast({
        title: "Update Successful",
        description: "Data updated successfully",
      });
      setAttribute('');
      setCurrentValue('');
      setNewValue('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Edit className="h-6 w-6 text-yellow-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Update Data</h2>
          <p className="text-gray-600">Modify existing records in the healthcare database</p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Available Tables:</strong> {availableTables.join(', ')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="update-table">Enter a table to update data</Label>
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
          <Label htmlFor="attribute">Enter the name of the attribute</Label>
          <Input
            id="attribute"
            placeholder="e.g., name, email, status"
            value={attribute}
            onChange={(e) => setAttribute(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-value">What is the current value?</Label>
          <Input
            id="current-value"
            placeholder="Enter current value to find the record"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-value">Enter the new value</Label>
          <Input
            id="new-value"
            placeholder="Enter the new value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handleUpdate}
        disabled={isLoading}
        className="bg-yellow-600 hover:bg-yellow-700"
      >
        {isLoading ? "Updating..." : "Update Data"}
      </Button>
    </div>
  );
};
