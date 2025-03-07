
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
        badges: [{ badge_name: 'Coach', type: 'school' }], // Changed 'staff' to 'school'
      },
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'Westview High',
      likeCount: 24,
      commentCount: 8,
      images: [],
      liked: false
    },
    {
      id: 'post2',
      content: "Just set a new personal record in today's track meet! Thanks to everyone who came out to support!",
      author: {
        id: 'user2',
        username: 'TrackStar22',
        name: 'Jamie Rodriguez',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=2',
        badges: [{ badge_name: 'Athlete', type: 'team' }], // Changed 'athlete' to 'team'
      },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'Westview High',
      likeCount: 42,
      commentCount: 12,
      images: ['https://source.unsplash.com/random/800x600?track'],
      liked: false
    },
    {
      id: 'post3',
      content: "Does anyone know when basketball tryouts are happening? The website hasn't been updated.",
      author: null,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isAnonymous: true,
      schoolName: 'Westview High',
      likeCount: 3,
      commentCount: 5,
      images: [],
      liked: false
    },
    {
      id: 'post4',
      content: "The new gym equipment looks amazing! Big shoutout to the Booster Club for making it happen!",
      author: {
        id: 'demo-user-id',
        username: 'BleacherFan',
        name: 'Demo User',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=3',
        badges: [{ badge_name: 'Student', type: 'school' }], // Changed 'student' to 'school'
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'Westview High',
      likeCount: 18,
      commentCount: 2,
      images: ['https://source.unsplash.com/random/800x600?gym'],
      liked: false
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
        badges: [{ badge_name: 'Admin', type: 'school' }], // Changed 'admin' to 'school'
      },
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'District Office',
      likeCount: 32,
      commentCount: 7,
      images: [],
      liked: false
    },
    {
      id: 'post6',
      content: "Del Norte vs Westview tonight at 7pm! It's the rivalry game of the season, don't miss it!",
      author: {
        id: 'user4',
        username: 'SportsFan',
        name: 'Taylor Johnson',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=5',
        badges: [{ badge_name: 'Student', type: 'school' }], // Changed 'student' to 'school'
      },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'Del Norte High',
      likeCount: 27,
      commentCount: 14,
      images: ['https://source.unsplash.com/random/800x600?basketball'],
      liked: false
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
        badges: [{ badge_name: 'Official', type: 'school' }], // Changed 'admin' to 'school'
      },
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'State Office',
      likeCount: 86,
      commentCount: 23,
      images: ['https://source.unsplash.com/random/800x600?stadium'],
      liked: false
    },
    {
      id: 'post8',
      content: "New state regulations for sports safety equipment will be effective next season. Details at the link:",
      author: {
        id: 'user6',
        username: 'SafetyCzar',
        name: 'Safety Committee',
        avatar: 'https://source.unsplash.com/random/100x100?portrait=7',
        badges: [{ badge_name: 'Official', type: 'school' }], // Changed 'admin' to 'school'
      },
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      isAnonymous: false,
      schoolName: 'State Office',
      likeCount: 41,
      commentCount: 16,
      images: [],
      liked: false
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
          ? { ...post, likeCount: post.likeCount + 1 } // Changed likes to likeCount
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
          ? { ...post, likeCount: Math.max(0, post.likeCount - 1) } // Changed likes to likeCount
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
      likeCount: 0, // Changed likes to likeCount
      commentCount: 0, // Changed comments to commentCount
      timestamp: new Date(),
      createdAt: new Date(),
      images,
      liked: false
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
