
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeedTabs from '@/components/feed/FeedTabs';
import PostCard from '@/components/feed/PostCard';
import CreatePostButton from '@/components/feed/CreatePostButton';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { Post, FeedType } from '@/lib/types';

const Feed = () => {
  const [activeTab, setActiveTab] = useState<FeedType>('school');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  
  // Mock posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: "Our basketball team is looking incredible in practice today! Can't wait for the game on Friday!",
      author: {
        id: '1',
        username: 'sarah_j',
        name: 'Sarah Johnson',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=1',
        school: 'Eastside High',
        badges: [
          { id: '1', name: 'Eastside Student', type: 'school' },
          { id: '2', name: 'Basketball', type: 'team' }
        ],
        points: 240,
        isAthlete: true,
        createdAt: new Date('2023-10-15')
      },
      isAnonymous: false,
      schoolName: 'Eastside High',
      likes: 24,
      comments: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      images: ['https://source.unsplash.com/random/600x400?basketball']
    },
    {
      id: '2',
      content: "Just heard that Central High's quarterback might be out for the rivalry game next week. Thoughts on how this impacts our chances?",
      author: null,
      isAnonymous: true,
      schoolName: 'Eastside High',
      likes: 31,
      comments: 12,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: '3',
      content: "Swim team just broke the district record in the 400 relay! So proud of our athletes! 🏊‍♂️ #GoEastside",
      author: {
        id: '2',
        username: 'coach_mike',
        name: 'Coach Mike',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=2',
        school: 'Eastside High',
        badges: [
          { id: '3', name: 'Eastside Coach', type: 'school' },
          { id: '4', name: 'Swimming', type: 'team' }
        ],
        points: 520,
        isAthlete: false,
        createdAt: new Date('2023-09-10')
      },
      isAnonymous: false,
      schoolName: 'Eastside High',
      likes: 86,
      comments: 14,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      images: [
        'https://source.unsplash.com/random/600x400?swimming=1',
        'https://source.unsplash.com/random/600x400?swimming=2'
      ]
    }
  ]);
  
  const handleTabChange = (tab: FeedType) => {
    setActiveTab(tab);
  };
  
  const handleOpenCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };
  
  const handleCloseCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };
  
  const handleCreatePost = (content: string, isAnonymous: boolean, images: string[]) => {
    const newPost: Post = {
      id: `${posts.length + 1}`,
      content,
      author: isAnonymous ? null : {
        id: '1',
        username: 'sarah_j',
        name: 'Sarah Johnson',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=1',
        school: 'Eastside High',
        badges: [
          { id: '1', name: 'Eastside Student', type: 'school' },
          { id: '2', name: 'Basketball', type: 'team' }
        ],
        points: 240,
        isAthlete: true,
        createdAt: new Date('2023-10-15')
      },
      isAnonymous,
      schoolName: 'Eastside High',
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      images: images.length > 0 ? images : undefined
    };
    
    setPosts([newPost, ...posts]);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            {/* Feed Tabs */}
            <FeedTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              schoolName="Eastside High"
              districtName="Metro District"
              stateName="California"
            />
            
            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Create Post Button */}
          <CreatePostButton onClick={handleOpenCreatePostModal} />
          
          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            onClose={handleCloseCreatePostModal}
            onCreatePost={handleCreatePost}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Feed;
