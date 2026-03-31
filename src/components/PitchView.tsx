import { motion } from 'motion/react';
import { TrendingUp, Send, ArrowLeft } from 'lucide-react';

export function PitchView({ pitchText, setPitchText, onSubmit, onBack, loading }: { 
  pitchText: string, 
  setPitchText: (t: string) => void, 
  onSubmit: () => void,
  onBack: () => void,
  loading: boolean
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 space-y-12"
    >
      <div className="flex justify-start">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Map</span>
        </button>
      </div>
      <div className="text-center space-y-6">
        <div className="inline-block p-6 rounded-3xl bg-black/5">
          <TrendingUp className="w-14 h-14 text-foreground" />
        </div>
        <h2 className="text-6xl font-serif tracking-tight">The Final Pitch</h2>
        <p className="text-muted max-w-2xl mx-auto text-lg">
          You've completed the simulation. Now, convince a social impact investor that your venture is worth their capital.
        </p>
      </div>

      <div className="space-y-6">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Your Pitch</label>
        <textarea 
          value={pitchText}
          onChange={(e) => setPitchText(e.target.value)}
          placeholder="Describe your vision, business model, and why you'll win..."
          className="w-full bg-black/5 border border-black/5 rounded-3xl p-8 focus:outline-none focus:border-foreground transition-colors h-80 resize-none text-xl font-serif"
        />
        <button 
          onClick={onSubmit}
          disabled={loading || !pitchText}
          className="w-full bg-foreground text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-2xl"
        >
          {loading ? (
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Submit to Investor <Send className="w-6 h-6" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
}
