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
  isLandscape?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  badge?: string | number;
}

export const CardView: React.FC<CardViewProps> = ({
  cardId,
  isFlipped = false,
  isSelected = false,
  isDisabled = false,
  isLandscape = false,
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

  // 2배 대폭 확대된 5:7(세로) 및 7:5(가로) 고화질 규격
  const sizeClasses = isLandscape
    ? {
        sm: 'w-[205px] h-[146px] text-xs',
        md: 'w-[265px] h-[190px] text-sm',
        lg: 'w-[340px] h-[242px] text-base',
      }[size]
    : {
        sm: 'w-[146px] h-[205px] text-xs',
        md: 'w-[190px] h-[265px] text-sm',
        lg: 'w-[242px] h-[340px] text-base',
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
        'card-container relative transition-all duration-200 select-none cursor-pointer shrink-0',
        sizeClasses,
        isFlipped && 'is-flipped',
        isSelected && '-translate-y-3 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 rounded-2xl shadow-2xl shadow-amber-500/50',
        isDisabled && 'opacity-50 cursor-not-allowed filter grayscale',
        !isDisabled && !isSelected && 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/30'
      )}
    >
      <div className="card-inner w-full h-full">
        {/* 앞면 (Front) */}
        <div className="card-face card-front relative overflow-hidden bg-slate-900 border-2 border-slate-700/80 rounded-2xl shadow-xl">
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
              className="w-full h-full flex flex-col justify-between p-3 text-white relative"
              style={{ backgroundColor: factionColor }}
            >
              {/* 상단: 카드 이름 & 비용 */}
              <div className="flex justify-between items-start gap-1 bg-black/65 backdrop-blur-sm p-1.5 rounded-xl border border-white/10">
                <span className="font-extrabold truncate text-xs sm:text-sm leading-tight text-white drop-shadow">
                  {card.name_ko}
                </span>
                {card.cost > 0 && (
                  <span className="flex items-center text-amber-300 font-black text-xs shrink-0 bg-amber-950/80 px-1.5 py-0.5 rounded-lg border border-amber-500/50">
                    <Coins size={13} className="mr-0.5 text-amber-400" />
                    {card.cost}
                  </span>
                )}
              </div>

              {/* 중앙: 카드 일러스트 대체 영역 & 스탯 */}
              <div className="flex-1 flex flex-col items-center justify-center my-1 bg-black/35 rounded-xl border border-white/10 p-2">
                <span className="text-[11px] font-semibold text-slate-300 text-center line-clamp-2">
                  {card.name_en}
                </span>

                <div className="flex items-center gap-2 mt-2">
                  {card.strength !== undefined && (
                    <div className="flex items-center gap-1 bg-red-600/90 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
                      <Swords size={13} />
                      <span>{card.strength}</span>
                    </div>
                  )}
                  {card.defense !== undefined && (
                    <div className="flex items-center gap-1 bg-blue-600/90 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
                      <Shield size={13} />
                      <span>{card.defense}</span>
                    </div>
                  )}
                  {card.gold_value !== undefined && (
                    <div className="flex items-center gap-1 bg-amber-500/90 text-slate-950 font-black text-xs px-2 py-0.5 rounded-lg shadow">
                      <Coins size={13} />
                      <span>+{card.gold_value}</span>
                    </div>
                  )}
                  {card.influence_value !== undefined && (
                    <div className="flex items-center gap-1 bg-emerald-500/90 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
                      <Shield size={13} />
                      <span>+{card.influence_value}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 하단: 특수 능력 텍스트 */}
              {card.description_ko && (
                <div className="bg-black/75 backdrop-blur-sm p-1.5 rounded-xl text-[10px] text-slate-200 line-clamp-2 leading-tight border border-white/10 font-medium">
                  {card.description_ko}
                </div>
              )}
            </div>
          )}

          {/* 수량 또는 카운트 뱃지 (우상단) */}
          {badge !== undefined && (
            <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full shadow-lg border border-amber-300 pointer-events-none z-10 animate-bounce">
              {badge}
            </div>
          )}
        </div>

        {/* 뒷면 (Back) */}
        <div className="card-face card-back relative overflow-hidden bg-slate-950 border-2 border-slate-700/80 rounded-2xl shadow-xl">
          <img
            src={backImgPath}
            alt="Card Back"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-2 bg-slate-950/60">
            <span className="text-xs font-black text-amber-400 tracking-widest uppercase text-center border-2 border-amber-500/50 px-3 py-1.5 rounded-xl bg-slate-900/90 shadow">
              Rune Age
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
