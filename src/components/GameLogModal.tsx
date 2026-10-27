import React from 'react';
import { X, ScrollText } from 'lucide-react';

interface GameLogModalProps {
  logs: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const GameLogModal: React.FC<GameLogModalProps> = ({ logs, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <ScrollText size={18} className="text-amber-400" />
            <span>게임 진행 로그</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-2 font-mono text-xs">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded border ${
                log.includes('승리') || log.includes('토벌')
                  ? 'bg-emerald-950/40 border-emerald-900 text-emerald-300 font-bold'
                  : log.includes('실패') || log.includes('피해') || log.includes('패배')
                  ? 'bg-rose-950/40 border-rose-900 text-rose-300 font-bold'
                  : log.includes('구매')
                  ? 'bg-amber-950/30 border-amber-900 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
