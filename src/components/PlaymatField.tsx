import React from 'react';
import { GameState } from '../types/game';
import { LayoutConfig, LayoutKey, ElementLayout } from '../types/layout';
import { ALL_CARDS, CARD_BACKS, FACTION_INFO, FACTION_UNITS } from '../engine/cardDatabase';
import { CardView } from './CardView';
import { ResizableDraggableWrapper } from './ResizableDraggableWrapper';
import { NeutralMarketPanel } from './NeutralMarketPanel';
import { FanHand } from './FanHand';
import { DynamicActionButtons } from './DynamicActionButtons';
import { Flame, Shield, Heart, Skull, Coins, Swords } from 'lucide-react';

interface PlaymatFieldProps {
  state: GameState;
  layoutConfig: LayoutConfig;
  isEditMode: boolean;
  onUpdateElementLayout: (key: LayoutKey, newLayout: ElementLayout) => void;
  onAttackTarget: (targetType: 'boss' | 'enemy' | 'city', targetId: string) => void;
  onSelectAlly: (instanceId: string) => void;
  onCardHover: (cardId: string | null) => void;
  onBuyUnit: (unitId: string) => void;
  onBuyMarketCard: (cardId: string) => void;
  onPlayHandCard: (instanceId: string) => void;
  onEndTurn: () => void;
}

