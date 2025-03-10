
import { Post, FeedType } from '@/lib/types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Type definition for the payload from Supabase realtime subscription
export type RealtimePostPayload = RealtimePostgresChangesPayload<{
  post_id: string;
  user_id: string;
  content: string;
  // Add other fields as needed
}>;

// Type for the return value of the useFeed hook
export interface UseFeedReturn {
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
  createPost: (params: { content: string; isAnonymous: boolean; images: string[] }) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  isCreatingPost: boolean;
  refreshPosts: () => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

// Sample posts for demo mode
export const SAMPLE_POSTS: Record<FeedType, Post[]> = {
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
