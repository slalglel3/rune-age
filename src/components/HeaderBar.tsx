import React from 'react';
import { FactionId } from '../types/game';
import { ALL_CARDS, FACTION_INFO } from '../engine/cardDatabase';
import { Coins, Shield, Heart, Layers, Trash2 } from 'lucide-react';

interface HeaderBarProps {
  faction: FactionId;
  turn: number;
  homeRealmHp: number;
  maxHomeRealmHp: number;
  goldPool: number;
  influencePool: number;
  deckCount: number;
  discardCount: number;
  onOpenLog: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  faction,
  turn,
  homeRealmHp,
  maxHomeRealmHp,
  goldPool,
  influencePool,
  deckCount,
  discardCount,
  onOpenLog
}) => {
  const factionInfo = FACTION_INFO[faction];
  const realmDef = ALL_CARDS[faction + '_realm'];

  return (
    <header className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between shrink-0 shadow-md">
      {/* 좌측: 종족 및 홈 렐름 HP */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow"
          style={{ backgroundColor: factionInfo.color }}
        >
          {factionInfo.name_ko.substring(0, 2)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{factionInfo.name_ko}</span>
            <span className="text-[11px] text-amber-400 font-semibold bg-amber-950/60 border border-amber-900/60 px-1.5 py-0.2 rounded">
              턴 {turn}
            </span>
          </div>

          {/* 홈 렐름 HP 게이지 */}
          <div className="flex items-center gap-2 mt-0.5">
            <Heart size={14} className="text-red-500 fill-red-500" />
            <div className="w-28 sm:w-36 bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-red-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(homeRealmHp / maxHomeRealmHp) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">
              {homeRealmHp}/{maxHomeRealmHp}
            </span>
          </div>
        </div>
      </div>

      {/* 중앙: 보유 자원 (골드 / 영향력) */}
      <div className="flex items-center gap-4">
        {/* 골드 풀 */}
        <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/50 px-3 py-1 rounded-xl shadow">
          <Coins size={18} className="text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-amber-300/80 font-bold uppercase leading-tight">골드</span>
            <span className="text-sm font-black text-amber-300 leading-tight">{goldPool} G</span>
          </div>
        </div>

        {/* 영향력 풀 */}
        <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1 rounded-xl shadow">
          <Shield size={18} className="text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-300/80 font-bold uppercase leading-tight">영향력</span>
            <span className="text-sm font-black text-emerald-300 leading-tight">{influencePool}</span>
          </div>
        </div>
      </div>

      {/* 우측: 덱/버린더미 현황 & 로그 버튼 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400 hidden sm:flex">
          <span className="flex items-center gap-1" title="덱에 남은 카드">
            <Layers size={14} className="text-cyan-400" />
            <span className="font-bold text-slate-200">{deckCount}</span>
          </span>
          <span className="flex items-center gap-1" title="버린 카드 더미">
            <Trash2 size={14} className="text-slate-500" />
            <span className="font-bold text-slate-200">{discardCount}</span>
          </span>
        </div>

        <button
          onClick={onOpenLog}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          📜 로그
        </button>
      </div>
    </header>
  );
};
