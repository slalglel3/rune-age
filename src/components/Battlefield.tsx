import React from 'react';
import { CardDefinition, CardInstance, CombatTarget } from '../types/game';
import { CardView } from './CardView';
import { ALL_CARDS } from '../engine/cardDatabase';
import { Flame, Swords, ShieldCheck } from 'lucide-react';

interface BattlefieldProps {
  bossDragon: {
    definitionId: string;
    hp: number;
    maxHp: number;
    strength: number;
    isDefeated: boolean;
  };
  currentThreat: CardDefinition | null;
  playedCards: CardInstance[];
  controlledCities: string[];
  onSelectCombatTarget: (target: CombatTarget) => void;
  isCombatActive: boolean;
}

export const Battlefield: React.FC<BattlefieldProps> = ({
  bossDragon,
  currentThreat,
  playedCards,
  controlledCities,
  onSelectCombatTarget,
  isCombatActive
}) => {
  const bossDef = ALL_CARDS[bossDragon.definitionId];

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto p-3">
      {/* 1. 상단: 고대 드래곤 로드 보스 배너 */}
      <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border border-red-700/60 rounded-2xl p-3 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CardView cardId={bossDragon.definitionId} size="sm" />
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
              <Flame size={18} className="text-red-500 animate-pulse" />
              <span>최종 목표: {bossDef?.name_ko || '고대 드래곤 로드'}</span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              드래곤을 쓰러뜨려 테리노스를 구원하십시오!
            </div>
            {/* 드래곤 HP 바 */}
            <div className="w-48 sm:w-64 bg-slate-950 rounded-full h-3.5 mt-2 border border-red-900/60 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(bossDragon.hp / bossDragon.maxHp) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                HP {bossDragon.hp} / {bossDragon.maxHp}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            onSelectCombatTarget({
              type: 'boss',
              targetId: bossDragon.definitionId,
              name: bossDef?.name_ko || '고대 드래곤 로드',
              requiredStrength: 1, // 누적 피해 가능
              currentStrength: 0,
              rewardText: '누적 데미지 입히기'
            })
          }
          disabled={isCombatActive || bossDragon.isDefeated}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-700/30 transition disabled:opacity-40"
        >
          <Swords size={16} />
          <span>보스 공략</span>
        </button>
      </div>

      {/* 2. 중앙 교전 구역 (활성 위협 vs 이번 턴 사용 카드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* 좌측: 활성화된 시나리오 위협 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <Flame size={14} /> 현재 출현한 위협
            </span>
            {currentThreat && (
              <span className="text-[11px] text-slate-400">
                격퇴하지 못하면 턴 종료 시 공격당함!
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[140px]">
            {currentThreat ? (
              <div className="flex items-center gap-3">
                <CardView cardId={currentThreat.id} size="md" />
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-bold text-white">{currentThreat.name_ko}</div>
                  <div className="text-xs text-rose-300">필요 공격력: {currentThreat.defense}</div>
                  <button
                    onClick={() =>
                      onSelectCombatTarget({
                        type: 'event',
                        targetId: currentThreat.id,
                        name: currentThreat.name_ko,
                        requiredStrength: currentThreat.defense || 2,
                        currentStrength: 0,
                        rewardText: '위협 제거'
                      })
                    }
                    disabled={isCombatActive}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition"
                  >
                    <Swords size={14} />
                    <span>위협 토벌</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 text-xs py-4">
                현재 출현한 위협이 없습니다. 평온합니다.
              </div>
            )}
          </div>
        </div>

        {/* 우측: 이번 턴에 플레이한 카드 (전장 배치) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col">
          <div className="text-xs font-bold text-slate-400 mb-2">
            이번 턴에 사용된 카드 ({playedCards.length}장)
          </div>
          <div className="flex-1 flex items-center justify-center overflow-x-auto min-h-[140px]">
            {playedCards.length === 0 ? (
              <div className="text-center text-slate-500 text-xs">
                손패에서 골드를 사용하거나 전투를 선언하세요.
              </div>
            ) : (
              <div className="flex gap-2">
                {playedCards.map(c => (
                  <CardView key={c.instanceId} cardId={c.definitionId} size="sm" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. 하단: 점령한 도시/영토 (영향력 원천) */}
      {controlledCities.length > 0 && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 shrink-0">
            <ShieldCheck size={14} /> 점령 영토:
          </span>
          <div className="flex gap-2 overflow-x-auto">
            {controlledCities.map((cityId, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full border border-slate-700 font-semibold"
              >
                {ALL_CARDS[cityId]?.name_ko}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
