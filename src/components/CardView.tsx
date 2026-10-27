import React, { useState } from 'react';
import { CardDefinition } from '../types/game';
import { ALL_CARDS, CARD_BACKS, FACTION_INFO } from '../engine/cardDatabase';
import clsx from 'clsx';
import { Coins, Shield, Swords, Heart } from 'lucide-react';

interface CardViewProps {
  cardId: string;
  isFlipped?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  badge?: string | number;
}

export const CardView: React.FC<CardViewProps> = ({
  cardId,
  isFlipped = false,
  isSelected = false,
  isDisabled = false,
  size = 'md',
  onClick,
  badge
}) => {
  const card: CardDefinition = ALL_CARDS[cardId] || {
    id: cardId,
    name_ko: cardId,
    name_en: cardId,
    type: 'unit',
    cost: 0,
    cost_type: 'gold',
    asset_front: ''
  };

  const [imgError, setImgError] = useState(false);

  // 크기 프리셋 (5:7 비율 철저 준수)
  const sizeClasses = {
    sm: 'w-[90px] h-[126px] text-xs',
    md: 'w-[125px] h-[175px] text-sm',
    lg: 'w-[160px] h-[224px] text-base',
  }[size];

  // 뒷면 이미지 경로 결정
  let backImgPath = CARD_BACKS.player;
  if (card.type === 'event') backImgPath = CARD_BACKS.event;
  if (card.type === 'boss') backImgPath = CARD_BACKS.dragon;

  // 종족 컬러
  const factionColor = card.faction ? FACTION_INFO[card.faction]?.color : '#334155';

  return (
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={clsx(
        'card-container relative transition-all duration-200 select-none cursor-pointer',
        sizeClasses,
        isFlipped && 'is-flipped',
        isSelected && '-translate-y-3 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 rounded-lg shadow-xl shadow-amber-500/30',
        isDisabled && 'opacity-50 cursor-not-allowed filter grayscale',
        !isDisabled && !isSelected && 'hover:-translate-y-1.5 hover:shadow-lg hover:shadow-cyan-500/20'
      )}
    >
      <div className="card-inner w-full h-full">
        {/* 앞면 (Front) */}
        <div className="card-face card-front relative overflow-hidden bg-slate-900 border border-slate-700/80">
          {!imgError && card.asset_front ? (
            <img
              src={card.asset_front}
              alt={card.name_ko}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            // 이미지 부재 또는 로드 실패 시 나타나는 고품질 CSS Fallback 렌더러
            <div
              className="w-full h-full flex flex-col justify-between p-2 text-white relative"
              style={{ backgroundColor: factionColor }}
            >
              {/* 상단: 카드 이름 & 비용 */}
              <div className="flex justify-between items-start gap-1 bg-black/40 backdrop-blur-sm p-1 rounded">
                <span className="font-bold truncate text-[11px] leading-tight">
                  {card.name_ko}
                </span>
                {card.cost > 0 && (
                  <span className="flex items-center text-amber-300 font-extrabold text-[11px] shrink-0">
                    <Coins size={12} className="mr-0.5" />
                    {card.cost}
                  </span>
                )}
              </div>

              {/* 중앙: 타입 및 설명 텍스트 */}
              <div className="my-auto text-center px-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  [{card.type}]
                </div>
                {card.description_ko && (
                  <div className="text-[10px] text-slate-200 leading-tight bg-black/50 p-1 rounded line-clamp-3">
                    {card.description_ko}
                  </div>
                )}
              </div>

              {/* 하단: 전투력 / 영향력 / 골드 수치 뱃지 */}
              <div className="flex justify-between items-center bg-black/60 p-1 rounded text-[11px] font-bold">
                {card.strength !== undefined && (
                  <span className="flex items-center text-rose-400">
                    <Swords size={12} className="mr-0.5" />
                    {card.strength}
                  </span>
                )}
                {card.defense !== undefined && (
                  <span className="flex items-center text-blue-400">
                    <Shield size={12} className="mr-0.5" />
                    {card.defense}
                  </span>
                )}
                {card.gold_value !== undefined && (
                  <span className="flex items-center text-amber-400">
                    <Coins size={12} className="mr-0.5" />
                    +{card.gold_value}
                  </span>
                )}
                {card.influence_value !== undefined && (
                  <span className="flex items-center text-emerald-400">
                    <Shield size={12} className="mr-0.5" />
                    +{card.influence_value}
                  </span>
                )}
                {card.hp !== undefined && (
                  <span className="flex items-center text-red-400">
                    <Heart size={12} className="mr-0.5" />
                    {card.hp}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 추가 뱃지 (수량, 스택 등) */}
          {badge !== undefined && (
            <div className="absolute top-1 right-1 bg-red-600/90 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-white/30">
              {badge}
            </div>
          )}
        </div>

        {/* 뒷면 (Back) */}
        <div className="card-face card-back bg-slate-950 border border-slate-800 flex items-center justify-center">
          <img
            src={backImgPath}
            alt="Card Back"
            className="w-full h-full object-cover"
            onError={(e) => {
              // 뒷면 이미지 에러 시 CSS 플레이스홀더
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="text-slate-500 font-bold text-xs uppercase tracking-widest pointer-events-none absolute">
            RUNE AGE
          </div>
        </div>
      </div>
    </div>
  );
};
