
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
      className={`fixed ${isMobile ? 'bottom-20' : 'bottom-6'} right-6 rounded-full shadow-lg w-12 h-12 p-0 btn-hover z-10`}
      aria-label="Create new post"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default CreatePostButton;
