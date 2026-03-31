import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export function ResultView({ feedback, onRestart, onBack }: { 
  feedback: { score: number, feedback: string, questions: string[], isBad?: boolean }, 
  onRestart: () => void,
  onBack: () => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 space-y-12 text-center max-w-4xl mx-auto"
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
      <div className="space-y-6">
        <div className="inline-block p-10 rounded-full bg-black/5">
          <div className="text-8xl font-serif">{feedback.score}<span className="text-2xl text-muted">/100</span></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-serif tracking-tight">Final Evaluation</h2>
          <div className={`text-2xl font-serif ${feedback.isBad ? 'text-red-500' : 'text-green-600'}`}>
            {feedback.isBad ? 'Investment Declined' : 'Investment Secured'}
          </div>
        </div>
      </div>

      <div className={`p-10 rounded-[3rem] space-y-8 text-left ${feedback.isBad ? 'bg-red-50 border border-red-100' : 'bg-black/5'}`}>
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor's Final Verdict</h4>
          <p className="text-2xl font-serif italic leading-relaxed text-muted">"{feedback.feedback}"</p>
        </div>

        {feedback.questions.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Critical Questions for the Future</h4>
            <div className="grid gap-4">
              {feedback.questions.map((q, i) => (
                <div key={i} className="p-6 rounded-2xl border border-black/5 text-muted italic text-sm bg-white/50">
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={onRestart}
        className="w-full bg-foreground text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all text-xl shadow-2xl"
      >
        Restart Journey
      </button>
    </motion.div>
  );
}
