
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingCreateButtonProps {
  onClick: () => void;
}

const FloatingCreateButton = ({ onClick }: FloatingCreateButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-4 md:right-6 rounded-full shadow-lg w-14 h-14 p-0 z-10 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
      aria-label="Create new post"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingCreateButton;
