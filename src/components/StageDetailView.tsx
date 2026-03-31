import { motion } from 'motion/react';
import { ChevronRight, Target, Coins, TrendingDown, BookOpen, Globe, Building2, CheckCircle2, Zap } from 'lucide-react';
import { Stage } from '../types';

export function StageDetailView({ stage, onStartSimulation, onBack, onSkip }: { stage: Stage, onStartSimulation: () => void, onBack: () => void, onSkip: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 space-y-16"
    >
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-xs font-bold text-muted hover:text-foreground flex items-center gap-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> BACK TO SIMULATION MAP
        </button>
        <button onClick={onSkip} className="text-xs font-bold text-muted hover:text-red-500 flex items-center gap-2 transition-colors">
          SKIP STAGE <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <div className="p-6 rounded-3xl bg-black/5">
            <Target className="w-12 h-12 text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Stage {stage.id}</span>
              <span className="text-[10px] font-bold text-foreground bg-black/5 px-2 py-0.5 rounded-full uppercase tracking-widest">{stage.phase} Phase</span>
            </div>
            <h2 className="text-5xl font-serif tracking-tight">{stage.name}</h2>
          </div>
        </div>
        <p className="text-3xl text-muted font-serif italic leading-relaxed max-w-3xl">"{stage.objective}"</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Cost Estimates */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-black/5 border border-black/5 space-y-4">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-muted" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Real-World Cost Estimate</h4>
              </div>
              <p className="text-xl font-serif italic text-foreground leading-relaxed">
                {stage.realWorldCostEstimate || "Cost varies based on execution and market conditions."}
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-red-50 border border-red-100 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-400">Simulation Attempt Cost</h4>
              </div>
              <p className="text-3xl font-serif text-red-600 leading-none">
                -${(stage.simulationCost || 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 opacity-60">Deducted per attempt/retry</p>
            </div>
          </div>

          {/* Real World Resources */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-muted" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Real-World Resources</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {stage.realWorldResources.map((res, i) => (
                <div key={i} className="p-6 rounded-3xl bg-black/[0.02] border border-black/5 space-y-4">
                  <h5 className="font-serif text-lg">{res.title}</h5>
                  <p className="text-sm text-muted leading-relaxed">{res.description}</p>
                  {res.link && (
                    <a 
                      href={res.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold hover:underline"
                    >
                      Learn More <Globe className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Government Funding */}
          {stage.governmentFundingGuide && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Government Funding Portal</h4>
              </div>
              <div className="p-10 rounded-[3rem] bg-foreground text-white space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                
                <div className="space-y-4 relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[8px] font-bold uppercase tracking-widest">Recommended Program</div>
                  <h5 className="text-3xl font-serif leading-tight">{stage.governmentFundingGuide.programName}</h5>
                </div>

                <div className="grid md:grid-cols-2 gap-10 relative z-10">
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Eligibility Criteria</div>
                    <p className="text-sm leading-relaxed opacity-90 font-serif italic">"{stage.governmentFundingGuide.eligibility}"</p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Submission Strategy</div>
                    <p className="text-sm leading-relaxed opacity-90">{stage.governmentFundingGuide.submissionTips}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Application
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Project-Specific Guide
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-12">
          {/* Tasks */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Actionable Tasks</h4>
            <ul className="space-y-4">
              {stage.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-4 text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  </div>
                  <span className="text-lg leading-tight">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <div className="bg-black/5 rounded-3xl p-10 flex flex-col justify-center items-center text-center gap-6">
            <Zap className="w-12 h-12 text-foreground" />
            <div className="space-y-2">
              <h4 className="text-xl font-serif">Ready to Simulate?</h4>
              <p className="text-sm text-muted">Test your skills in a high-stakes scenario.</p>
            </div>
            <button 
              onClick={onStartSimulation}
              className="w-full bg-foreground text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-1"
            >
              <div className="flex items-center gap-2 text-xl font-serif">
                {stage.type === 'video-pitch' ? 'Start Video Pitch' : 
                 stage.type === 'ppt-pitch' ? 'Start Deck Pitch' :
                 stage.type === 'pitch' ? 'Start Mock Pitch' : 'Initiate Simulation'}
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Deducts ${(stage.simulationCost || 0).toLocaleString()} from Budget
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
