import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';

export function LoginView({ onLogin, loading }: { onLogin: () => void, loading: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f0]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 max-w-md w-full text-center space-y-8"
      >
        <div className="w-20 h-20 bg-foreground text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <Rocket className="w-10 h-10" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif tracking-tight">Welcome Back</h1>
          <p className="text-muted leading-relaxed">Sign in to track your startup journey and save your progress across all stages.</p>
        </div>
        <button 
          onClick={onLogin}
          disabled={loading}
          className="w-full bg-foreground text-white font-medium py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3 text-lg"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
