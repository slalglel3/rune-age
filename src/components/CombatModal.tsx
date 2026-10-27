import React from 'react';
import { CombatTarget, CardInstance } from '../types/game';
import { ALL_CARDS } from '../engine/cardDatabase';
import { CardView } from './CardView';
import { Swords, X, Check } from 'lucide-react';

interface CombatModalProps {
  combat: CombatTarget;
  hand: CardInstance[];
  selectedUnitIds: string[];
  onToggleUnit: (instanceId: string) => void;
  onResolveCombat: () => void;
  onCancelCombat: () => void;
}

export const CombatModal: React.FC<CombatModalProps> = ({
  combat,
  hand,
  selectedUnitIds,
  onToggleUnit,
  onResolveCombat,
  onCancelCombat
}) => {
  // 손패의 유닛 카드만 필터링
  const unitCardsInHand = hand.filter(c => ALL_CARDS[c.definitionId]?.type === 'unit');

  // 현재 투입된 총 공격력 계산
  let currentAttack = 0;
  selectedUnitIds.forEach(id => {
    const card = hand.find(c => c.instanceId === id);
    if (card) {
      currentAttack += ALL_CARDS[card.definitionId]?.strength || 0;
    }
  });

  const isSuccessExpected = currentAttack >= combat.requiredStrength;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-red-500/80 rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-lg">
            <Swords size={22} />
            <span>전투 선언: {combat.name}</span>
          </div>
          <button
            onClick={onCancelCombat}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* 목표 정보 및 수치 비교 박스 */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardView cardId={combat.targetId} size="sm" />
            <div>
              <div className="text-xs text-slate-400">공격 대상</div>
              <div className="font-bold text-white text-base">{combat.name}</div>
              <div className="text-xs text-amber-400 mt-1">{combat.rewardText}</div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-xs text-slate-400">필요 공격력</div>
            <div className="text-2xl font-black text-rose-500">{combat.requiredStrength}</div>
            <div className="text-xs mt-1">
              내 공격력: <span className={isSuccessExpected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{currentAttack}</span>
            </div>
          </div>
        </div>

        {/* 손패에서 참전할 유닛 선택 */}
        <div>
          <div className="text-sm font-bold text-slate-300 mb-2">
            전투에 투입할 유닛 선택 (손패):
          </div>
          {unitCardsInHand.length === 0 ? (
            <div className="bg-red-950/40 border border-red-900/50 rounded-lg p-3 text-center text-xs text-red-300">
              손패에 사용할 수 있는 유닛 카드가 없습니다!
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {unitCardsInHand.map(card => {
                const isSelected = selectedUnitIds.includes(card.instanceId);
                return (
                  <CardView
                    key={card.instanceId}
                    cardId={card.definitionId}
                    size="sm"
                    isSelected={isSelected}
                    onClick={() => onToggleUnit(card.instanceId)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onCancelCombat}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
          >
            취소
          </button>
          <button
            onClick={onResolveCombat}
            disabled={selectedUnitIds.length === 0}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition ${
              isSuccessExpected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Check size={16} />
            <span>돌격 (공격력 {currentAttack})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
