
import { supabase } from './client';

// School-related functions
export const addSchool = async (schoolName: string, district: string, state: string) => {
  return await supabase
    .from('schools')
    .insert({ school_name: schoolName, district, state })
    .select()
    .single();
};

export const getSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .order('school_name');
};

export const getSchoolsByDistrict = async (district: string) => {
  return await supabase
    .from('schools')
    .select('*')
    .eq('district', district)
    .order('school_name');
};

export const getTexasSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .eq('state', 'Texas')
    .order('school_name');
};

export const getSchoolBadges = async (schoolId: string) => {
  return await supabase
    .from('badges')
    .select('*')
    .eq('school_id', schoolId);
};

export const getFootballBadges = async () => {
  return await supabase
    .from('badges')
    .select('*')
    .eq('type', 'team');
};
