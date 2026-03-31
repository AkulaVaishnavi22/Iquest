import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, AlertTriangle, Play, Square, RefreshCw, Send, Users, ArrowLeft } from 'lucide-react';
import { Stage } from '../types';

export function VideoPitchView({ stage, feedback, onSubmit, onNext, onRetry, onBack, loading, evaluationError }: { 
  stage: Stage, 
  feedback: { score: number, feedback: string, questions: string[], isBad?: boolean } | null,
  onSubmit: (base64: string, mimeType: string) => void, 
  onNext: () => void,
  onRetry: () => void,
  onBack: () => void,
  loading: boolean,
  evaluationError?: string | null
}) {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setRecording(true);
      setShowTips(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera and microphone access are required for the video pitch. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!videoBlob) return;
    const reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      onSubmit(base64, 'video/webm');
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 space-y-12 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Overview</span>
          </button>
          <div className="flex items-center gap-3 text-muted">
            <Video className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Mock Video Pitch</span>
          </div>
        </div>
        <button 
          onClick={() => setShowTips(!showTips)}
          className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors"
        >
          {showTips ? 'Hide Tips' : 'Show Pitch Tips'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif tracking-tight">{stage.simulation.scenario}</h2>
            <p className="text-muted text-lg">Record a 30-60 second pitch. The AI Investor will analyze your body language, tone, and content.</p>
            {(error || evaluationError) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {error || evaluationError}
              </motion.div>
            )}
          </div>

          {!feedback ? (
            <div className="space-y-8">
              <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border-8 border-black/5 shadow-2xl">
                {videoUrl ? (
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                )}
                
                {recording && (
                  <div className="absolute top-8 left-8 flex items-center gap-3 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase animate-pulse shadow-lg">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" /> Recording Live
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {!videoUrl ? (
                  !recording ? (
                    <button 
                      onClick={startRecording}
                      className="flex-1 bg-foreground text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl shadow-xl"
                    >
                      <Play className="w-6 h-6" /> Start Recording
                    </button>
                  ) : (
                    <button 
                      onClick={stopRecording}
                      className="flex-1 bg-red-500 text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl shadow-xl"
                    >
                      <Square className="w-6 h-6" /> Stop Recording
                    </button>
                  )
                ) : (
                  <>
                    <button 
                      onClick={() => { setVideoUrl(null); setVideoBlob(null); }}
                      className="flex-1 bg-black/5 text-foreground font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl"
                    >
                      <RefreshCw className="w-6 h-6" /> Retake
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-[2] bg-foreground text-white font-medium py-6 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-xl shadow-xl"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Submit to AI Investor <Send className="w-6 h-6" /></>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor Score</div>
                  <div className="text-9xl font-serif leading-none">{feedback.score}<span className="text-2xl text-muted">/100</span></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Verdict</div>
                  <div className={`text-3xl font-serif ${feedback.isBad ? 'text-red-500' : 'text-green-600'}`}>
                    {feedback.isBad ? 'Critical Rejection' : 'Strong Interest'}
                  </div>
                </div>
              </div>
              
              <div className={`p-12 rounded-[3rem] space-y-6 ${feedback.isBad ? 'bg-red-50 border border-red-100' : 'bg-black/5'}`}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor's Internal Notes</h4>
                <p className="text-2xl leading-relaxed text-muted font-serif italic">"{feedback.feedback}"</p>
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
                <div className="bg-black/5 p-10 rounded-[2.5rem] space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Strategic Advice</h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {feedback.isBad 
                      ? "The investor found significant flaws in your delivery or model. You can retry to improve your score, or continue with the current results."
                      : "You've successfully built trust. The investor sees potential. Double down on your current traction."}
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
        </div>

        <AnimatePresence>
          {showTips && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-[2rem] bg-black/5 space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Pitch Teleprompter</h4>
                <div className="space-y-4 text-sm text-muted leading-relaxed font-serif italic">
                  <p>1. Hook them in the first 10 seconds.</p>
                  <p>2. Clearly state the problem you're solving.</p>
                  <p>3. Explain why your solution is unique.</p>
                  <p>4. Show the impact/traction you've made.</p>
                  <p>5. End with a clear ask.</p>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] border border-black/5 space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Investor Persona</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Critical Angel</div>
                    <div className="text-[10px] text-muted uppercase">High Standards</div>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  This investor values data over hype. Be precise, be confident, and don't over-promise.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
