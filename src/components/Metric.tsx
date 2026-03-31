import { ReactNode } from 'react';
import { motion } from 'motion/react';

export function Metric({ icon, label, value }: { icon: ReactNode, label: string, value: string | number }) {
  return (
    <motion.div 
      key={String(value)}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-6 px-8 py-4 bg-[#F2F2F2] rounded-2xl min-w-[180px]"
    >
      <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-muted font-bold mb-0.5">{label}</span>
        <span className="text-lg font-medium text-foreground">{value}</span>
      </div>
    </motion.div>
  );
}
