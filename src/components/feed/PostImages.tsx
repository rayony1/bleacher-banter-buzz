
import React from 'react';

interface PostImagesProps {
  images: string[];
}

const PostImages = ({ images }: PostImagesProps) => {
  if (!images || images.length === 0) return null;
  
  return (
    <div className={`mb-4 ${
      images.length === 1 ? '' : 
      images.length === 2 ? 'grid grid-cols-2 gap-2' : 
      images.length >= 3 ? 'grid grid-cols-2 gap-2' : ''
    }`}>
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`rounded-xl overflow-hidden ${
            images.length === 1 ? 'w-full max-h-80' : 
            index === 0 && images.length >= 3 ? 'col-span-2' : ''
          }`}
        >
          <img 
            src={image} 
            alt={`Post image ${index + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default PostImages;
