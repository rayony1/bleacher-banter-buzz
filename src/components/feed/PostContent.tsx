
import React from 'react';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  // Process content to highlight hashtags
  const renderContent = (content: string) => {
    const parts = content.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-[#2DD4BF] hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="mt-2 mb-3 text-base leading-relaxed text-gray-900 dark:text-gray-100">
      <p className="whitespace-pre-line">{renderContent(content)}</p>
    </div>
  );
};

export default PostContent;
