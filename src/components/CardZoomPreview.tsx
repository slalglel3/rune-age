import React from 'react';
import { ALL_CARDS, FACTION_INFO } from '../engine/cardDatabase';
import { CardView } from './CardView';
import { Swords, Shield, Coins, Heart, Sparkles } from 'lucide-react';

interface CardZoomPreviewProps {
  cardId: string | null;
}

export const CardZoomPreview: React.FC<CardZoomPreviewProps> = ({ cardId }) => {
  if (!cardId) return null;
  const card = ALL_CARDS[cardId];
  if (!card) return null;

  const factionColor = card.faction ? FACTION_INFO[card.faction]?.color : '#334155';

  return (
    <div className="fixed left-4 bottom-24 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-left-4 flex items-end gap-3 drop-shadow-2xl">
      {/* 1. 대형 카드 일러스트 */}
      <div className="w-[180px] h-[252px] rounded-xl overflow-hidden ring-4 ring-amber-400/90 shadow-2xl bg-slate-950">
        <CardView cardId={cardId} size="lg" />
      </div>

      {/* 2. 우측 상세 스펙 & 키워드 툴팁 박스 */}
      <div className="bg-slate-900/95 border-2 border-slate-700 p-3 rounded-2xl max-w-xs shadow-2xl backdrop-blur-md flex flex-col gap-1.5 text-white">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
          <span className="font-extrabold text-sm text-amber-300">{card.name_ko}</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/60 text-slate-300">
            {card.type}
          </span>
        </div>

        {/* 수치 요약 */}
        <div className="flex items-center gap-3 text-xs font-bold py-0.5">
          {card.cost > 0 && (
            <span className="flex items-center text-amber-400">
              <Coins size={13} className="mr-0.5" /> 비용: {card.cost}G
            </span>
          )}
          {card.strength !== undefined && (
            <span className="flex items-center text-rose-400">
              <Swords size={13} className="mr-0.5" /> 공격: {card.strength}
            </span>
          )}
          {card.defense !== undefined && (
            <span className="flex items-center text-blue-400">
              <Shield size={13} className="mr-0.5" /> 방어: {card.defense}
            </span>
          )}
          {card.hp !== undefined && (
            <span className="flex items-center text-red-400">
              <Heart size={13} className="mr-0.5" /> HP: {card.hp}
            </span>
          )}
        </div>

        {/* 상세 설명 */}
        {card.description_ko ? (
          <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-2 rounded-xl border border-slate-800/80">
            {card.description_ko}
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 italic">
            기본 {card.type} 카드입니다.
          </div>
        )}
      </div>
    </div>
  );
};
