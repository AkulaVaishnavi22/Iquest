import { motion } from 'motion/react';
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { useState } from 'react';

interface PostProps {
  post: {
    id: string;
    username: string;
    role: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: any[];
  };
}

export function PostCard({ post }: any) {
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4 bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold text-foreground">
            {post.username[0]}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">{post.username}</h4>
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold px-2 py-0.5 bg-black/5 rounded-full">
              {post.role}
            </span>
          </div>
        </div>
        <button className="text-muted hover:text-foreground transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex items-center gap-6 pt-4 border-t border-black/5">
        <button className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.likes}</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.comments.length} Comments</span>
        </button>
        <button className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        <span className="ml-auto text-[10px] text-muted font-medium uppercase tracking-widest">
          {post.timestamp}
        </span>
      </div>

      {showComments && (
        <CommentSection postId={post.id} comments={post.comments} />
      )}
    </motion.div>
  );
}
