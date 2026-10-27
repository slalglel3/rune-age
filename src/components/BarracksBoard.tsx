import React from 'react';
import { CardView } from './CardView';
import { ALL_CARDS, FACTION_INFO, FACTION_UNITS } from '../engine/cardDatabase';
import { FactionId } from '../types/game';
import { ShieldAlert } from 'lucide-react';

interface BarracksBoardProps {
  faction: FactionId;
  goldPool: number;
  barracksStock: Record<string, number>;
  onBuyUnit: (unitId: string) => void;
}

export const BarracksBoard: React.FC<BarracksBoardProps> = ({
  faction,
  goldPool,
  barracksStock,
  onBuyUnit
}) => {
  const factionUnits = FACTION_UNITS[faction];
  const info = FACTION_INFO[faction];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-slate-200 font-bold text-sm">
          <ShieldAlert size={16} style={{ color: info.color }} />
          <span>{info.name_ko} 병영 (군대 징집)</span>
        </div>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {factionUnits.map(unitId => {
          const card = ALL_CARDS[unitId];
          const stock = barracksStock[unitId] || 0;
          const canAfford = goldPool >= card.cost && stock > 0;

          return (
            <div key={unitId} className="flex flex-col items-center gap-1">
              <CardView
                cardId={unitId}
                size="sm"
                badge={`x${stock}`}
                isDisabled={stock <= 0}
                onClick={() => canAfford && onBuyUnit(unitId)}
              />
              <button
                onClick={() => onBuyUnit(unitId)}
                disabled={!canAfford}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded transition ${
                  canAfford
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                징집 ({card.cost}G)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
