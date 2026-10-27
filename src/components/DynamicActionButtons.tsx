import React from 'react';
import { Swords, CheckCircle, Zap, Coins, Store, Shield } from 'lucide-react';

interface DynamicActionButtonsProps {
  hasReadyAllies: boolean;
  hasUnitsInHand: boolean;
  hasGoldInHand: boolean;
  onAllAttack: () => void;
  onDeployAllUnits: () => void;
  onPlayAllGold: () => void;
  onEndTurn: () => void;
  onToggleMarket: () => void;
  onToggleBarracks: () => void;
}

export const DynamicActionButtons: React.FC<DynamicActionButtonsProps> = ({
  hasReadyAllies,
  hasUnitsInHand,
  hasGoldInHand,
  onAllAttack,
  onDeployAllUnits,
  onPlayAllGold,
  onEndTurn,
  onToggleMarket,
  onToggleBarracks
}) => {
  return (
    <div className="flex flex-col gap-2 shrink-0 select-none z-20">
      {/* 1. 상점 및 병영 열기 버튼 */}
      <div className="flex gap-1.5 justify-end">
        <button
          onClick={onToggleMarket}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/40 shadow transition"
        >
          <Store size={14} />
          <span>공용 상점</span>
        </button>
        <button
          onClick={onToggleBarracks}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-emerald-500/40 shadow transition"
        >
          <Shield size={14} />
          <span>종족 병영</span>
        </button>
      </div>

      {/* 2. 원클릭 편의 기능 버튼들 */}
      <div className="flex gap-1.5 justify-end">
        {hasGoldInHand && (
          <button
            onClick={onPlayAllGold}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
          >
            <Coins size={14} />
            <span>골드 일괄</span>
          </button>
        )}
        {hasUnitsInHand && (
          <button
            onClick={onDeployAllUnits}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition animate-pulse"
          >
            <Zap size={14} />
            <span>전군 출진</span>
          </button>
        )}
      </div>

      {/* 3. 섀도우 에라 스타일: ALL ATTACK & END TURN 2단 메인 버튼 */}
      <div className="flex flex-col gap-1.5">
        {hasReadyAllies && (
          <button
            onClick={onAllAttack}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm tracking-wide shadow-xl shadow-red-600/40 border border-amber-300 transition transform hover:scale-105 active:scale-95 animate-pulse"
          >
            <Swords size={18} />
            <span>ALL ATTACK (총공격)</span>
          </button>
        )}

        <button
          onClick={onEndTurn}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 font-extrabold text-sm tracking-wide shadow-lg border border-slate-700 transition transform hover:scale-102 active:scale-98"
        >
          <CheckCircle size={18} className="text-cyan-400" />
          <span>END TURN (턴 종료)</span>
        </button>
      </div>
    </div>
  );
};
