
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getSchools } from '@/lib/supabase';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from './RegisterFormTypes';
import { School } from '@/lib/database.types';

interface SchoolSelectorProps {
  form: UseFormReturn<RegisterFormValues>;
}

const SchoolSelector = ({ form }: SchoolSelectorProps) => {
  const [schools, setSchools] = useState<Array<{ school_id: string; school_name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        console.log('Fetching schools...');
        
        const { data, error } = await getSchools();
        
        if (error) {
          console.error('Error fetching schools:', error);
          toast({
            title: 'Error fetching schools',
            description: error.message,
            variant: 'destructive',
          });
        } else if (data && data.length > 0) {
          console.log('Schools fetched successfully:', data.length);
          setSchools(data);
        } else {
          // No schools found
          console.warn('No schools found in the database');
          setSchools([{
            school_id: 'default',
            school_name: 'Demo School'
          }]);
        }
      } catch (err) {
        console.error('Exception fetching schools:', err);
        toast({
          title: 'Error',
          description: 'Failed to load schools. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [toast]);

  return (
    <FormField
      control={form.control}
      name="schoolId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>School</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your school" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading schools...
                </SelectItem>
              ) : schools.length > 0 ? (
                schools.map((school) => (
                  <SelectItem 
                    key={school.school_id} 
                    value={school.school_id}
                  >
                    {school.school_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-schools" disabled>
                  No schools available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SchoolSelector;
