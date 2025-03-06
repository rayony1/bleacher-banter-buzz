
import React, { useState } from 'react';
import { X, Image, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: string, isAnonymous: boolean, images: string[]) => void;
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost }: CreatePostModalProps) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Handle file upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > 3) {
      toast({
        title: 'Maximum images reached',
        description: 'You can only upload up to 3 images per post.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real application, we'd upload to Supabase Storage
      // For now, we'll use a mock approach with unsplash URLs
      const newImages = Array.from(files).map((_, index) => 
        `https://source.unsplash.com/random/600x400?sports=${Date.now()}-${index}`
      );
      
      setImages([...images, ...newImages]);
      
      toast({
        title: 'Images uploaded',
        description: `Successfully uploaded ${files.length} image${files.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (content.trim() === '') {
      toast({
        title: 'Empty post',
        description: 'Please write something before posting.',
        variant: 'destructive',
      });
      return;
    }
    
    onCreatePost(content, isAnonymous, images);
    setContent('');
    setIsAnonymous(false);
    setImages([]);
    onClose();
  };
  
  const resetForm = () => {
    setContent('');
    setIsAnonymous(false);
    setImages([]);
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] focus-visible:ring-primary"
          />
          
          {/* Anonymous toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous-mode"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous-mode" className="cursor-pointer flex items-center">
                <span>Post anonymously</span>
                {isAnonymous && (
                  <span className="bg-amber-100 text-amber-700 text-xs py-0.5 px-2 rounded ml-2">
                    Requires peer approval
                  </span>
                )}
              </Label>
            </div>
          </div>
          
          {/* Image preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-md overflow-hidden h-20">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={isUploading || images.length >= 3}
              asChild
            >
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading || images.length >= 3}
                />
                <Image className="h-4 w-4" />
              </label>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{isAnonymous ? 'Anonymous' : 'As Yourself'}</span>
            </Button>
          </div>
          
          <Button onClick={handleSubmit} className="btn-hover" disabled={content.trim() === '' || isUploading}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
