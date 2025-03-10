
import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImagePickerProps {
  onImageCaptured: (imagePath: string) => void;
  onImageRemoved: () => void;
  selectedImage?: string;
  disabled?: boolean;
}

const ImagePicker = ({
  onImageCaptured,
  onImageRemoved,
  selectedImage,
  disabled = false
}: ImagePickerProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const takePicture = async () => {
    if (disabled) return;
    
    try {
      setIsProcessing(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Choose an option',
        promptLabelCancel: 'Cancel',
        promptLabelPhoto: 'From Photos',
        promptLabelPicture: 'Take Picture'
      });
      
      if (image && image.webPath) {
        onImageCaptured(image.webPath);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      
      // Only show error toast if it's not a user cancel
      if ((error as any)?.message !== 'User cancelled photos app') {
        toast({
          title: "Error",
          description: "Failed to capture image",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    if (disabled) return;
    onImageRemoved();
  };

  return (
    <div className="mt-4">
      {selectedImage ? (
        <div className="relative">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="w-full h-auto max-h-60 object-contain rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white"
            aria-label="Remove image"
            disabled={disabled}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full py-6 border-dashed flex items-center justify-center gap-2",
            isProcessing && "opacity-70 cursor-not-allowed"
          )}
          onClick={takePicture}
          disabled={isProcessing || disabled}
        >
          <Image className="h-5 w-5" />
          <span>{isProcessing ? "Processing..." : "Add Photo"}</span>
        </Button>
      )}
    </div>
  );
};

export default ImagePicker;
