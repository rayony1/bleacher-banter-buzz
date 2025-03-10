import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { uploadImage } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { X, Upload, ImageIcon, WifiOff } from 'lucide-react';

interface CreatePostFormProps {
  onSubmit: (content: string, imageUrl?: string) => Promise<void>;
  isSubmitting: boolean;
  isOffline?: boolean;
}

const CreatePostForm = ({ onSubmit, isSubmitting, isOffline = false }: CreatePostFormProps) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 6 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 6MB",
        variant: "destructive"
      });
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image",
        variant: "destructive"
      });
      return;
    }
    
    setImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Not authorized",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      let imageUrl: string | undefined;
      
      if (image) {
        imageUrl = await uploadImage(image);
      }
      
      await onSubmit(content, imageUrl);
      
      setContent('');
      setImage(null);
      setImagePreview(null);
      
      toast({
        title: "Post created!",
        description: "Your post has been published"
      });
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isOffline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-sm mb-4 flex items-center">
          <WifiOff className="h-4 w-4 mr-2" />
          <span>You're offline. Your post will be published when you're back online.</span>
        </div>
      )}
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="min-h-[120px] resize-none border-gray-200 dark:border-gray-800 focus:border-[#2DD4BF] rounded-xl"
        disabled={isSubmitting || isUploading}
      />
      
      {imagePreview && (
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img src={imagePreview} alt="Preview" className="max-h-[300px] w-auto mx-auto object-contain" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 rounded-full h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="image-upload"
            className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ImageIcon className="h-5 w-5 text-[#2DD4BF]" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Add image</span>
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
            disabled={isSubmitting || isUploading}
          />
        </div>
        
        <Button
          type="submit"
          className="rounded-full px-4 py-2 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
          disabled={!content.trim() || isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? (
            <>Posting...</>
          ) : (
            <>Post</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
