import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

export function HomeView({ onStart, loading }: { onStart: (idea: string, budget: string) => void, loading: boolean }) {
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
    const x = (clientX / innerWidth - 0.5) * 30;
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
            y: [0, -15, 0],
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
            style={{ translateZ: '100px' }}
          >
            Don’t just learn <span className="text-muted italic">startups</span> — experience <span className="text-muted italic">them.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-muted"
            style={{ translateZ: '60px' }}
          >
            Master the art of social innovation. Our immersive simulation puts you in the driver's seat of a high-impact venture, where every decision shapes the future.
          </motion.p>

            <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, translateZ: '120px' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => document.getElementById('start-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-foreground text-white rounded-full px-14 py-5 text-base mt-12 transition-all shadow-xl shadow-black/5"
            style={{ translateZ: '80px' }}
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
              src="https://picsum.photos/seed/founder-vision/800/800" 
              alt="Founder Vision" 
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
              { title: "Problem Discovery", desc: "Identify deep-rooted social challenges.", img: "founder-research" },
              { title: "Stakeholder Mapping", desc: "Engage with NGOs and governments.", img: "founder-networking" },
              { title: "Solution Design", desc: "Build sustainable, scalable models.", img: "founder-whiteboard" },
              { title: "Impact Metrics", desc: "Define how success is measured.", img: "founder-data" },
              { title: "Resource Allocation", desc: "Manage limited budgets effectively.", img: "founder-planning" },
              { title: "Crisis Management", desc: "Navigate unexpected roadblocks.", img: "founder-crisis" },
              { title: "The Pitch", desc: "Present your vision to investors.", img: "founder-pitch" }
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
                    src={`https://picsum.photos/seed/${phase.img}/400/225`} 
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
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Initial Budget (₹)</label>
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
              src="https://picsum.photos/seed/founder-success/1200/675" 
              alt="Founder Success" 
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
