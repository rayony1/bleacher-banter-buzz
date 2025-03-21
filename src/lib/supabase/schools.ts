
import { supabase } from './client';
import { schools as schoolsData } from '@/data/schools';

// Get all schools from the database
export const getSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .order('school_name');
};

// Get a specific school by ID
export const getSchoolById = async (schoolId: string) => {
  return await supabase
    .from('schools')
    .select('*')
    .eq('school_id', schoolId)
    .single();
};

// Insert sample schools into the database (for development setup)
export const insertSampleSchools = async () => {
  const { data: existingSchools } = await getSchools();
  
  // Only insert if no schools exist
  if (!existingSchools || existingSchools.length === 0) {
    console.log('No schools found in database, inserting sample data...');
    
    // Format schools for Supabase table structure
    const formattedSchools = schoolsData.map(school => ({
      school_id: school.id,
      school_name: school.name,
      district: school.district,
      state: school.state,
      mascot: school.mascot || '',
      primary_color: school.colors.primary,
      secondary_color: school.colors.secondary
    }));
    
    return await supabase
      .from('schools')
      .insert(formattedSchools);
  }
  
  return { data: null, error: null };
};

// Update a school
export const updateSchool = async (schoolId: string, updates: any) => {
  return await supabase
    .from('schools')
    .update(updates)
    .eq('school_id', schoolId);
};
