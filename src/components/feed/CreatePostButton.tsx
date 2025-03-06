
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreatePostButtonProps {
  onClick: () => void;
}

const CreatePostButton = ({ onClick }: CreatePostButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 p-0 btn-hover z-10"
      aria-label="Create new post"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default CreatePostButton;
