import { motion } from 'motion/react';
import { Zap, ChevronRight, ArrowLeft } from 'lucide-react';
import { Stage } from '../types';

export function SimulationView({ stage, result, onChoice, onNext, onBack }: { 
  stage: Stage, 
  result: string | null, 
  onChoice: (impact: { budget: number; trust: number; impact: number }, feedback: string) => void,
  onNext: () => void,
  onBack: () => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-12 space-y-12"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-muted">
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Simulation Scenario</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Overview</span>
        </button>
      </div>

      <div className="space-y-10">
        <h2 className="text-4xl font-serif leading-tight tracking-tight">{stage.simulation.scenario}</h2>
        
        {!result ? (
          <div className="grid gap-4">
            {stage.simulation.options.map((option, i) => (
              <button 
                key={i}
                onClick={() => onChoice(option.impact, option.feedback)}
                className="text-left p-8 rounded-2xl bg-black/5 border border-transparent hover:border-foreground/20 hover:bg-black/[0.08] transition-all group flex justify-between items-center"
              >
                <span className="text-lg font-medium pr-8">{option.text}</span>
                <ChevronRight className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0" />
              </button>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="p-10 rounded-3xl bg-black/5 text-2xl font-serif italic text-muted leading-relaxed">
              "{result}"
            </div>
            <button 
              onClick={onNext}
              className="w-full bg-foreground text-white font-medium py-5 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg"
            >
              Continue Simulation <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
