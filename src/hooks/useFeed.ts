import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Post, FeedType } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { getFeedPosts } from '@/lib/supabase/posts';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
        badges: [{ id: 'badge-1', name: 'Coach', type: 'staff', badge_name: 'Coach' }],
      },
      isAnonymous: false,
      schoolName: 'Westview High',
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likeCount: 24,
      commentCount: 8,
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
        badges: [{ id: 'badge-2', name: 'Athlete', type: 'athlete', badge_name: 'Athlete' }],
      },
      isAnonymous: false,
      schoolName: 'Westview High',
      likes: 42,
      comments: 12,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likeCount: 42,
      commentCount: 12,
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
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likeCount: 3,
      commentCount: 5,
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
        badges: [{ id: 'badge-3', name: 'Student', type: 'student', badge_name: 'Student' }],
      },
      isAnonymous: false,
      schoolName: 'Westview High',
      likes: 18,
      comments: 2,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likeCount: 18,
      commentCount: 2,
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
        badges: [{ id: 'badge-4', name: 'Admin', type: 'admin', badge_name: 'Admin' }],
      },
      isAnonymous: false,
      schoolName: 'District Office',
      likes: 32,
      comments: 7,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likeCount: 32,
      commentCount: 7,
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
        badges: [{ id: 'badge-5', name: 'Student', type: 'student', badge_name: 'Student' }],
      },
      isAnonymous: false,
      schoolName: 'Del Norte High',
      likes: 27,
      comments: 14,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likeCount: 27,
      commentCount: 14,
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
        badges: [{ id: 'badge-6', name: 'Official', type: 'admin', badge_name: 'Official' }],
      },
      isAnonymous: false,
      schoolName: 'State Office',
      likes: 86,
      comments: 23,
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      likeCount: 86,
      commentCount: 23,
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
        badges: [{ id: 'badge-7', name: 'Official', type: 'admin', badge_name: 'Official' }],
      },
      isAnonymous: false,
      schoolName: 'State Office',
      likes: 41,
      comments: 16,
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      likeCount: 41,
      commentCount: 16,
      images: []
    }
  ],
  'all': [], // Empty for now
  'athletes': [] // Empty for now
};

// Add this type definition for the payload
type RealtimePostPayload = RealtimePostgresChangesPayload<{
  post_id: string;
  user_id: string;
  content: string;
  // Add other fields as needed
}>;

export const useFeed = (feedType: FeedType) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS[feedType]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  // Helper function to convert DB post to Post type
  const mapDbPostToPost = (dbPost: any): Post => {
    return {
      id: dbPost.post_id,
      author: dbPost.is_anonymous ? null : {
        id: dbPost.user_id,
        username: dbPost.username,
        avatar: dbPost.avatar_url,
        badges: [],
      },
      content: dbPost.content,
      timestamp: new Date(dbPost.post_timestamp),
      createdAt: new Date(dbPost.post_timestamp),
      isAnonymous: dbPost.is_anonymous,
      likeCount: dbPost.likes_count,
      commentCount: dbPost.comments_count,
      images: dbPost.images || [],
      schoolName: dbPost.school_name,
      likes: dbPost.likes_count,
      comments: dbPost.comments_count,
    };
  };

  // Function to fetch posts from Supabase
  const fetchPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // For demo posts shown in development or when no user is available
      if (process.env.NODE_ENV === 'development' && !user.id) {
        setPosts(SAMPLE_POSTS[feedType]);
        return;
      }
      
      const { data, error } = await getFeedPosts(feedType, user.id);
      
      if (error) throw error;
      
      if (data) {
        // Map the DB posts to our Post type
        const mappedPosts = data.map(mapDbPostToPost);
        setPosts(mappedPosts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      // Fallback to sample posts if there's an error in development
      if (process.env.NODE_ENV === 'development') {
        setPosts(SAMPLE_POSTS[feedType]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch posts when feed type changes or user changes
  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      // Use sample posts when no user is available (demo mode)
      setPosts(SAMPLE_POSTS[feedType]);
    }
  }, [feedType, user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;
    
    // Create a channel for posts
    const channel = supabase.channel('public:posts');
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: feedType === 'school' ? `school_id=eq.${user.school}` : undefined,
        },
        async (payload: RealtimePostPayload) => {
          console.log('New post:', payload);
          
          // Fetch the new post to get full details
          if (payload.new && 'post_id' in payload.new) {
            const { data, error } = await supabase
              .rpc('get_feed_posts', { 
                feed_type: feedType, 
                user_uuid: user.id 
              })
              .eq('post_id', payload.new.post_id)
              .single();
            
            if (!error && data) {
              // Add the new post to the top of the list
              const newPost = mapDbPostToPost(data);
              setPosts(currentPosts => [newPost, ...currentPosts]);
              
              // Show a toast notification
              toast({
                title: "New post",
                description: "Someone just added a new post to your feed",
              });
            }
          }
        }
      )
      .subscribe();
    
    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [feedType, user, toast]);

  // Demo mode - handle liking posts
  const likePost = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, likeCount: post.likeCount + 1 } 
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
          ? { ...post, likes: Math.max(0, post.likes - 1), likeCount: Math.max(0, post.likeCount - 1) } 
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
    if (!user && !isAnonymous) return;
    
    const newPost: Post = {
      id: `new-post-${Date.now()}`,
      content,
      author: isAnonymous ? null : {
        id: user?.id || '',
        username: user?.username || '',
        name: user?.name || '',
        avatar: user?.avatar,
        badges: user?.badges || [],
      },
      isAnonymous,
      schoolName: 'Westview High',
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      createdAt: new Date(),
      likeCount: 0,
      commentCount: 0,
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
    isLoading,
    error,
    createPost,
    likePost,
    unlikePost,
    isCreatingPost,
    refreshPosts: fetchPosts,
  };
};
