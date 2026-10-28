import React from 'react';
import { CheckCircle } from 'lucide-react';

interface DynamicActionButtonsProps {
  onEndTurn: () => void;
}

export const DynamicActionButtons: React.FC<DynamicActionButtonsProps> = ({
  onEndTurn
}) => {
  return (
    <div className="flex items-center justify-end select-none z-20">
      {/* 우하단 단일 전용 액션: 턴 종료 (END TURN) */}
      <button
        onClick={onEndTurn}
        className="group relative flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-sm sm:text-base tracking-wider shadow-2xl shadow-cyan-600/50 border-2 border-cyan-400/80 transition-all transform hover:scale-105 active:scale-95"
      >
        <CheckCircle size={22} className="text-cyan-200 group-hover:rotate-12 transition-transform" />
        <span>END TURN (턴 종료)</span>
      </button>
    </div>
  );
};
