
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import CreatePostForm from './CreatePostForm';

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (content: string, imageUrl?: string) => void;
  isSubmitting: boolean;
  isOffline: boolean;
}

const PostDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting, 
  isOffline 
}: PostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <CreatePostForm 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting} 
          isOffline={isOffline}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
