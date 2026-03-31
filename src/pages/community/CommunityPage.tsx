import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, MessageSquare, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PostCard } from '../../components/community/PostCard';
import { AddPostModal } from '../../components/community/AddPostModal';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (newPostData: any) => {
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });
      const data = await response.json();
      setPosts([data, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black/[0.02] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-serif tracking-tight">Startup <span className="italic text-muted">Community</span></h1>
              <p className="text-sm text-muted mt-1">Connect with founders, investors, and builders.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-foreground text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" /> Create Post
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text"
              placeholder="Search posts, topics, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-foreground transition-colors shadow-sm"
            />
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-black/10 border-t-foreground rounded-full animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-20 glass-card">
                <MessageSquare className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                <p className="text-muted">No posts found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-8">
          <div className="glass-card p-6 space-y-6 bg-white border border-black/5">
            <h3 className="text-lg font-serif">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/5 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">1,240</p>
                  <p className="text-[10px] text-muted uppercase tracking-widest">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/5 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">84</p>
                  <p className="text-[10px] text-muted uppercase tracking-widest">Active Today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 bg-white border border-black/5">
            <h3 className="text-lg font-serif">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['#SeedFunding', '#MVP', '#Hiring', '#SaaS', '#Growth'].map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-muted hover:text-foreground cursor-pointer transition-colors px-3 py-1 bg-black/5 rounded-full uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <AddPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddPost} 
      />
    </div>
  );
}
