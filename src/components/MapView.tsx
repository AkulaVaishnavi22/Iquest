import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, Video, TrendingUp, Building2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { GameState, Stage } from '../types';

export function MapView({ gameState, onSelectStage, onBack }: { 
  gameState: GameState, 
  onSelectStage: (stage: Stage) => void,
  onBack: () => void 
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeStage = gameState.stages.find(s => s.id === gameState.currentStage);
    if (activeStage && scrollContainerRef.current) {
      const el = document.getElementById(`stage-${activeStage.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [gameState.currentStage, gameState.stages]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-12 mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>
      <div className="text-center space-y-4 mb-24">
        <h2 className="text-5xl font-serif tracking-tight text-foreground">The Innovation Path</h2>
        <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          Navigate through the development stages. Review the insights and resources to prepare for each phase of your journey.
        </p>
      </div>

      <div 
        ref={scrollContainerRef}
        className="relative overflow-x-auto pb-32 pt-32 hide-scrollbar"
      >
        <div className="flex items-center min-w-max px-[20vw] relative">
          {/* Central Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10 -translate-y-1/2" />

          {gameState.stages.map((stage, index) => {
            const isLocked = stage.id > gameState.currentStage;
            const isCompleted = stage.id < gameState.currentStage;
            const isCurrent = stage.id === gameState.currentStage;
            const isTop = index % 2 === 0;

            return (
              <div 
                key={stage.id} 
                id={`stage-${stage.id}`}
                className="relative flex flex-col items-center w-64 shrink-0"
              >
                {/* Vertical Connector */}
                <div 
                  className={`absolute left-1/2 -translate-x-1/2 w-px bg-black/10 ${isTop ? 'bottom-1/2 h-24' : 'top-1/2 h-24'}`} 
                />

                {/* Label and Box Container */}
                <div className={`flex flex-col items-center ${isTop ? 'mb-48' : 'mt-48'}`}>
                  {isTop && (
                    <div className={`mb-4 text-[10px] font-bold uppercase tracking-widest text-center max-w-[120px] ${isCurrent ? 'text-[#00FF00]' : 'text-muted'}`}>
                      {stage.name}
                    </div>
                  )}

                  <motion.div
                    whileHover={!isLocked ? { scale: 1.05 } : {}}
                    onClick={() => !isLocked && onSelectStage(stage)}
                    className={`
                      relative w-24 h-24 rounded-3xl flex items-center justify-center cursor-pointer transition-all duration-300
                      ${isLocked ? 'bg-white border border-black/5 shadow-sm' : ''}
                      ${isCurrent ? 'bg-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.3)]' : ''}
                      ${isCompleted ? 'bg-white border border-black/5 shadow-sm' : ''}
                    `}
                  >
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-muted/40" />
                    ) : (
                      <span className={`text-4xl font-serif ${isCurrent ? 'text-foreground' : 'text-foreground'}`}>
                        {index + 1}
                      </span>
                    )}
                  </motion.div>

                  {!isTop && (
                    <div className={`mt-4 text-[10px] font-bold uppercase tracking-widest text-center max-w-[120px] ${isCurrent ? 'text-[#00FF00]' : 'text-muted'}`}>
                      {stage.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scrollbar UI */}
      <div className="max-w-4xl mx-auto px-12 mt-12">
        <div className="relative flex items-center">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 border-l-2 border-b-2 border-black/20 rotate-45" />
          <div className="h-2 bg-[#E5E5E5] rounded-full w-full relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#A3A3A3] rounded-full"
              style={{ width: '60%' }} 
            />
          </div>
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 border-r-2 border-t-2 border-black/20 rotate-45" />
        </div>
      </div>
    </motion.div>
  );
}
