import React from 'react';
import { GameState, CardDefinition, CardInstance } from '../types/game';
import { ALL_CARDS, CARD_BACKS, FACTION_INFO } from '../engine/cardDatabase';
import { CardView } from './CardView';
import { Flame, Shield, Swords, Coins, Heart, Skull, Castle } from 'lucide-react';

interface PlaymatFieldProps {
  state: GameState;
  onAttackTarget: (targetType: 'boss' | 'enemy' | 'city', targetId: string) => void;
  onSelectAlly: (instanceId: string) => void;
  onCardHover: (cardId: string | null) => void;
}

export const PlaymatField: React.FC<PlaymatFieldProps> = ({
  state,
  onAttackTarget,
  onSelectAlly,
  onCardHover
}) => {
  const factionInfo = FACTION_INFO[state.playerFaction];
  const hasReadyAllies = state.fieldAllies.some(a => a.canAttack && !a.hasAttacked);

  return (
    <div className="flex-1 flex flex-col justify-between p-2 min-h-0 overflow-y-auto select-none relative">
      {/* ========================================================
          1. 상단 매트: 적 / 시나리오 (용군주의 부활) 영역
          ======================================================== */}
      <section className="bg-slate-900/90 border border-cyan-900/60 rounded-2xl p-2.5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* 매트 테마 배경 워터마크 */}
        <div className="absolute top-2 right-4 text-[10px] uppercase tracking-widest text-cyan-500/40 font-bold pointer-events-none">
          Dragonlord Territory • Threat Zone
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* [DECK]: 이벤트 덱 */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">이벤트 덱</span>
            <div
              className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-lg overflow-hidden border border-amber-900/80 shadow-md cursor-pointer hover:border-amber-500"
              onMouseEnter={() => onCardHover('event_dragon_spawn')}
              onMouseLeave={() => onCardHover(null)}
            >
              <img
                src={CARD_BACKS.event}
                alt="Event Deck"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="absolute bottom-1 right-1 bg-black/80 text-amber-400 font-black text-xs px-1.5 py-0.5 rounded">
                {state.eventDeck.length}
              </span>
            </div>
          </div>

          {/* [HERO]: 고대 드래곤 로드 (최종 보스) */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[10px] text-red-400 font-extrabold uppercase mb-0.5 flex items-center gap-1">
              <Flame size={12} className="text-red-500 animate-pulse" /> 보스 드래곤
            </span>
            <div
              onClick={() => hasReadyAllies && onAttackTarget('boss', state.bossDragon.definitionId)}
              onMouseEnter={() => onCardHover(state.bossDragon.definitionId)}
              onMouseLeave={() => onCardHover(null)}
              className={`relative cursor-pointer transition-transform duration-200 ${
                hasReadyAllies ? 'hover:scale-105 ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950 rounded-lg' : ''
              }`}
            >
              <CardView cardId={state.bossDragon.definitionId} size="sm" />
              {/* 보스 체력 게이지 오버레이 */}
              <div className="absolute bottom-0 inset-x-0 bg-black/80 p-1 rounded-b-lg">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-red-900">
                  <div
                    className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
                    style={{ width: `${(state.bossDragon.hp / state.bossDragon.maxHp) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-center font-black text-white mt-0.5">
                  HP {state.bossDragon.hp}/{state.bossDragon.maxHp}
                </div>
              </div>
            </div>
          </div>

          {/* [ALLIES]: 출현한 적 몬스터/위협들 */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[110px] border border-red-900/30 rounded-xl bg-red-950/20 px-3 py-1">
            <span className="text-[10px] text-rose-300/80 font-bold uppercase mb-1">
              위협 슬롯 ({state.enemyAllies.length})
            </span>
            {state.enemyAllies.length === 0 ? (
              <div className="text-slate-500 text-xs italic py-4">
                현재 전장에 위협이 없습니다.
              </div>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto justify-center max-w-full py-1">
                {state.enemyAllies.map((enemy, idx) => (
                  <div
                    key={`${enemy.id}_${idx}`}
                    onClick={() => hasReadyAllies && onAttackTarget('enemy', enemy.id)}
                    onMouseEnter={() => onCardHover(enemy.id)}
                    onMouseLeave={() => onCardHover(null)}
                    className={`relative cursor-pointer transition-transform duration-200 ${
                      hasReadyAllies ? 'hover:scale-105 ring-2 ring-rose-500 rounded-lg' : ''
                    }`}
                  >
                    <CardView cardId={enemy.id} size="sm" />
                    <div className="absolute top-1 left-1 bg-red-700 text-white text-[10px] font-black px-1.5 py-0.2 rounded shadow">
                      방어 {enemy.defense}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* [SUPPORT / MARKET]: 중립 도시들 (점령 대상) */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[10px] text-blue-400 font-bold uppercase mb-0.5 flex items-center gap-1">
              <Castle size={12} /> 중립 도시
            </span>
            <div className="flex gap-1.5 overflow-x-auto max-w-[200px] py-0.5">
              {state.marketCities.map(cityId => (
                <div
                  key={cityId}
                  onClick={() => hasReadyAllies && onAttackTarget('city', cityId)}
                  onMouseEnter={() => onCardHover(cityId)}
                  onMouseLeave={() => onCardHover(null)}
                  className={`cursor-pointer transition-transform ${hasReadyAllies ? 'hover:scale-105 hover:ring-2 hover:ring-blue-400 rounded-lg' : ''}`}
                >
                  <CardView cardId={cityId} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* [GRAVEYARD]: 격퇴된 이벤트 더미 */}
          <div className="flex flex-col items-center shrink-0 hidden sm:flex">
            <span className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">격퇴 무덤</span>
            <div className="w-14 h-20 rounded-lg border border-slate-800 bg-slate-950/80 flex flex-col items-center justify-center text-slate-600">
              <Skull size={16} />
              <span className="text-[10px] font-bold mt-1">{state.eventDiscard.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          중앙: 전투 배너 및 피드백 알림 (Floating Banner)
          ======================================================== */}
      {state.combatBanner && (
        <div className="my-1 flex justify-center items-center pointer-events-none">
          <div className="bg-gradient-to-r from-amber-600/90 via-red-600/90 to-amber-600/90 text-white font-black text-sm px-5 py-1.5 rounded-full shadow-2xl border border-amber-300 animate-bounce">
            {state.combatBanner}
          </div>
        </div>
      )}

      {/* ========================================================
          2. 하단 매트: 플레이어 진영 영역
          ======================================================== */}
      <section className="bg-slate-900/90 border border-amber-900/50 rounded-2xl p-2.5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-2 right-4 text-[10px] uppercase tracking-widest text-amber-500/40 font-bold pointer-events-none">
          {factionInfo.name_ko} 영토 • Command Battlefield
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* [DECK]: 플레이어 덱 */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[10px] text-cyan-400 font-bold uppercase mb-0.5">내 덱</span>
            <div className="relative w-16 h-22 sm:w-20 sm:h-28 rounded-lg overflow-hidden border border-cyan-800/80 shadow-md">
              <img
                src={CARD_BACKS.player}
                alt="Player Deck"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="absolute bottom-1 right-1 bg-black/80 text-cyan-400 font-black text-xs px-1.5 py-0.5 rounded">
                {state.deck.length}
              </span>
            </div>
          </div>

          {/* [HERO]: 수도 홈 렐름 카드 (체력 20) */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase mb-0.5 flex items-center gap-1">
              <Heart size={12} className="text-red-500 fill-red-500" /> 수도 렐름
            </span>
            <div
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onMouseEnter={() => onCardHover(state.playerFaction + '_realm')}
              onMouseLeave={() => onCardHover(null)}
            >
              <CardView cardId={state.playerFaction + '_realm'} size="sm" />
              <div className="absolute bottom-0 inset-x-0 bg-black/85 p-1 rounded-b-lg">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-red-500 h-full transition-all duration-300"
                    style={{ width: `${(state.homeRealmHp / state.maxHomeRealmHp) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-center font-black text-white mt-0.5">
                  HP {state.homeRealmHp}/{state.maxHomeRealmHp}
                </div>
              </div>
            </div>
          </div>

          {/* [ALLIES]: 아군 전장 (손패에서 출진한 군대 유닛들) */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[110px] border border-amber-900/30 rounded-xl bg-amber-950/20 px-3 py-1">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] text-amber-300/80 font-bold uppercase">
                전장 아군 유닛 ({state.fieldAllies.length})
              </span>
              {hasReadyAllies && (
                <span className="text-[10px] text-emerald-400 font-black animate-pulse">
                  ⚔️ 공격 가능 상태 (적을 클릭하거나 ALL ATTACK)
                </span>
              )}
            </div>

            {state.fieldAllies.length === 0 ? (
              <div className="text-slate-500 text-xs italic py-4">
                손패에서 유닛을 전장으로 출진시키십시오.
              </div>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto justify-center max-w-full py-1">
                {state.fieldAllies.map(ally => {
                  const isReady = ally.canAttack && !ally.hasAttacked;
                  return (
                    <div
                      key={ally.instanceId}
                      onClick={() => onSelectAlly(ally.instanceId)}
                      onMouseEnter={() => onCardHover(ally.definitionId)}
                      onMouseLeave={() => onCardHover(null)}
                      className={`relative transition-all duration-200 cursor-pointer ${
                        isReady
                          ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/40 -translate-y-1'
                          : 'opacity-60 filter grayscale-[40%]'
                      }`}
                    >
                      <CardView cardId={ally.definitionId} size="sm" />
                      {/* 공격력 뱃지 */}
                      <div className="absolute top-1 left-1 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded shadow">
                        공격력 {ALL_CARDS[ally.definitionId]?.strength}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* [SUPPORT]: 점령한 도시/요새 구역 */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[10px] text-emerald-400 font-bold uppercase mb-0.5 flex items-center gap-1">
              <Shield size={12} /> 지원 영토 ({state.supportZone.length})
            </span>
            <div className="flex gap-1.5 overflow-x-auto max-w-[180px] py-0.5">
              {state.supportZone.length === 0 ? (
                <div className="w-14 h-20 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500 text-center p-1">
                  점령지 없음
                </div>
              ) : (
                state.supportZone.map((sup, idx) => (
                  <div
                    key={`${sup.id}_${idx}`}
                    onMouseEnter={() => onCardHover(sup.id)}
                    onMouseLeave={() => onCardHover(null)}
                  >
                    <CardView cardId={sup.id} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* [GRAVEYARD & RESOURCES] */}
          <div className="flex flex-col items-center shrink-0 gap-2">
            {/* 자원 풀 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded shadow text-amber-300 font-black text-xs">
                <Coins size={14} />
                <span>{state.goldPool} G</span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded shadow text-emerald-300 font-black text-xs">
                <Shield size={14} />
                <span>영향력 {state.influencePool}</span>
              </div>
            </div>

            {/* 버린 카드 더미 */}
            <div className="w-12 h-14 rounded-lg border border-slate-800 bg-slate-950/90 flex flex-col items-center justify-center text-slate-500 text-[10px] font-bold">
              <span>버림</span>
              <span className="text-slate-200">{state.discard.length}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
