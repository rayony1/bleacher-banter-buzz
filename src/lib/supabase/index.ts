
export { supabase } from './client';
export { getUserProfile } from './auth';
export { getSchools, getSchoolById, insertSampleSchools, updateSchool } from './schools';
export { createPost, getFeedPosts, getPostById } from './posts';
export { likePost, unlikePost, checkIfPostLiked, getLikesCount } from './likes';
export { getPostComments, createComment } from './comments';
export { uploadImage } from './storage';
export { getGames } from './games';
export { bookmarkPost, removeBookmark, checkIfPostBookmarked, getUserBookmarks } from './bookmarks';
