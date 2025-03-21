import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getSchools, insertSampleSchools } from '@/lib/supabase';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from './RegisterFormTypes';
import { schools as localSchools } from '@/data/schools';

type SchoolData = {
  school_id: string;
  school_name: string;
};

interface SchoolSelectorProps {
  form: UseFormReturn<RegisterFormValues>;
}

const SchoolSelector = ({ form }: SchoolSelectorProps) => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        console.log('Fetching schools...');
        
        // First try to get schools from Supabase
        const { data, error } = await getSchools();
        
        if (error) {
          console.error('Error fetching schools:', error);
          toast({
            title: 'Error fetching schools',
            description: error.message,
            variant: 'destructive',
          });
        } else if (data && data.length > 0) {
          // We have schools in the database
          console.log('Schools fetched successfully:', data.length);
          setSchools(data);
        } else {
          // No schools found, try to insert the sample schools
          console.warn('No schools found in the database, attempting to insert sample schools...');
          
          try {
            // Attempt to insert sample schools
            const { error: insertError } = await insertSampleSchools();
            
            if (insertError) {
              console.error('Error inserting sample schools:', insertError);
              // Fall back to local schools array
              setSchools(localSchools.map(school => ({
                school_id: school.id,
                school_name: school.name
              })));
            } else {
              // Try fetching again after insert
              const { data: refreshedData } = await getSchools();
              if (refreshedData && refreshedData.length > 0) {
                setSchools(refreshedData);
              } else {
                // Still no data, use local fallback
                setSchools(localSchools.map(school => ({
                  school_id: school.id,
                  school_name: school.name
                })));
              }
            }
          } catch (insertErr) {
            console.error('Exception inserting schools:', insertErr);
            // Fall back to local schools array
            setSchools(localSchools.map(school => ({
              school_id: school.id,
              school_name: school.name
            })));
          }
        }
      } catch (err) {
        console.error('Exception fetching schools:', err);
        toast({
          title: 'Error',
          description: 'Failed to load schools. Using local data instead.',
          variant: 'destructive',
        });
        // Fall back to local schools array
        setSchools(localSchools.map(school => ({
          school_id: school.id,
          school_name: school.name
        })));
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
