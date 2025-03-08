
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type LocationFilter = 'school' | 'district' | 'state';

interface LocationFilterProps {
  activeFilter: LocationFilter;
  onFilterChange: (filter: LocationFilter) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="w-full mb-4">
      <Select value={activeFilter} onValueChange={(value) => onFilterChange(value as LocationFilter)}>
        <SelectTrigger className="w-full max-w-xs bg-white border-gray-200 dark:border-gray-800 h-10">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="school">My School</SelectItem>
          <SelectItem value="district">My District</SelectItem>
          <SelectItem value="state">My State</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilter;
