
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ImagePicker from '@/components/camera/ImagePicker';

interface CreatePostFormProps {
  onSubmit: (content: string, imageUrl?: string) => void;
  isSubmitting: boolean;
  isOffline?: boolean;
}

const CreatePostForm = ({ 
  onSubmit, 
  isSubmitting,
  isOffline = false
}: CreatePostFormProps) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit(content, selectedImage);
    // Don't clear the form in case the submission fails
  };

  const handleImageCaptured = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleImageRemoved = () => {
    setSelectedImage(undefined);
  };

  const isValid = content.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What's happening at your school?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-gray-200 focus-visible:ring-[#2DD4BF]"
        disabled={isSubmitting}
      />
      
      <ImagePicker
        onImageCaptured={handleImageCaptured}
        onImageRemoved={handleImageRemoved}
        selectedImage={selectedImage}
        disabled={isSubmitting}
      />
      
      {isOffline && (
        <div className="bg-amber-50 text-amber-800 p-2 rounded-md text-sm">
          You're offline. Your post will be saved and uploaded when you're back online.
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="bg-[#2DD4BF] hover:bg-[#26B8A5] text-white disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : isOffline ? "Save for later" : "Post"}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
