import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  username: string;
  role: string;
  content: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: `c${Date.now()}`,
      username: 'Current_User', // Mock current user
      role: 'Founder',
      content: newComment
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="pt-4 space-y-4">
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div 
            key={comment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-3 bg-black/5 rounded-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">
              {comment.username[0]}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{comment.username}</span>
                <span className="text-[8px] uppercase tracking-widest text-muted font-bold px-1.5 py-0.5 bg-black/5 rounded-full">
                  {comment.role}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {comment.content}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 bg-black/5 border border-black/5 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-foreground transition-colors"
        />
        <button 
          type="submit"
          className="bg-foreground text-white px-4 py-2 rounded-xl text-xs font-medium hover:scale-105 active:scale-95 transition-all"
        >
          Reply
        </button>
      </form>
    </div>
  );
}
