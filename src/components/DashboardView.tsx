import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { ChevronRight, LayoutDashboard, History, CheckCircle2, TrendingUp, Lock, Target } from 'lucide-react';
import { GameState } from '../types';

export function DashboardView({ user, gameState, proposalStatus, onBack }: { 
  user: User, 
  gameState: GameState | null, 
  proposalStatus: { status: string, review: string } | null,
  onBack: () => void 
}) {
  return (
    <div className="min-h-screen p-8 md:p-16 space-y-12 bg-[#f5f5f0]">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180" /> Back to Journey
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-bold">{user.displayName}</div>
            <div className="text-[10px] text-muted uppercase tracking-widest">{user.email}</div>
          </div>
          <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border border-black/5" alt="Profile" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-10 space-y-8">
            <div className="flex items-center gap-3 text-muted">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Progress Overview</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Current Stage</div>
                <div className="text-4xl font-serif">{gameState?.currentStage || 0}<span className="text-sm text-muted">/{gameState?.stages.length || 5}</span></div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Impact</div>
                <div className="text-4xl font-serif">{gameState?.impact || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor Trust</div>
                <div className="text-4xl font-serif">{gameState?.trust || 0}%</div>
              </div>
            </div>

            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((gameState?.currentStage || 0) / (gameState?.stages.length || 5)) * 100}%` }}
                className="h-full bg-foreground"
              />
            </div>
          </div>

          <div className="glass-card p-10 space-y-8">
            <div className="flex items-center gap-3 text-muted">
              <History className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Stage Breakdown</span>
            </div>
            <div className="space-y-4">
              {gameState?.stages.map((stage, i) => (
                <div key={i} className={`p-6 rounded-2xl border flex items-center justify-between ${i + 1 <= (gameState?.currentStage || 0) ? 'bg-black/5 border-black/5' : 'border-dashed border-black/10 opacity-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= (gameState?.currentStage || 0) ? 'bg-foreground text-white' : 'bg-black/5 text-muted'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">{stage.name}</div>
                      <div className="text-[10px] text-muted uppercase tracking-widest">{stage.type}</div>
                    </div>
                  </div>
                  {i + 1 < (gameState?.currentStage || 0) && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {i + 1 === (gameState?.currentStage || 0) && <TrendingUp className="w-5 h-5 text-foreground animate-pulse" />}
                  {i + 1 > (gameState?.currentStage || 0) && <Lock className="w-4 h-4 text-muted" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`glass-card p-10 space-y-8 border-2 ${proposalStatus?.status === 'accepted' ? 'border-green-500/20' : proposalStatus?.status === 'rejected' ? 'border-red-500/20' : 'border-black/5'}`}>
            <div className="flex items-center gap-3 text-muted">
              <Target className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Final Proposal Status</span>
            </div>
            
            <div className="text-center space-y-6">
              {proposalStatus ? (
                <>
                  <div className={`text-5xl font-serif capitalize ${proposalStatus.status === 'accepted' ? 'text-green-600' : proposalStatus.status === 'rejected' ? 'text-red-500' : 'text-muted'}`}>
                    {proposalStatus.status}
                  </div>
                  <div className="p-6 rounded-2xl bg-black/5 text-sm text-muted leading-relaxed italic font-serif">
                    "{proposalStatus.review}"
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl font-serif text-muted">Pending</div>
                  <p className="text-xs text-muted leading-relaxed">Complete all stages to receive your final investor review and proposal status.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-10 space-y-6 bg-foreground text-white">
            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Strategic Tip</h4>
            <p className="text-sm leading-relaxed italic font-serif">
              "The best founders don't just build products; they build trust. Your progress reflects your ability to navigate uncertainty with data and conviction."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
