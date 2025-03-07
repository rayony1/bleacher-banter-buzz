
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post, FeedType } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Sample posts for demo
const SAMPLE_POSTS: Record<FeedType, Post[]> = {
  'school': [
    {
      id: 'post1',
      content: "Big game this Friday against Del Norte! Who's coming to cheer on our Wolverines? #GoWolverines",
      author: {
        id: 'user1',
        username: 'CoachJohnson',
        name: 'Coach Johnson',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=1',
        school: 'Westview High',
        badges: [{ badge_name: 'Coach', type: 'staff' }],
        points: 540,
        isAthlete: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'Westview High',
      likes: 24,
      comments: 8,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      images: []
    },
    {
      id: 'post2',
      content: "Just set a new personal record in today's track meet! Thanks to everyone who came out to support!",
      author: {
        id: 'user2',
        username: 'TrackStar22',
        name: 'Jamie Rodriguez',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=2',
        school: 'Westview High',
        badges: [{ badge_name: 'Athlete', type: 'athlete' }],
        points: 320,
        isAthlete: true,
        createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'Westview High',
      likes: 42,
      comments: 12,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      images: ['https://source.unsplash.com/random/800x600?track']
    },
    {
      id: 'post3',
      content: "Does anyone know when basketball tryouts are happening? The website hasn't been updated.",
      author: null,
      isAnonymous: true,
      schoolName: 'Westview High',
      likes: 3,
      comments: 5,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      images: []
    },
    {
      id: 'post4',
      content: "The new gym equipment looks amazing! Big shoutout to the Booster Club for making it happen!",
      author: {
        id: 'demo-user-id',
        username: 'BleacherFan',
        name: 'Demo User',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=3',
        school: 'Westview High',
        badges: [{ badge_name: 'Student', type: 'student' }],
        points: 250,
        isAthlete: false,
        createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'Westview High',
      likes: 18,
      comments: 2,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      images: ['https://source.unsplash.com/random/800x600?gym']
    }
  ],
  'district': [
    {
      id: 'post5',
      content: "District-wide spirit week starts Monday! Show your school colors all week long!",
      author: {
        id: 'user3',
        username: 'DistrictAdmin',
        name: 'District Office',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=4',
        school: 'District Office',
        badges: [{ badge_name: 'Admin', type: 'admin' }],
        points: 0,
        isAthlete: false,
        createdAt: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'District Office',
      likes: 32,
      comments: 7,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      images: []
    },
    {
      id: 'post6',
      content: "Del Norte vs Westview tonight at 7pm! It's the rivalry game of the season, don't miss it!",
      author: {
        id: 'user4',
        username: 'SportsFan',
        name: 'Taylor Johnson',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=5',
        school: 'Del Norte High',
        badges: [{ badge_name: 'Student', type: 'student' }],
        points: 180,
        isAthlete: false,
        createdAt: new Date(Date.now() - 450 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'Del Norte High',
      likes: 27,
      comments: 14,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      images: ['https://source.unsplash.com/random/800x600?basketball']
    }
  ],
  'state': [
    {
      id: 'post7',
      content: "State championships will be held in San Diego this year! Schedule coming soon.",
      author: {
        id: 'user5',
        username: 'StateAthletics',
        name: 'CA Athletics',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=6',
        school: 'State Office',
        badges: [{ badge_name: 'Official', type: 'admin' }],
        points: 0,
        isAthlete: false,
        createdAt: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'State Office',
      likes: 86,
      comments: 23,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      images: ['https://source.unsplash.com/random/800x600?stadium']
    },
    {
      id: 'post8',
      content: "New state regulations for sports safety equipment will be effective next season. Details at the link:",
      author: {
        id: 'user6',
        username: 'SafetyCzar',
        name: 'Safety Committee',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=7',
        school: 'State Office',
        badges: [{ badge_name: 'Official', type: 'admin' }],
        points: 0,
        isAthlete: false,
        createdAt: new Date(Date.now() - 700 * 24 * 60 * 60 * 1000)
      },
      isAnonymous: false,
      schoolName: 'State Office',
      likes: 41,
      comments: 16,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      images: []
    }
  ]
};

export const useFeed = (feedType: FeedType) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS[feedType]);
  
  // Update posts when feed type changes
  useEffect(() => {
    setPosts(SAMPLE_POSTS[feedType]);
  }, [feedType]);

  // Demo mode - handle liking posts
  const likePost = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
    
    toast({
      title: 'Post liked!',
      description: 'Demo mode: Like count updated',
    });
  };
  
  // Demo mode - handle unliking posts
  const unlikePost = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) } 
          : post
      )
    );
    
    toast({
      title: 'Post unliked',
      description: 'Demo mode: Like count updated',
    });
  };
  
  // Demo mode - handle creating posts
  const createPost = ({ content, isAnonymous, images }: { content: string; isAnonymous: boolean; images: string[] }) => {
    const newPost: Post = {
      id: `new-post-${Date.now()}`,
      content,
      author: isAnonymous ? null : user,
      isAnonymous,
      schoolName: 'Westview High',
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      images
    };
    
    setPosts(currentPosts => [newPost, ...currentPosts]);
    
    toast({
      title: 'Post created!',
      description: 'Demo mode: Your post has been added to the feed',
    });
  };

  return {
    posts,
    isLoading: false,
    error: null,
    createPost,
    likePost,
    unlikePost,
    isCreatingPost: false,
  };
};
