import { useState, useEffect, useRef, ReactNode, MouseEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  Coins, 
  Users, 
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Send
} from 'lucide-react';
import { generateStages, evaluatePitch } from './services/ai';
import { GameState, Stage } from './types';

const INITIAL_METRICS = {
  trust: 50,
  impact: 0
};

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'home' | 'map' | 'stage' | 'simulation' | 'crisis' | 'pitch' | 'result'>('home');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [pitchText, setPitchText] = useState('');

  const handleStart = async (idea: string, budget: string) => {
    setLoading(true);
    try {
      const stages = await generateStages(idea, budget);
      const numericBudget = parseInt(budget.replace(/[^0-9]/g, '')) || 100000;
      setGameState({
        idea,
        audience: "Social Impact Community", // Default audience since we replaced the input
        budget: numericBudget,
        ...INITIAL_METRICS,
        currentStage: 1,
        stages,
        isGameOver: false
      });
      setView('map');
    } catch (error) {
      console.error("Failed to start journey:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (impact: { budget: number; trust: number; impact: number }, feedback: string) => {
    if (!gameState) return;
    
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        budget: Math.max(0, prev.budget + impact.budget),
        trust: Math.min(100, Math.max(0, prev.trust + impact.trust)),
        impact: Math.max(0, prev.impact + impact.impact)
      };
    });
    setSimulationResult(feedback);
  };

  const nextStage = () => {
    if (!gameState) return;
    const isLastStage = gameState.currentStage === 7;
    
    if (isLastStage) {
      setView('pitch');
    } else {
      setGameState(prev => prev ? { ...prev, currentStage: prev.currentStage + 1 } : null);
      setSimulationResult(null);
      setView('map');
    }
  };

  const handlePitchSubmit = async () => {
    if (!gameState) return;
    setLoading(true);
    try {
      const feedback = await evaluatePitch(gameState.idea, pitchText);
      setGameState(prev => prev ? { ...prev, pitchFeedback: feedback, isGameOver: true } : null);
      setView('result');
    } catch (error) {
      console.error("Pitch evaluation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-foreground selection:text-white font-sans">
      {/* Navigation Bar */}
      {view === 'home' && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-8 h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl tracking-tight font-serif text-foreground"
            >
              StartupSim<span className="text-xs align-top ml-0.5">®</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              {['Home', 'Simulation', 'About', 'Impact', 'Contact'].map((item, i) => (
                <motion.button 
                  key={item}
                  onClick={() => {
                    if (view !== 'home') setView('home');
                    const id = item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase();
                    setTimeout(() => {
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }, view !== 'home' ? 100 : 0);
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${item === 'Home' ? 'text-foreground font-medium' : 'text-muted'} transition-colors hover:text-foreground cursor-pointer bg-transparent border-none p-0`}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                if (view !== 'home') setView('home');
                else document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-foreground text-white rounded-full px-6 py-2.5 text-sm transition-all"
            >
              Begin Simulation
            </motion.button>
          </div>
        </nav>
      )}

      {/* Dashboard (Sticky below nav if game started) */}
      {gameState && view !== 'home' && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-20 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-md border-b border-black/5"
        >
          <div className="max-w-7xl mx-auto flex justify-center gap-12">
            <Metric icon={<Coins className="text-foreground w-4 h-4" />} label="Budget" value={`$${gameState.budget.toLocaleString()}`} />
            <Metric icon={<Users className="text-foreground w-4 h-4" />} label="Trust" value={`${gameState.trust}%`} />
            <Metric icon={<Zap className="text-foreground w-4 h-4" />} label="Impact" value={gameState.impact} />
          </div>
        </motion.div>
      )}

      <main className={`${view === 'home' ? '' : 'pt-48 pb-20 px-4 max-w-5xl mx-auto'}`}>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <HomeView onStart={handleStart} loading={loading} />
          )}

          {view === 'map' && gameState && (
            <MapView 
              gameState={gameState} 
              onSelectStage={(stage) => {
                setSelectedStage(stage);
                setView('stage');
              }} 
            />
          )}

          {view === 'stage' && selectedStage && (
            <StageDetailView 
              stage={selectedStage} 
              onStartSimulation={() => setView('simulation')}
              onBack={() => setView('map')}
            />
          )}

          {view === 'simulation' && selectedStage && (
            <SimulationView 
              stage={selectedStage}
              result={simulationResult}
              onChoice={handleChoice}
              onNext={nextStage}
            />
          )}

          {view === 'pitch' && (
            <PitchView 
              pitchText={pitchText}
              setPitchText={setPitchText}
              onSubmit={handlePitchSubmit}
              loading={loading}
            />
          )}

          {view === 'result' && gameState?.pitchFeedback && (
            <ResultView feedback={gameState.pitchFeedback} onRestart={() => window.location.reload()} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-black/5 rounded-lg">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{label}</span>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

function HomeView({ onStart, loading }: { onStart: (idea: string, budget: string) => void, loading: boolean }) {
  const [idea, setIdea] = useState('');
  const [budget, setBudget] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Effect with Spring Smoothing
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 30; // Increased range
    const y = (clientY / innerHeight - 0.5) * 30;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useTransform(mouseY, (v) => -v * 0.5);
  const rotateY = useTransform(mouseX, (v) => v * 0.5);
  const bgRotateX = useTransform(mouseY, (v) => v * 0.2);
  const bgRotateY = useTransform(mouseX, (v) => -v * 0.2);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frameId: number;
    const fadeDuration = 0.5;

    const checkTime = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (duration > 0) {
        if (currentTime < fadeDuration) {
          setOpacity(currentTime / fadeDuration);
        } else if (currentTime > duration - fadeDuration) {
          setOpacity((duration - currentTime) / fadeDuration);
        } else {
          setOpacity(1);
        }
      }
      frameId = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    frameId = requestAnimationFrame(checkTime);

    return () => {
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center perspective-1000"
    >
      {/* Hero Section */}
      <section id="hero" className="relative w-full min-h-screen flex flex-col items-center">
        {/* Background Video Layer */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{ 
            top: '300px',
            rotateX: bgRotateX,
            rotateY: bgRotateY,
            scale: 1.1
          }}
        >
          <video
            ref={videoRef}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
            muted
            playsInline
            autoPlay
            className="w-full h-full object-cover transition-opacity duration-100"
            style={{ opacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full" 
          animate={{
            y: [0, -15, 0], // Subtle floating animation
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ 
            paddingTop: '16rem', 
            paddingBottom: '12rem',
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-serif font-normal leading-[1.1] tracking-tight text-foreground"
            style={{ translateZ: '100px' }} // Increased depth
          >
            Don’t just learn <span className="text-muted italic">startups</span> — experience <span className="text-muted italic">them.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-muted"
            style={{ translateZ: '60px' }} // Increased depth
          >
            Master the art of social innovation. Our immersive simulation puts you in the driver's seat of a high-impact venture, where every decision shapes the future.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, translateZ: '120px' }} // Increased depth
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-foreground text-white rounded-full px-14 py-5 text-base mt-12 transition-all shadow-xl shadow-black/5"
            style={{ translateZ: '80px' }} // Increased depth
          >
            Begin Simulation
          </motion.button>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-7xl px-8 py-32 space-y-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-serif tracking-tight">What is <span className="italic text-muted">StartupSim?</span></h2>
            <p className="text-lg text-muted leading-relaxed">
              StartupSim is an experiential learning platform designed to bridge the gap between theory and execution in social entrepreneurship. We believe that the best way to learn is by doing—navigating real-world complexities, managing stakeholder expectations, and making critical decisions under pressure.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="text-3xl font-serif">100%</h4>
                <p className="text-xs uppercase tracking-widest text-muted font-bold">Experiential</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-serif">AI-Driven</h4>
                <p className="text-xs uppercase tracking-widest text-muted font-bold">Personalized</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/assets/illustration_about_1774873362114.png" 
              alt="Social Innovation" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Simulation Phases Section */}
      <section id="simulation" className="w-full bg-black/[0.02] py-32">
        <div className="max-w-7xl mx-auto px-8 space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-serif tracking-tight">Implementation <span className="italic text-muted">Phases</span></h2>
            <p className="text-muted max-w-2xl mx-auto">Our simulation follows a structured 7-stage journey from initial discovery to the final investor pitch.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Problem Discovery", desc: "Identify deep-rooted social challenges.", img: "/assets/illustration_phase1_1774873396448.png" },
              { title: "Stakeholder Mapping", desc: "Engage with NGOs and governments.", img: "/assets/illustration_phase2_1774873425311.png" },
              { title: "Solution Design", desc: "Build sustainable, scalable models.", img: "/assets/illustration_phase3_1774873444185.png" },
              { title: "Impact Metrics", desc: "Define how success is measured.", img: "/assets/illustration_phase4_1774873462469.png" },
              { title: "Resource Allocation", desc: "Manage limited budgets effectively.", img: "/assets/illustration_phase5_1774873491500.png" },
              { title: "Crisis Management", desc: "Navigate unexpected roadblocks.", img: "/assets/illustration_phase6_1774873513812.png" },
              { title: "The Pitch", desc: "Present your vision to investors.", img: "/assets/illustration_phase7_1774873530922.png" }
            ].map((phase, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 space-y-4 hover:border-foreground/20 transition-all group"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-black/5">
                  <img 
                    src={phase.img} 
                    alt={phase.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Phase 0{i+1}</span>
                  <h3 className="text-xl font-serif">{phase.title}</h3>
                  <p className="text-sm text-muted">{phase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Start Form Section Integrated Here */}
          <div id="start-form" className="flex flex-col items-center pt-20">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full max-w-xl"
            >
              <div className="glass-card p-10 space-y-8 border-black/10 shadow-2xl shadow-black/5 hover:shadow-black/10 transition-shadow bg-white">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-serif">Initiate Simulation</h2>
                  <p className="text-sm text-muted">Define your vision to begin the execution cycle.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Startup Idea</label>
                    <textarea 
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="e.g. AI-powered sustainable fashion marketplace"
                      className="w-full bg-black/5 border border-black/5 rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors h-32 resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Initial Budget ($)</label>
                    <input 
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full bg-black/5 border border-black/5 rounded-2xl p-4 focus:outline-none focus:border-foreground transition-colors text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => onStart(idea, budget)}
                    disabled={loading || !idea || !budget}
                    className="w-full bg-foreground text-white font-medium py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Start Simulation <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="w-full max-w-7xl px-8 py-32 space-y-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl order-2 md:order-1"
          >
            <img 
              src="/assets/illustration_impact_1774873380573.png" 
              alt="Social Impact" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 order-1 md:order-2"
          >
            <h2 className="text-5xl font-serif tracking-tight">Measuring <span className="italic text-muted">Success</span></h2>
            <p className="text-lg text-muted leading-relaxed">
              In social innovation, profit is only half the story. Our simulation tracks your impact score alongside your budget. We challenge you to build ventures that are not only financially viable but also create measurable positive change in the world.
            </p>
            <ul className="space-y-4">
              {["Sustainable Development Goals", "Community Trust Building", "Scalable Social Models"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-foreground" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className="w-full border-t border-black/5 py-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-serif">StartupSim®</h3>
            <p className="text-sm text-muted max-w-xs">Empowering the next generation of social innovators through immersive simulation.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-[10px] text-muted">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-muted transition-colors">Simulation</a></li>
                <li><a href="#" className="hover:text-muted transition-colors">Methodology</a></li>
                <li><a href="#" className="hover:text-muted transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase tracking-widest text-[10px] text-muted">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-muted transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-muted transition-colors">Impact Report</a></li>
                <li><a href="#" className="hover:text-muted transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-20 text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted font-bold">© 2026 StartupSim AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function MapView({ gameState, onSelectStage }: { gameState: GameState, onSelectStage: (stage: Stage) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif tracking-tight">The Path to <span className="italic text-muted">Impact</span></h2>
        <p className="text-muted max-w-lg mx-auto">Complete each stage to unlock the next challenge in your social innovation journey.</p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 -translate-x-1/2" />
        
        <div className="space-y-12 relative z-10">
          {gameState.stages.map((stage, index) => {
            const isLocked = stage.id > gameState.currentStage;
            const isCompleted = stage.id < gameState.currentStage;
            const isCurrent = stage.id === gameState.currentStage;

            return (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isLocked && onSelectStage(stage)}
                className={`
                  glass-card p-8 flex items-center gap-8 cursor-pointer transition-all group relative
                  ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-foreground/20 hover:bg-black/[0.02]'}
                  ${isCurrent ? 'border-foreground/30 shadow-xl shadow-black/5' : ''}
                `}
              >
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-serif text-2xl
                  ${isCompleted ? 'bg-foreground text-white' : isCurrent ? 'bg-foreground text-white' : 'bg-black/5 text-muted'}
                `}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : stage.id}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl leading-tight">{stage.name}</h3>
                  <p className="text-sm text-muted mt-1">{stage.objective}</p>
                </div>
                {isLocked ? <Lock className="w-5 h-5 text-muted/30" /> : <ChevronRight className="w-5 h-5 text-foreground group-hover:translate-x-1 transition-transform" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function StageDetailView({ stage, onStartSimulation, onBack }: { stage: Stage, onStartSimulation: () => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 space-y-12"
    >
      <button onClick={onBack} className="text-xs font-bold text-muted hover:text-foreground flex items-center gap-2 transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> BACK TO SIMULATION MAP
      </button>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-black/5">
            <Target className="w-10 h-10 text-foreground" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Stage {stage.id}</span>
            <h2 className="text-5xl font-serif tracking-tight">{stage.name}</h2>
          </div>
        </div>
        <p className="text-2xl text-muted font-serif italic leading-relaxed">"{stage.objective}"</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Actionable Tasks</h4>
          <ul className="space-y-4">
            {stage.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-4 text-foreground/80">
                <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                </div>
                <span className="text-lg">{task}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-black/5 rounded-3xl p-10 flex flex-col justify-center items-center text-center gap-6">
          <Zap className="w-12 h-12 text-foreground" />
          <div className="space-y-2">
            <h4 className="text-xl font-serif">Ready for the simulation?</h4>
            <p className="text-sm text-muted">Your decisions here will impact your budget, trust, and overall impact.</p>
          </div>
          <button 
            onClick={onStartSimulation}
            className="w-full bg-foreground text-white font-medium py-4 rounded-2xl hover:scale-[1.02] transition-all"
          >
            Initiate Simulation
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SimulationView({ stage, result, onChoice, onNext }: { 
  stage: Stage, 
  result: string | null, 
  onChoice: (impact: { budget: number; trust: number; impact: number }, feedback: string) => void,
  onNext: () => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-12 space-y-12"
    >
      <div className="flex items-center gap-3 text-muted">
        <Zap className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Simulation Scenario</span>
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

function PitchView({ pitchText, setPitchText, onSubmit, loading }: { 
  pitchText: string, 
  setPitchText: (t: string) => void, 
  onSubmit: () => void,
  loading: boolean
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 space-y-12"
    >
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

function ResultView({ feedback, onRestart }: { feedback: { score: number, feedback: string, questions: string[] }, onRestart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-12 space-y-12"
    >
      <div className="text-center space-y-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor Verdict</div>
        <div className="text-9xl font-serif font-normal text-foreground leading-none">{feedback.score}<span className="text-4xl text-muted">/10</span></div>
        <h2 className="text-4xl font-serif tracking-tight">Feedback from the Board</h2>
      </div>

      <div className="p-10 rounded-3xl bg-black/5 space-y-6">
        <p className="text-2xl leading-relaxed text-muted font-serif italic">"{feedback.feedback}"</p>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Hard Questions to Consider
        </h4>
        <div className="grid gap-4">
          {feedback.questions.map((q, i) => (
            <div key={i} className="p-6 rounded-2xl bg-black/5 border border-black/5 text-lg font-serif italic text-muted">
              {q}
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onRestart}
        className="w-full bg-foreground text-white font-medium py-5 rounded-2xl hover:scale-[1.02] transition-all text-lg"
      >
        Initiate New Simulation
      </button>
    </motion.div>
  );
}
