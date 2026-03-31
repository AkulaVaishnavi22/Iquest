import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (post: any) => void;
}

export function AddPostModal({ isOpen, onClose, onAdd }: AddPostModalProps) {
  const [content, setContent] = useState('');
  const [role, setRole] = useState('Founder');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAdd({
      username: 'Current_User',
      role,
      content,
    });
    setContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif">Create Post</h3>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Your Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/5 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-foreground transition-colors"
                >
                  <option value="Founder">Founder</option>
                  <option value="Investor">Investor</option>
                  <option value="Developer">Developer</option>
                  <option value="Learner">Learner</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">What's on your mind?</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your startup journey, ask a question, or offer advice..."
                  className="w-full bg-black/5 border border-black/5 rounded-2xl p-4 h-40 resize-none text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-foreground text-white py-4 rounded-2xl font-medium hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Post to Community
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
