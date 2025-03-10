
/**
 * Process notification data and extract relevant information
 */
export const processNotificationData = (data: any): { 
  type: string; 
  targetId: string;
  title: string;
  body: string;
} => {
  let type = 'generic';
  let targetId = '';
  let title = 'Bleacher Banter';
  let body = 'You have a new notification';
  
  if (data) {
    type = data.type || type;
    targetId = data.postId || data.gameId || data.predictionId || targetId;
    
    if (data.title) title = data.title;
    if (data.body) body = data.body;
    
    if (!data.title) {
      switch (type) {
        case 'like':
          title = 'New Like';
          body = data.username ? `${data.username} liked your post` : 'Someone liked your post';
          break;
        case 'comment':
          title = 'New Comment';
          body = data.username ? `${data.username} commented on your post` : 'Someone commented on your post';
          break;
        case 'game':
          title = 'Game Update';
          body = data.gameTitle || "There is an update to a game you're following";
          break;
        case 'prediction':
          title = 'Prediction Result';
          body = 'Your prediction results are in!';
          break;
      }
    }
  }
  
  return { type, targetId, title, body };
};
