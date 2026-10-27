import React, { useReducer, useState } from 'react';
import { gameReducer, initGame } from './engine/gameReducer';
import { FactionId } from './types/game';
import { FACTION_INFO, FACTION_UNITS, ALL_CARDS } from './engine/cardDatabase';
import { PlaymatField } from './components/PlaymatField';
import { FanHand } from './components/FanHand';
import { DynamicActionButtons } from './components/DynamicActionButtons';
import { CardZoomPreview } from './components/CardZoomPreview';
import { MarketBoard } from './components/MarketBoard';
import { BarracksBoard } from './components/BarracksBoard';
import { GameLogModal } from './components/GameLogModal';
import { CardView } from './components/CardView';
import { Trophy, Skull, RotateCcw, Sparkles, ScrollText, X } from 'lucide-react';

export function App() {
  const [selectedFaction, setSelectedFaction] = useState<FactionId | null>(null);
  const [state, dispatch] = useReducer(gameReducer, initGame('daqan'));

  // UI 상태 관리
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isBarracksOpen, setIsBarracksOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // 종족 선택 후 게임 시작
  const handleStartGame = (faction: FactionId) => {
    setSelectedFaction(faction);
    dispatch({ type: 'START_GAME', faction });
  };

  const hasReadyAllies = state.fieldAllies.some(a => a.canAttack && !a.hasAttacked);
  const hasUnitsInHand = state.hand.some(c => ALL_CARDS[c.definitionId]?.type === 'unit' && c.definitionId !== 'unit_latari_storm_sorceress');
  const hasGoldInHand = state.hand.some(c => ALL_CARDS[c.definitionId]?.type === 'gold');

  // 종족 선택 화면
  if (!selectedFaction) {
    return (
      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 overflow-y-auto select-none">
        <div className="max-w-4xl w-full text-center flex flex-col items-center gap-6">
          <div>
            <div className="flex items-center justify-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest mb-1">
              <Sparkles size={16} />
              <span>Fantasy Flight Games • Digital Edition</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-lg">
              룬 에이지 <span className="text-amber-500">(Rune Age)</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              시나리오: <span className="text-red-400 font-bold">용군주의 부활 (Resurgence of the Dragonlords)</span>
            </p>
          </div>

          <div className="text-sm font-bold text-slate-300">
            테리노스를 수호할 지휘관 진영을 선택하십시오:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {(['daqan', 'latari', 'waiqar', 'uthuk'] as FactionId[]).map(faction => {
              const info = FACTION_INFO[faction];
              const t1Unit = FACTION_UNITS[faction][0];

              return (
                <div
                  key={faction}
                  onClick={() => handleStartGame(faction)}
                  className="bg-slate-900 border-2 border-slate-800 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 group"
                >
                  <CardView cardId={t1Unit} size="sm" />
                  <div className="font-extrabold text-white text-base group-hover:text-amber-400">
                    {info.name_ko}
                  </div>
                  <div className="text-[11px] text-slate-400 text-center leading-relaxed">
                    {info.desc}
                  </div>
                  <button className="mt-auto w-full py-2.5 rounded-xl text-xs font-black bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 transition shadow">
                    출진하기
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const factionInfo = FACTION_INFO[state.playerFaction];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white select-none overflow-hidden relative font-sans">
      {/* ========================================================
          1. 최상단: 섀도우 에라 스타일의 페이즈 배너 & 상태바
          ======================================================== */}
      <header className="bg-slate-950/95 border-b border-slate-800 px-4 py-2 flex items-center justify-between shrink-0 shadow-xl z-30">
        {/* 좌측: T1 - Action 페이즈 배너 */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow"
            style={{ backgroundColor: factionInfo.color }}
          >
            {factionInfo.name_ko.substring(0, 2)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm sm:text-base text-amber-400 bg-amber-950/60 border border-amber-900/80 px-2.5 py-0.5 rounded-lg shadow">
              {state.phaseName}
            </span>
            <span className="text-xs text-slate-300 font-bold hidden sm:inline">
              {factionInfo.name_ko} 지휘관
            </span>
          </div>
        </div>

        {/* 중앙: 시나리오 목표 */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <span>목표:</span>
          <span className="text-red-400 font-bold">고대 드래곤 로드 토벌</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">수도 방어</span>
        </div>

        {/* 우측: 로그 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow transition"
          >
            <ScrollText size={15} className="text-amber-400" />
            <span>전투 로그</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. 중앙 메인: 상/하단 대칭형 플레이 매트 전장
          ======================================================== */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <PlaymatField
          state={state}
          onAttackTarget={(targetType, targetId) =>
            dispatch({ type: 'ATTACK_TARGET', targetType, targetId })
          }
          onSelectAlly={(id) => {
            // 단일 유닛 선택 인터랙션 (추후 다대다 타깃팅 확장 가능)
          }}
          onCardHover={(cardId) => setHoveredCardId(cardId)}
        />
      </main>

      {/* ========================================================
          3. 최하단: 부채꼴 손패 (Fan-out Hand) & 우측 동적 액션 버튼
          ======================================================== */}
      <footer className="bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-2 pb-3 px-4 flex items-end justify-between shrink-0 relative z-30">
        {/* 좌측 여백 (카드 줌 프리뷰가 뜰 공간 확보) */}
        <div className="w-24 sm:w-48 shrink-0 pointer-events-none" />

        {/* 중앙: 부채꼴 손패 */}
        <div className="flex-1 flex justify-center">
          <FanHand
            hand={state.hand}
            onPlayCard={(instanceId) => dispatch({ type: 'PLAY_HAND_CARD', instanceId })}
            onHoverCard={(cardId) => setHoveredCardId(cardId)}
          />
        </div>

        {/* 우측: 섀도우 에라 스타일 ALL ATTACK / END TURN 액션 버튼군 */}
        <DynamicActionButtons
          hasReadyAllies={hasReadyAllies}
          hasUnitsInHand={hasUnitsInHand}
          hasGoldInHand={hasGoldInHand}
          onAllAttack={() => dispatch({ type: 'ALL_ATTACK' })}
          onDeployAllUnits={() => dispatch({ type: 'DEPLOY_ALL_UNITS' })}
          onPlayAllGold={() => dispatch({ type: 'PLAY_ALL_GOLD' })}
          onEndTurn={() => dispatch({ type: 'END_TURN' })}
          onToggleMarket={() => setIsMarketOpen(true)}
          onToggleBarracks={() => setIsBarracksOpen(true)}
        />
      </footer>

      {/* ========================================================
          4. 카드 줌 프리뷰 (호버 시 좌측 하단 대형 팝업)
          ======================================================== */}
      <CardZoomPreview cardId={hoveredCardId} />

      {/* ========================================================
          5. 공용 상점 모달 (골드 1/2/3 및 중립 도시 구매)
          ======================================================== */}
      {isMarketOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-extrabold text-white text-base">🛒 공용 마켓 (카드 구매)</span>
              <button
                onClick={() => setIsMarketOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <MarketBoard
              goldPool={state.goldPool}
              marketStock={state.marketGoldStock}
              marketCities={state.marketCities}
              onBuyCard={(cardId) => dispatch({ type: 'BUY_MARKET_CARD', cardId })}
              onAttackCity={(cityId) => {
                setIsMarketOpen(false);
                dispatch({ type: 'ATTACK_TARGET', targetType: 'city', targetId: cityId });
              }}
              isCombatPhase={false}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          6. 종족 병영 모달 (4개 종족 유닛 징집)
          ======================================================== */}
      {isBarracksOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-extrabold text-white text-base">🛡️ {factionInfo.name_ko} 병영 (군대 징집)</span>
              <button
                onClick={() => setIsBarracksOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <BarracksBoard
              faction={state.playerFaction}
              goldPool={state.goldPool}
              barracksStock={state.barracksStock}
              onBuyUnit={(unitId) => dispatch({ type: 'BUY_BARRACKS_UNIT', unitId })}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          7. 실시간 게임 로그 모달
          ======================================================== */}
      <GameLogModal
        logs={state.logs}
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />

      {/* ========================================================
          8. 승리 / 패배 결과 화면
          ======================================================== */}
      {(state.phase === 'VICTORY' || state.phase === 'DEFEAT') && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 text-center flex flex-col items-center gap-4 shadow-2xl animate-in zoom-in-95">
            {state.phase === 'VICTORY' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <Trophy size={42} />
                </div>
                <h2 className="text-3xl font-black text-amber-400">승리! (VICTORY)</h2>
                <p className="text-slate-300 text-sm">
                  고대 드래곤 로드를 처치하고 테리노스를 구원하셨습니다!
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-rose-500 mb-2">
                  <Skull size={42} />
                </div>
                <h2 className="text-3xl font-black text-rose-500">패배 (DEFEAT)</h2>
                <p className="text-slate-300 text-sm">
                  수도 홈 렐름이 드래곤 군단에 의해 함락되었습니다...
                </p>
              </>
            )}

            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl w-full">
              진행한 총 턴 수: <span className="text-white font-bold">{state.turn} 턴</span>
            </div>

            <button
              onClick={() => setSelectedFaction(null)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition mt-2"
            >
              <RotateCcw size={18} />
              <span>진영 선택으로 돌아가기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