export const PlaymatField: React.FC<PlaymatFieldProps> = ({
  state,
  layoutConfig,
  isEditMode,
  onUpdateElementLayout,
  onAttackTarget,
  onSelectAlly,
  onCardHover,
  onBuyUnit,
  onBuyMarketCard,
  onPlayHandCard,
  onEndTurn
}) => {
  const factionInfo = FACTION_INFO[state.playerFaction];
  const factionUnits = FACTION_UNITS[state.playerFaction];
  const hasReadyAllies = state.fieldAllies.some(a => a.canAttack && !a.hasAttacked);

  const elements = layoutConfig.elements;

  return (
    <div className="tabletop-stage-container w-full h-full overflow-auto relative bg-slate-950 select-none">
      {/* 2D/3D 통합 무대 (모든 UI 요소가 100% 독립된 절대좌표로 개별 조작됨) */}
      <div
        style={{
          transform: layoutConfig.tiltAngle > 0 ? `perspective(1400px) rotateX(${layoutConfig.tiltAngle}deg)` : 'none',
          transformOrigin: '50% 50%',
          transition: 'transform 0.2s ease-out'
        }}
        className="relative w-[1900px] h-[980px] min-w-[1900px] min-h-[980px] mx-auto"
      >

        {/* ========================================================
            [1. 상단 적진 매트 / 영역] (enemyMat)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="enemyMat"
          label="상단 적진 영역"
          layout={elements.enemyMat}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('enemyMat', nl)}
          defaultZIndex={5}
        >
          <div className="w-full h-full relative rounded-3xl p-3 shadow-2xl border-2 border-cyan-800/80 bg-gradient-to-b from-slate-950 via-slate-900/95 to-cyan-950/70 backdrop-blur-md flex items-center justify-between gap-3 overflow-hidden">
            <div className="absolute top-1.5 right-4 text-[10px] font-black tracking-widest text-cyan-400/30 uppercase pointer-events-none">
              TERRINOTH • DRAGON THREAT ZONE
            </div>

            {/* 좌측: 보스 드래곤 + 이벤트 덱 */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-red-400 font-black tracking-wider uppercase mb-0.5 flex items-center gap-1">
                  <Flame size={12} className="text-red-500 animate-pulse" /> BOSS HERO
                </span>
                <div
                  onClick={() => hasReadyAllies && onAttackTarget('boss', state.bossDragon.definitionId)}
                  onMouseEnter={() => onCardHover(state.bossDragon.definitionId)}
                  onMouseLeave={() => onCardHover(null)}
                  className={`relative rounded-2xl overflow-hidden card-3d-elevation cursor-pointer transition-all ${
                    hasReadyAllies
                      ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-slate-950 animate-pulse scale-105'
                      : 'border-2 border-red-800/80'
                  }`}
                >
                  <CardView cardId={state.bossDragon.definitionId} size="md" isLandscape={true} />
                  <div className="absolute bottom-0 inset-x-0 bg-black/90 p-1 rounded-b-2xl border-t border-red-900/80">
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

              <div className="flex flex-col items-center">
                <span className="text-[10px] text-cyan-300 font-extrabold tracking-wider uppercase mb-0.5">
                  EVENT DECK
                </span>
                <div
                  className="relative w-22 h-32 sm:w-26 sm:h-38 rounded-2xl overflow-hidden border-2 border-cyan-600/70 shadow-2xl card-3d-elevation cursor-pointer"
                  onMouseEnter={() => onCardHover('event_dragon_spawn')}
                  onMouseLeave={() => onCardHover(null)}
                >
                  <img
                    src={CARD_BACKS.event}
                    alt="Event Deck"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/90 text-amber-400 font-black text-xs px-2 py-0.5 rounded shadow border border-amber-500/40">
                    {state.eventDeck.length}
                  </div>
                </div>
              </div>
            </div>

            {/* 중앙: 출현한 적 위협 몬스터 전장 */}
            <div className="flex-1 h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cyan-800/50 bg-slate-950/40 px-3 py-1 relative overflow-hidden">
              <span className="absolute top-1 left-3 text-[10px] font-black tracking-widest text-cyan-600/70 uppercase pointer-events-none">
                ENEMY THREATS ({state.enemyAllies.length})
              </span>

              {state.enemyAllies.length === 0 ? (
                <div className="text-cyan-600/60 text-xs italic font-semibold">
                  출현한 위협이 없습니다 (평화 상태)
                </div>
              ) : (
                <div className="flex gap-2.5 justify-center items-center flex-wrap pt-2 overflow-y-auto max-h-full">
                  {state.enemyAllies.map((enemy, idx) => (
                    <div
                      key={`${enemy.id}_${idx}`}
                      onClick={() => hasReadyAllies && onAttackTarget('enemy', enemy.id)}
                      onMouseEnter={() => onCardHover(enemy.id)}
                      onMouseLeave={() => onCardHover(null)}
                      className={`relative rounded-2xl overflow-hidden card-3d-elevation cursor-pointer transition-all ${
                        hasReadyAllies
                          ? 'ring-4 ring-rose-500 hover:scale-105'
                          : 'border-2 border-rose-900/80'
                      }`}
                    >
                      <CardView cardId={enemy.id} size="sm" />
                      <div className="absolute top-1 left-1 bg-red-700/90 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow border border-red-500">
                        방어 {enemy.defense}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 우측: 적 무덤 */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase mb-0.5">
                ENEMY GRAVE
              </span>
              <div className="w-18 h-26 sm:w-22 sm:h-32 rounded-2xl border-2 border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-600 card-3d-elevation">
                <Skull size={22} />
                <span className="text-xs font-bold mt-1 text-slate-400">{state.eventDiscard.length}장</span>
              </div>
            </div>
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [2. 하단 아군 보드판 배경] (playerMat - zIndex: 1, 비침습 배경판)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="playerMat"
          label="하단 아군 보드 배경판"
          layout={elements.playerMat}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('playerMat', nl)}
          defaultZIndex={1}
        >
          <div className="w-full h-full rounded-3xl p-3 shadow-2xl border-2 border-amber-700/50 bg-gradient-to-t from-slate-950 via-slate-900/90 to-amber-950/40 backdrop-blur-sm relative overflow-hidden pointer-events-none">
            <div className="absolute top-2 right-6 text-[11px] font-black tracking-widest text-amber-500/30 uppercase">
              {factionInfo.name_ko} • COMMAND CITADEL BOARD
            </div>
            {/* 배경 은은한 격자 가이드 라인 */}
            <div className="w-full h-full border border-amber-900/20 rounded-2xl" />
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [3. 1. 홈 렐름] (realm - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="realm"
          label="1. 홈 렐름"
          layout={elements.realm}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('realm', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/85 border-2 border-emerald-600/80 rounded-2xl p-2 shadow-2xl">
            <span className="text-[10px] text-emerald-400 font-black tracking-wider uppercase mb-1 flex items-center gap-1">
              <Heart size={12} className="text-red-500 fill-red-500" /> 1. HOME REALM
            </span>
            <div
              className="relative rounded-2xl overflow-hidden card-3d-elevation border-2 border-emerald-600/80 cursor-pointer shadow-xl"
              onMouseEnter={() => onCardHover(state.playerFaction + '_realm')}
              onMouseLeave={() => onCardHover(null)}
            >
              <CardView cardId={state.playerFaction + '_realm'} size="md" isLandscape={true} />
              <div className="absolute bottom-0 inset-x-0 bg-black/90 p-1 rounded-b-2xl border-t border-slate-700">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-red-600 to-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${(state.homeRealmHp / state.maxHomeRealmHp) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-center font-black text-white mt-0.5">
                  HP {state.homeRealmHp}/{state.maxHomeRealmHp}
                </div>
              </div>
            </div>
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [4. 중앙 전장] (battlefield - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="battlefield"
          label="중앙 전장 (ALLIES)"
          layout={elements.battlefield}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('battlefield', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-600/60 bg-slate-950/70 p-2 shadow-xl relative overflow-hidden">
            <div className="absolute top-1.5 inset-x-3 flex justify-between items-center pointer-events-none">
              <span className="text-[10px] font-black tracking-widest text-amber-500/80 uppercase">
                BATTLEFIELD ALLIES ({state.fieldAllies.length})
              </span>
              {hasReadyAllies && (
                <span className="text-[10px] text-emerald-400 font-black animate-pulse flex items-center gap-1">
                  <Swords size={12} /> 공격 준비 완료 (적/도시 클릭)
                </span>
              )}
            </div>

            {state.fieldAllies.length === 0 ? (
              <div className="text-amber-500/50 text-xs italic font-semibold py-4 text-center">
                손패에서 유닛 카드를 클릭하여 전장으로 1장씩 출진시키십시오
              </div>
            ) : (
              <div className="flex gap-2.5 justify-center items-center flex-wrap pt-4 overflow-y-auto max-h-full">
                {state.fieldAllies.map(ally => {
                  const isReady = ally.canAttack && !ally.hasAttacked;
                  const def = ALL_CARDS[ally.definitionId];

                  return (
                    <div
                      key={ally.instanceId}
                      onClick={() => onSelectAlly(ally.instanceId)}
                      onMouseEnter={() => onCardHover(ally.definitionId)}
                      onMouseLeave={() => onCardHover(null)}
                      className={`relative rounded-2xl overflow-hidden card-3d-elevation cursor-pointer transition-all ${
                        isReady
                          ? 'ring-4 ring-emerald-400 shadow-emerald-500/50 hover:scale-105'
                          : 'opacity-60 filter grayscale-[40%]'
                      }`}
                    >
                      <CardView cardId={ally.definitionId} size="sm" />
                      <div className="absolute top-1 left-1 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow border border-amber-400">
                        공격 {def?.strength}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [5. 2. 내 덱] (deck - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="deck"
          label="2. 내 덱"
          layout={elements.deck}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('deck', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/85 border-2 border-cyan-500/80 rounded-2xl p-2 shadow-2xl">
            <span className="text-[10px] text-cyan-300 font-extrabold tracking-wider uppercase mb-1">
              2. DECK
            </span>
            <div
              className="relative w-22 h-32 sm:w-26 sm:h-38 rounded-2xl overflow-hidden border-2 border-cyan-500/80 shadow-2xl card-3d-elevation cursor-pointer"
              onMouseEnter={() => onCardHover(state.playerFaction + '_realm')}
              onMouseLeave={() => onCardHover(null)}
            >
              <img
                src={CARD_BACKS.player}
                alt="Player Deck"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="absolute bottom-1.5 right-1.5 bg-black/90 text-cyan-300 font-black text-xs px-2 py-0.5 rounded shadow border border-cyan-400/50">
                {state.deck.length}장
              </div>
            </div>
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [6. 4. 리소스] (resources - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="resources"
          label="4. 리소스"
          layout={elements.resources}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('resources', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/90 border-2 border-amber-900/80 p-2.5 rounded-2xl shadow-xl">
            <span className="text-[10px] text-amber-400 font-black tracking-wider uppercase mb-1.5">
              4. RESOURCES
            </span>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-900 border border-amber-400 px-3 py-2 rounded-xl shadow text-white font-black text-xs sm:text-sm">
                <Coins size={16} className="text-amber-300" />
                <span>{state.goldPool} G</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-900 border border-emerald-400 px-3 py-2 rounded-xl shadow text-white font-black text-xs sm:text-sm">
                <Shield size={16} className="text-emerald-300" />
                <span>영향력 {state.influencePool}</span>
              </div>
            </div>
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [7. 3. 점령 도시 / 요새] (support - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="support"
          label="3. 점령 도시/요새"
          layout={elements.support}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('support', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 border-2 border-emerald-900/60 p-2 rounded-2xl shadow-xl relative overflow-hidden">
            <span className="text-[10px] text-emerald-400 font-black tracking-wider uppercase mb-1 flex items-center gap-1">
              <Shield size={12} /> 3. SUPPORT ({state.supportZone.length})
            </span>
            <div className="flex gap-2.5 max-w-full overflow-x-auto py-1 justify-center items-center">
              {state.supportZone.length === 0 ? (
                <div className="text-slate-500 text-xs italic font-semibold py-4 text-center">
                  점령한 도시나 요새가 없습니다
                </div>
              ) : (
                state.supportZone.map((sup, idx) => (
                  <div
                    key={`${sup.id}_${idx}`}
                    onMouseEnter={() => onCardHover(sup.id)}
                    onMouseLeave={() => onCardHover(null)}
                    className="relative rounded-2xl overflow-hidden card-3d-elevation border border-emerald-500/60"
                  >
                    <CardView cardId={sup.id} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [8. 5. 종족 유닛 4종 병영] (barracks - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="barracks"
          label="5. 종족 유닛 4종 병영"
          layout={elements.barracks}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('barracks', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 border-2 border-amber-900/60 p-2 rounded-2xl shadow-xl relative overflow-hidden">
            <span className="text-[10px] text-amber-300 font-black tracking-wider uppercase mb-1 flex items-center gap-1">
              <Shield size={12} /> 5. BARRACKS (원클릭 징집)
            </span>
            <div className="flex gap-2.5 max-w-full overflow-x-auto py-1 justify-center items-center">
              {factionUnits.map(unitId => {
                const card = ALL_CARDS[unitId];
                const stock = state.barracksStock[unitId] || 0;
                const canAfford = state.goldPool >= card.cost && stock > 0;

                return (
                  <div key={unitId} className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      onClick={() => canAfford && onBuyUnit(unitId)}
                      onMouseEnter={() => onCardHover(unitId)}
                      onMouseLeave={() => onCardHover(null)}
                      className={`relative rounded-2xl overflow-hidden card-3d-elevation cursor-pointer transition-all ${
                        canAfford ? 'ring-2 ring-emerald-400 hover:scale-105' : 'opacity-65'
                      }`}
                    >
                      <CardView cardId={unitId} size="sm" badge={`x${stock}`} isDisabled={stock <= 0} />
                    </div>
                    <button
                      onClick={() => onBuyUnit(unitId)}
                      disabled={!canAfford}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow transition ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-emerald-600/40'
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
        </ResizableDraggableWrapper>

        {/* ========================================================
            [9. 6. 무덤] (graveyard - zIndex: 10, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="graveyard"
          label="6. 무덤"
          layout={elements.graveyard}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('graveyard', nl)}
          defaultZIndex={10}
        >
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/90 border-2 border-slate-700 p-2.5 rounded-2xl shadow-xl">
            <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase mb-1">
              6. GRAVEYARD
            </span>
            <div className="w-18 h-26 sm:w-22 sm:h-32 rounded-2xl border-2 border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-slate-500 card-3d-elevation">
              <Skull size={24} />
              <span className="text-xs font-black mt-1 text-slate-300">
                {state.discard.length}장
              </span>
            </div>
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [10. 우측 공용 마켓] (neutralMarket - zIndex: 15, 완전 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="neutralMarket"
          label="우측 공용 마켓"
          layout={elements.neutralMarket}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('neutralMarket', nl)}
          defaultZIndex={15}
        >
          <NeutralMarketPanel
            goldPool={state.goldPool}
            marketGoldStock={state.marketGoldStock}
            marketCities={state.marketCities}
            hasReadyAllies={hasReadyAllies}
            onBuyCard={onBuyMarketCard}
            onAttackCity={(cityId) => onAttackTarget('city', cityId)}
            onCardHover={onCardHover}
          />
        </ResizableDraggableWrapper>

        {/* ========================================================
            [11. 부채꼴 손패] (fanHand - zIndex: 20, HUD 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="fanHand"
          label="부채꼴 손패"
          layout={elements.fanHand}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('fanHand', nl)}
          defaultZIndex={20}
        >
          <div className="w-full h-full flex items-center justify-center overflow-visible">
            <FanHand
              hand={state.hand}
              onPlayCard={onPlayHandCard}
              onHoverCard={onCardHover}
            />
          </div>
        </ResizableDraggableWrapper>

        {/* ========================================================
            [12. 턴 종료 단일 액션 버튼] (actionButtons - zIndex: 20, HUD 독립)
            ======================================================== */}
        <ResizableDraggableWrapper
          id="actionButtons"
          label="턴 종료 버튼"
          layout={elements.actionButtons}
          isEditMode={isEditMode}
          onChange={(nl) => onUpdateElementLayout('actionButtons', nl)}
          defaultZIndex={20}
        >
          <DynamicActionButtons onEndTurn={onEndTurn} />
        </ResizableDraggableWrapper>

      </div>
    </div>
  );
};
