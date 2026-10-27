import React from 'react';
import { CardInstance } from '../types/game';
import { ALL_CARDS } from '../engine/cardDatabase';
import { CardView } from './CardView';

interface FanHandProps {
  hand: CardInstance[];
  onPlayCard: (instanceId: string) => void;
  onHoverCard: (cardId: string | null) => void;
}

export const FanHand: React.FC<FanHandProps> = ({
  hand,
  onPlayCard,
  onHoverCard
}) => {
  const centerIndex = (hand.length - 1) / 2;

  return (
    <div className="relative flex justify-center items-end h-36 sm:h-44 px-4 overflow-visible">
      {hand.length === 0 ? (
        <div className="text-slate-500 text-xs italic mb-8">
          손패가 비었습니다. 턴을 종료하면 5장을 새로 드로우합니다.
        </div>
      ) : (
        <div className="flex justify-center items-end relative w-full max-w-2xl">
          {hand.map((card, idx) => {
            const def = ALL_CARDS[card.definitionId];
            const offset = idx - centerIndex;
            const rotation = offset * 4.5; // 부채꼴 회전 각도
            const translateY = Math.abs(offset) * 6; // 아치형 Y축 오프셋

            // 현재 턴에 사용 가능한 카드인지 판별 (초록색 아웃라인 글로우)
            const isPlayable = def?.type === 'gold' || def?.type === 'unit' || def?.type === 'city';

            return (
              <div
                key={card.instanceId}
                onClick={() => onPlayCard(card.instanceId)}
                onMouseEnter={() => onHoverCard(card.definitionId)}
                onMouseLeave={() => onHoverCard(null)}
                style={{
                  transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                  transformOrigin: 'bottom center',
                  marginLeft: idx === 0 ? 0 : '-28px', // 카드 겹침 효과
                  zIndex: idx + 10
                }}
                className={`transition-all duration-200 cursor-pointer group hover:!z-50 hover:!scale-110 hover:!-translate-y-8`}
              >
                <div
                  className={`relative rounded-lg transition-shadow duration-200 ${
                    isPlayable
                      ? 'ring-2 ring-emerald-400 shadow-xl shadow-emerald-500/40 rounded-lg'
                      : ''
                  }`}
                >
                  <CardView cardId={card.definitionId} size="md" />

                  {/* 카드 종류별 액션 인디케이터 태그 */}
                  {def?.type === 'gold' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      골드 사용
                    </div>
                  )}
                  {def?.type === 'unit' && def.id !== 'unit_latari_storm_sorceress' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      전장 출진
                    </div>
                  )}
                  {def?.id === 'unit_latari_storm_sorceress' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full shadow pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      영향력 +2
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
