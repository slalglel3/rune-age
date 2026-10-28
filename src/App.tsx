import React, { useReducer, useState, useEffect } from 'react';
import { gameReducer, initGame } from './engine/gameReducer';
import { FactionId } from './types/game';
import {
  LayoutConfig,
  LayoutKey,
  ElementLayout,
  loadSavedLayout,
  saveLayoutToStorage,
  saveLayoutToServer,
  fetchServerLayout,
  DEFAULT_LAYOUT
} from './types/layout';
import { FACTION_INFO, FACTION_UNITS, ALL_CARDS } from './engine/cardDatabase';
import { PlaymatField } from './components/PlaymatField';
import { FanHand } from './components/FanHand';
import { DynamicActionButtons } from './components/DynamicActionButtons';
import { CardZoomPreview } from './components/CardZoomPreview';
import { GameLogModal } from './components/GameLogModal';
import { LayoutEditorToolbar } from './components/LayoutEditorToolbar';
import { ResizableDraggableWrapper } from './components/ResizableDraggableWrapper';
import { CardView } from './components/CardView';
import { Trophy, Skull, RotateCcw, Sparkles, ScrollText, Sliders } from 'lucide-react';

export function App() {
  const [selectedFaction, setSelectedFaction] = useState<FactionId | null>(null);
  const [state, dispatch] = useReducer(gameReducer, initGame('daqan'));

  // 인터랙티브 레이아웃 편집 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => loadSavedLayout());

  // 모달 및 호버 줌 상태
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // 마운트 시: 서버에 저장된 userLayout.json이 있으면 불러오고, 없으면 브라우저 상태를 서버에 자동 백업
  useEffect(() => {
    fetchServerLayout().then((serverLayout) => {
      if (serverLayout) {
        setLayoutConfig(serverLayout);
      } else {
        saveLayoutToServer(layoutConfig).catch(() => {});
      }
    });
  }, []);

  const handleUpdateElementLayout = (key: LayoutKey, newLayout: ElementLayout) => {
    const updated = {
      ...layoutConfig,
      elements: {
        ...layoutConfig.elements,
        [key]: newLayout
      }
    };
    setLayoutConfig(updated);
    saveLayoutToStorage(updated);
  };

  const handleUpdateTilt = (angle: number) => {
    const updated = { ...layoutConfig, tiltAngle: angle };
    setLayoutConfig(updated);
    saveLayoutToStorage(updated);
  };

  const handleResetLayout = () => {
    setLayoutConfig(DEFAULT_LAYOUT);
    saveLayoutToStorage(DEFAULT_LAYOUT);
  };

  // 종족 선택 후 게임 시작
  const handleStartGame = (faction: FactionId) => {
    setSelectedFaction(faction);
    dispatch({ type: 'START_GAME', faction });
  };

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
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
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
          상단 레이아웃 편집기 툴바 (isEditMode일 때 상단 고정 노출)
          ======================================================== */}
      {isEditMode && (
        <LayoutEditorToolbar
          config={layoutConfig}
          onUpdateTilt={handleUpdateTilt}
          onReset={handleResetLayout}
          onClose={() => setIsEditMode(false)}
          onSaveServer={() => saveLayoutToServer(layoutConfig)}
          onImportLayout={(newCfg) => {
            setLayoutConfig(newCfg);
            saveLayoutToStorage(newCfg);
          }}
        />
      )}

      {/* ========================================================
          1. 최상단: 페이즈 배너 & 상태바 (HUD)
          ======================================================== */}
      <header className="bg-slate-950/95 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xl z-40">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-lg"
            style={{ backgroundColor: factionInfo.color }}
          >
            {factionInfo.name_ko.substring(0, 2)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm sm:text-base text-amber-400 bg-amber-950/80 border border-amber-900 px-3 py-0.5 rounded-lg shadow-inner tracking-wider">
              {state.phaseName}
            </span>
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">
              {factionInfo.name_ko} 지휘관
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-semibold bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-red-400 font-bold">목표: 고대 드래곤 로드 토벌</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">수도 홈 렐름 사수</span>
        </div>

        <div className="flex items-center gap-2">
          {/* UI 레이아웃 편집기 토글 버튼 */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border shadow transition ${
              isEditMode
                ? 'bg-cyan-600 border-cyan-400 text-white animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-700/60'
            }`}
            title="마우스로 화면 요소를 자유롭게 드래그 및 크기 조절"
          >
            <Sliders size={15} />
            <span>{isEditMode ? '편집 모드 ON' : '📐 UI 배치 편집'}</span>
          </button>

          <button
            onClick={() => setIsLogOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow transition"
          >
            <ScrollText size={15} className="text-amber-400" />
            <span>로그</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. 중앙 메인: 3D 원근 틸트 테이블탑 전장 (Perspective Field)
          ======================================================== */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <PlaymatField
          state={state}
          layoutConfig={layoutConfig}
          isEditMode={isEditMode}
          onUpdateElementLayout={handleUpdateElementLayout}
          onAttackTarget={(targetType, targetId) =>
            dispatch({ type: 'ATTACK_TARGET', targetType, targetId })
          }
          onSelectAlly={() => {}}
          onCardHover={(cardId) => setHoveredCardId(cardId)}
          onBuyUnit={(unitId) => dispatch({ type: 'BUY_BARRACKS_UNIT', unitId })}
          onBuyMarketCard={(cardId) => dispatch({ type: 'BUY_MARKET_CARD', cardId })}
        />
      </main>

      {/* ========================================================
          3. 최하단: HUD 전면 레이어 (부채꼴 손패 & 단일 턴 종료 버튼)
          ======================================================== */}
      <footer className="bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-1 pb-3 px-4 flex items-end justify-between shrink-0 relative z-40">
        <div className="w-24 sm:w-48 shrink-0 pointer-events-none" />

        {/* 중앙: 부채꼴 손패 (드래그/리사이즈 지원) */}
        <div className="flex-1 flex justify-center overflow-visible">
          <ResizableDraggableWrapper
            id="fanHand"
            label="부채꼴 손패"
            layout={layoutConfig.elements.fanHand}
            isEditMode={isEditMode}
            onChange={(nl) => handleUpdateElementLayout('fanHand', nl)}
          >
            <FanHand
              hand={state.hand}
              onPlayCard={(instanceId) => dispatch({ type: 'PLAY_HAND_CARD', instanceId })}
              onHoverCard={(cardId) => setHoveredCardId(cardId)}
            />
          </ResizableDraggableWrapper>
        </div>

        {/* 우측: 턴 종료 단일 액션 버튼 (드래그/리사이즈 지원) */}
        <ResizableDraggableWrapper
          id="actionButtons"
          label="턴 종료 버튼"
          layout={layoutConfig.elements.actionButtons}
          isEditMode={isEditMode}
          onChange={(nl) => handleUpdateElementLayout('actionButtons', nl)}
        >
          <DynamicActionButtons
            onEndTurn={() => dispatch({ type: 'END_TURN' })}
          />
        </ResizableDraggableWrapper>
      </footer>

      {/* ========================================================
          4. 카드 줌 프리뷰 (호버 시 좌측 하단 대형 팝업)
          ======================================================== */}
      <CardZoomPreview cardId={hoveredCardId} />

      {/* ========================================================
          5. 실시간 게임 로그 모달
          ======================================================== */}
      <GameLogModal
        logs={state.logs}
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
      />

      {/* ========================================================
          6. 승리 / 패배 결과 화면
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
