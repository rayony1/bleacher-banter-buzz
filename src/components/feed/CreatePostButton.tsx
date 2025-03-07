
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

interface CreatePostButtonProps {
  onClick?: () => void;
}

const CreatePostButton = ({ onClick }: CreatePostButtonProps) => {
  const { isMobile } = useMobile();
  
  return (
    <Button
      onClick={onClick}
      className={`fixed ${isMobile ? 'bottom-20' : 'bottom-6'} right-4 md:right-6 rounded-full shadow-lg w-14 h-14 p-0 z-10 bg-blue-500 hover:bg-blue-600 text-white`}
      aria-label="Create new post"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default CreatePostButton;
