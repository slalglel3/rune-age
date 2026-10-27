import React from 'react';
import { CardInstance } from '../types/game';
import { CardView } from './CardView';
import { ALL_CARDS } from '../engine/cardDatabase';
import { Coins, CheckCircle, Store, Shield } from 'lucide-react';

interface PlayerHandProps {
  hand: CardInstance[];
  onPlayCard: (instanceId: string) => void;
  onPlayAllGold: () => void;
  onEndTurn: () => void;
  onToggleMarketDrawer: () => void;
  onToggleBarracksDrawer: () => void;
  isCombatActive: boolean;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  hand,
  onPlayCard,
  onPlayAllGold,
  onEndTurn,
  onToggleMarketDrawer,
  onToggleBarracksDrawer,
  isCombatActive
}) => {
  const hasGoldInHand = hand.some(c => ALL_CARDS[c.definitionId]?.type === 'gold');

  return (
    <footer className="bg-slate-950/95 border-t border-slate-800 p-2.5 flex flex-col gap-2 shrink-0 shadow-2xl">
      {/* 상단: 액션 툴바 */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {/* 모든 골드 일괄 사용 버튼 */}
          <button
            onClick={onPlayAllGold}
            disabled={!hasGoldInHand || isCombatActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Coins size={15} />
            <span>골드 일괄 사용</span>
          </button>

          {/* 모바일 뷰 전용 드로어 토글 버튼 */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <button
              onClick={onToggleMarketDrawer}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs transition"
            >
              <Store size={14} />
              <span>상점</span>
            </button>
            <button
              onClick={onToggleBarracksDrawer}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition"
            >
              <Shield size={14} />
              <span>병영</span>
            </button>
          </div>
        </div>

        {/* 턴 종료 버튼 */}
        <button
          onClick={onEndTurn}
          disabled={isCombatActive}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition disabled:opacity-40"
        >
          <CheckCircle size={16} />
          <span>턴 종료 (새로 5장 드로우)</span>
        </button>
      </div>

      {/* 하단: 손패 카드 리스트 */}
      <div className="flex gap-2 justify-center overflow-x-auto py-1 min-h-[140px] items-center">
        {hand.length === 0 ? (
          <div className="text-slate-500 text-xs italic py-4">
            손패가 비어 있습니다. (턴을 종료하면 5장을 새로 뽑습니다)
          </div>
        ) : (
          hand.map(card => {
            const def = ALL_CARDS[card.definitionId];
            const isGold = def?.type === 'gold';
            const isUnit = def?.type === 'unit';
            const hasSpecialAbility = isUnit && !!def?.influence_value;

            return (
              <div key={card.instanceId} className="flex flex-col items-center gap-1 shrink-0">
                <CardView
                  cardId={card.definitionId}
                  size="md"
                  onClick={() => {
                    if (isGold || hasSpecialAbility) onPlayCard(card.instanceId);
                  }}
                />
                {isGold && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-900/60">
                    클릭하여 사용
                  </span>
                )}
                {hasSpecialAbility && (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/90 px-1.5 py-0.2 rounded border border-emerald-800/80 animate-pulse">
                    클릭: 영향력 +{def.influence_value} (버려짐)
                  </span>
                )}
                {isUnit && !hasSpecialAbility && (
                  <span className="text-[10px] text-rose-300 font-semibold bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-900/60">
                    전투 대기
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </footer>
  );
};
