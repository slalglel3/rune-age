import React from 'react';
import { ALL_CARDS } from '../engine/cardDatabase';
import { CardView } from './CardView';
import { Coins, Castle, Swords } from 'lucide-react';

interface Props {
  goldPool: number;
  marketGoldStock: { gold_1: number; gold_2: number; gold_3: number };
  marketCities: string[];
  hasReadyAllies: boolean;
  onBuyCard: (cardId: string) => void;
  onAttackCity: (cityId: string) => void;
  onCardHover: (cardId: string | null) => void;
}

export const NeutralMarketPanel: React.FC<Props> = ({
  goldPool,
  marketGoldStock,
  marketCities,
  hasReadyAllies,
  onBuyCard,
  onAttackCity,
  onCardHover
}) => {
  return (
    <div className="h-full w-full bg-slate-900/95 border-2 border-amber-600/70 rounded-3xl p-3 shadow-2xl flex flex-col justify-start gap-3 backdrop-blur-md overflow-y-auto">
      {/* 상단: 공용 골드 시장 */}
      <div>
        <div className="flex items-center justify-between text-amber-400 font-black text-xs uppercase tracking-wider mb-2 border-b border-amber-800/50 pb-1">
          <div className="flex items-center gap-1.5">
            <Coins size={16} />
            <span>공용 골드 시장</span>
          </div>
          <span className="text-[10px] text-amber-300/70 lowercase font-mono">1-click buy</span>
        </div>

        <div className="flex gap-2.5 justify-center flex-wrap">
          {(['gold_1', 'gold_2', 'gold_3'] as const).map(goldId => {
            const card = ALL_CARDS[goldId];
            const stock = marketGoldStock[goldId];
            const canAfford = goldPool >= card.cost && stock > 0;

            return (
              <div key={goldId} className="flex flex-col items-center gap-1">
                <div
                  onClick={() => canAfford && onBuyCard(goldId)}
                  onMouseEnter={() => onCardHover(goldId)}
                  onMouseLeave={() => onCardHover(null)}
                  className={`relative rounded-2xl overflow-hidden card-3d-elevation cursor-pointer transition-all ${
                    canAfford ? 'ring-2 ring-amber-400 hover:scale-105' : 'opacity-60'
                  }`}
                >
                  <CardView cardId={goldId} size="sm" badge={`x${stock}`} isDisabled={stock <= 0} />
                </div>
                <button
                  onClick={() => onBuyCard(goldId)}
                  disabled={!canAfford}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow transition ${
                    canAfford
                      ? 'bg-amber-600 hover:bg-amber-500 text-white font-extrabold shadow-amber-600/40'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  구매 ({card.cost}G)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="my-1 border-t border-dashed border-amber-700/40" />

      {/* 하단: 중립 도시 시장 */}
      <div>
        <div className="flex items-center justify-between text-blue-400 font-black text-xs uppercase tracking-wider mb-2 border-b border-blue-800/50 pb-1">
          <div className="flex items-center gap-1.5">
            <Castle size={16} />
            <span>점령 가능한 중립 도시</span>
          </div>
          <span className="text-[10px] text-blue-300/70 lowercase font-mono">attack to siege</span>
        </div>

        {marketCities.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-4 italic font-semibold">
            모든 중립 도시가 점령되었습니다!
          </div>
        ) : (
          <div className="flex gap-2.5 justify-center flex-wrap">
            {marketCities.map(cityId => {
              const card = ALL_CARDS[cityId];
              return (
                <div key={cityId} className="flex flex-col items-center gap-1">
                  <div
                    onClick={() => hasReadyAllies && onAttackCity(cityId)}
                    onMouseEnter={() => onCardHover(cityId)}
                    onMouseLeave={() => onCardHover(null)}
                    className={`relative rounded-2xl overflow-hidden card-3d-elevation cursor-pointer transition-all ${
                      hasReadyAllies ? 'ring-2 ring-blue-400 hover:scale-105' : 'border border-blue-900/60'
                    }`}
                  >
                    <CardView cardId={cityId} size="sm" />
                    <div className="absolute top-1.5 left-1.5 bg-blue-700/90 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow border border-blue-400">
                      방어 {card.defense}
                    </div>
                  </div>
                  <button
                    onClick={() => onAttackCity(cityId)}
                    disabled={!hasReadyAllies}
                    className={`flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-lg shadow transition ${
                      hasReadyAllies
                        ? 'bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-blue-600/40'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Swords size={12} />
                    <span>공격</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
