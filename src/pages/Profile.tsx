
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfileCard from '@/components/profile/ProfileCard';
import PostCard from '@/components/feed/PostCard';
import { User, Post } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  // Mock user data
  const user: User = {
    id: '1',
    username: 'sarah_j',
    name: 'Sarah Johnson',
    avatar: 'https://source.unsplash.com/random/300x300?portrait=1',
    school: 'Eastside High',
    badges: [
      { id: '1', name: 'Eastside Student', type: 'school' },
      { id: '2', name: 'Basketball', type: 'team' },
      { id: '3', name: 'Top Predictor', type: 'achievement' }
    ],
    points: 240,
    isAthlete: true,
    createdAt: new Date('2023-10-15')
  };
  
  // Mock posts data
  const posts: Post[] = [
    {
      id: '1',
      content: "Our basketball team is looking incredible in practice today! Can't wait for the game on Friday!",
      author: user,
      isAnonymous: false,
      schoolName: 'Eastside High',
      likes: 24,
      comments: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      images: ['https://source.unsplash.com/random/600x400?basketball']
    },
    {
      id: '3',
      content: "Congrats to our volleyball team for winning the district championship! What an amazing season! #GoEastside",
      author: user,
      isAnonymous: false,
      schoolName: 'Eastside High',
      likes: 86,
      comments: 14,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      images: [
        'https://source.unsplash.com/random/600x400?volleyball=1',
        'https://source.unsplash.com/random/600x400?volleyball=2'
      ]
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/feed" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="md:col-span-1">
                <ProfileCard user={user} />
              </div>
              
              {/* Content Section */}
              <div className="md:col-span-2">
                <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-6">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="predictions">Predictions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="posts" className="animate-fade-in">
                    <div className="space-y-6">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                      
                      {posts.length === 0 && (
                        <div className="text-center py-10">
                          <p className="text-muted-foreground">No posts yet.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="predictions" className="animate-fade-in">
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Prediction history coming soon.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
