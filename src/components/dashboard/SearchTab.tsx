
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { searchTable } from '@/utils/database';
import { Search, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const searchSchema = z.object({
  tableName: z.string().min(1, 'Table is required'),
  attribute: z.string().trim().min(1, 'Attribute is required').max(100),
  value: z.string().trim().min(1, 'Value is required').max(500)
});

export const SearchTab: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('');
  const [searchAttribute, setSearchAttribute] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableTables = ['appointments', 'doctor_patient_messages', 'health_records', 'medications'];

  const handleSearch = async () => {
    const validation = searchSchema.safeParse({
      tableName: selectedTable,
      attribute: searchAttribute,
      value: searchValue
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
      const data = await searchTable(selectedTable, searchAttribute, searchValue);
      setResults(data);
      
      if (data.length === 0) {
        toast({
          title: "No Results",
          description: "No records found matching your search criteria",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${data.length} record(s)`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Search Error",
        description: error.message || "Failed to search data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (results.length === 0) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Results from: {selectedTable}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(result).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="text-sm font-medium text-gray-600">{key}</div>
                      <div className="text-sm text-gray-900">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Search className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Search Records</h2>
          <p className="text-gray-600">Search for specific records in the healthcare database</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Available Tables:</strong> {availableTables.join(', ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="table-select">Select a table to search</Label>
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
          <Label htmlFor="attribute">Search by (i.e name)?</Label>
          <Input
            id="attribute"
            placeholder="Enter attribute name"
            value={searchAttribute}
            onChange={(e) => setSearchAttribute(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Enter the value</Label>
          <Input
            id="value"
            placeholder="Enter search value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handleSearch}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Searching..." : "Search Records"}
      </Button>

      {renderResults()}
    </div>
  );
};
