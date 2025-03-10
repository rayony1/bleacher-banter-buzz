
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingCreateButtonProps {
  onClick: () => void;
}

const FloatingCreateButton = ({ onClick }: FloatingCreateButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-[#2DD4BF] shadow-lg flex items-center justify-center active:scale-95 transition-transform ios:hover:bg-[#2DD4BF]/90"
      aria-label="Create new post"
    >
      <Plus className="h-6 w-6 text-white" />
    </button>
  );
};

export default FloatingCreateButton;
