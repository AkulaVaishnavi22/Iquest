import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Send, RefreshCw, ArrowLeft } from 'lucide-react';
import { Stage } from '../types';

export function MockPitchView({ stage, feedback, onSubmit, onNext, onRetry, onBack, loading }: { 
  stage: Stage, 
  feedback: { score: number, feedback: string, questions: string[], isBad?: boolean } | null,
  onSubmit: (text: string) => void,
  onNext: () => void,
  onRetry: () => void,
  onBack: () => void,
  loading: boolean
}) {
  const [text, setText] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 space-y-12 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-muted">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Mock Pitch Session</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Overview</span>
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-4xl font-serif tracking-tight">{stage.simulation.scenario}</h2>
        <p className="text-muted text-lg">The investor is waiting. Deliver your pitch for this specific challenge.</p>
      </div>

      {!feedback ? (
        <div className="space-y-6">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your pitch here..."
            className="w-full bg-black/5 border border-black/5 rounded-3xl p-8 focus:outline-none focus:border-foreground transition-colors h-64 resize-none text-xl font-serif"
          />
          <button 
            onClick={() => onSubmit(text)}
            disabled={loading || !text}
            className="w-full bg-foreground text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Present to Angel Investor <Send className="w-5 h-5" /></>
            )}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-10"
        >
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor Score</div>
              <div className="text-8xl font-serif leading-none">{feedback.score}<span className="text-xl text-muted">/100</span></div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Verdict</div>
              <div className={`text-2xl font-serif ${feedback.isBad ? 'text-red-500' : 'text-green-600'}`}>
                {feedback.isBad ? 'Critical Rejection' : 'Strong Interest'}
              </div>
            </div>
          </div>
          
          <div className={`p-10 rounded-3xl space-y-6 ${feedback.isBad ? 'bg-red-50 border border-red-100' : 'bg-black/5'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor's Feedback</h4>
            <p className="text-xl leading-relaxed text-muted font-serif italic">"{feedback.feedback}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Tough Questions</h4>
              <div className="space-y-4">
                {feedback.questions.map((q, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-black/5 text-muted italic text-sm bg-white/50">
                    {q}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/5 p-10 rounded-[2.5rem] flex flex-col justify-center gap-6">
              <p className="text-sm text-muted leading-relaxed">
                {feedback.isBad 
                  ? "The investor was not convinced. You can retry to address the critical feedback, or continue to the next stage."
                  : "Excellent work. You've built significant trust and demonstrated a strong understanding of the challenge."}
              </p>
              <div className="flex flex-col gap-3">
                {feedback.isBad && (
                  <button 
                    onClick={onRetry}
                    className="w-full bg-red-500 text-white font-medium py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-xl flex flex-col items-center justify-center gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" /> Retry Stage
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      Deducts ${(stage.simulationCost || 0).toLocaleString()} from Budget
                    </div>
                  </button>
                )}
                <button 
                  onClick={onNext}
                  className={`w-full ${feedback.isBad ? 'bg-black/10 text-foreground' : 'bg-foreground text-white'} font-medium py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-xl`}
                >
                  {feedback.isBad ? 'Continue Anyway' : 'Continue Journey'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
