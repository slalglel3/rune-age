import React from 'react';
import { CardView } from './CardView';
import { ALL_CARDS } from '../engine/cardDatabase';
import { Coins, Swords } from 'lucide-react';

interface MarketBoardProps {
  goldPool: number;
  marketStock: { gold_1: number; gold_2: number; gold_3: number };
  marketCities: string[];
  onBuyCard: (cardId: string) => void;
  onAttackCity: (cityId: string) => void;
  isCombatPhase: boolean;
}

export const MarketBoard: React.FC<MarketBoardProps> = ({
  goldPool,
  marketStock,
  marketCities,
  onBuyCard,
  onAttackCity,
  isCombatPhase
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col gap-3">
      {/* 골드 마켓 */}
      <div>
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm mb-2">
          <Coins size={16} />
          <span>공용 골드 시장</span>
        </div>
        <div className="flex gap-2 justify-center">
          {(['gold_1', 'gold_2', 'gold_3'] as const).map(goldId => {
            const card = ALL_CARDS[goldId];
            const stock = marketStock[goldId];
            const canAfford = goldPool >= card.cost && stock > 0;

            return (
              <div key={goldId} className="flex flex-col items-center gap-1">
                <CardView
                  cardId={goldId}
                  size="sm"
                  badge={`x${stock}`}
                  isDisabled={stock <= 0}
                  onClick={() => canAfford && onBuyCard(goldId)}
                />
                <button
                  onClick={() => onBuyCard(goldId)}
                  disabled={!canAfford}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition ${
                    canAfford
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
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

      <hr className="border-slate-800" />

      {/* 중립 도시 마켓 */}
      <div>
        <div className="flex items-center gap-1.5 text-blue-400 font-bold text-sm mb-2">
          <Swords size={16} />
          <span>점령 가능한 중립 도시</span>
        </div>
        {marketCities.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-2">
            모든 중립 도시가 점령되었습니다!
          </div>
        ) : (
          <div className="flex gap-2 justify-center flex-wrap">
            {marketCities.map(cityId => {
              const card = ALL_CARDS[cityId];
              return (
                <div key={cityId} className="flex flex-col items-center gap-1">
                  <CardView cardId={cityId} size="sm" />
                  <button
                    onClick={() => onAttackCity(cityId)}
                    disabled={isCombatPhase}
                    className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-700 hover:bg-blue-600 text-white transition disabled:opacity-50"
                  >
                    공격 (방어{card.defense})
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
