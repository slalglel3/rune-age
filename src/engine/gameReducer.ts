import { GameState, GameAction, FactionId, CardInstance, CardDefinition } from '../types/game';
import { ALL_CARDS, FACTION_UNITS } from './cardDatabase';

let nextInstanceId = 100;
export function createInstance(definitionId: string, isFlipped: boolean = false): CardInstance {
  return {
    instanceId: `inst_${definitionId}_${nextInstanceId++}_${Math.random().toString(36).substring(2, 5)}`,
    definitionId,
    isFlipped,
    canAttack: true,
    hasAttacked: false
  };
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawCards(state: GameState, count: number): { hand: CardInstance[]; deck: CardInstance[]; discard: CardInstance[] } {
  let deck = [...state.deck];
  let discard = [...state.discard];
  const hand = [...state.hand];

  for (let i = 0; i < count; i++) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      deck = shuffle(discard);
      discard = [];
    }
    const card = deck.pop();
    if (card) {
      hand.push({ ...card, isFlipped: false });
    }
  }

  return { hand, deck, discard };
}

export function initGame(faction: FactionId): GameState {
  // 1. 시작 덱: 1골드 5장 + 1티어 유닛 3장 (총 8장)
  const tier1UnitId = FACTION_UNITS[faction][0];
  const startingDeck: CardInstance[] = [
    createInstance('gold_1'),
    createInstance('gold_1'),
    createInstance('gold_1'),
    createInstance('gold_1'),
    createInstance('gold_1'),
    createInstance(tier1UnitId),
    createInstance(tier1UnitId),
    createInstance(tier1UnitId),
  ];
  const shuffledDeck = shuffle(startingDeck);

  // 2. 초기 5장 드로우
  const initialHand: CardInstance[] = [];
  for (let i = 0; i < 5; i++) {
    const card = shuffledDeck.pop();
    if (card) initialHand.push(card);
  }

  // 3. 종족 병영 수량 초기화
  const barracksStock: Record<string, number> = {};
  FACTION_UNITS[faction].forEach((unitId, index) => {
    const limit = ALL_CARDS[unitId].card_limit || 4;
    barracksStock[unitId] = index === 0 ? Math.max(0, limit - 3) : limit;
  });

  // 4. 이벤트 덱 초기화 및 1턴 위협 1장 즉시 출현
  const eventDeck = shuffle([
    'event_dragon_spawn',
    'event_dragon_spawn',
    'event_drake_raiders',
    'event_drake_raiders',
    'event_dragon_wrath'
  ]);
  const firstEventId = eventDeck.pop();
  const enemyAllies: CardDefinition[] = [];
  if (firstEventId && ALL_CARDS[firstEventId]) {
    enemyAllies.push(ALL_CARDS[firstEventId]);
  }

  return {
    turn: 1,
    phase: 'ACTION_STEP',
    phaseName: 'T1 - Action',
    playerFaction: faction,
    homeRealmHp: 20,
    maxHomeRealmHp: 20,
    deck: shuffledDeck,
    hand: initialHand,
    fieldAllies: [],
    supportZone: [],
    discard: [],
    goldPool: 0,
    influencePool: 0,
    bossDragon: {
      definitionId: 'boss_dragonlord',
      hp: 12,
      maxHp: 12,
      strength: 8
    },
    enemyAllies,
    eventDeck,
    eventDiscard: [],
    marketGoldStock: { gold_1: 20, gold_2: 12, gold_3: 8 },
    marketCities: ['city_tamalir', 'city_riverwatch', 'city_forge', 'city_dawnsmoor'],
    barracksStock,
    selectedHandCardId: null,
    selectedAllyId: null,
    zoomedCardId: null,
    combatBanner: null,
    logs: [
      `⚔️ 게임 시작! 선택 진영: ${ALL_CARDS[faction + '_realm']?.name_ko || faction}`,
      `🚨 [이벤트] 전장에 ${enemyAllies[0]?.name_ko || '위협'}이(가) 출현했습니다!`,
      `카드 5장을 드로우했습니다. 행동 단계(Action Step)를 시작합니다.`
    ]
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.phase === 'VICTORY' || state.phase === 'DEFEAT') {
    if (action.type === 'START_GAME') return initGame(action.faction);
    return state;
  }

  switch (action.type) {
    case 'START_GAME':
      return initGame(action.faction);

    case 'SET_ZOOM_CARD':
      return { ...state, zoomedCardId: action.cardId };

    case 'PLAY_HAND_CARD': {
      const card = state.hand.find(c => c.instanceId === action.instanceId);
      if (!card) return state;

      const def = ALL_CARDS[card.definitionId];
      if (!def) return state;

      // 1. 골드 카드 플레이 -> 골드 풀 충전 후 discard
      if (def.type === 'gold') {
        const val = def.gold_value || 1;
        return {
          ...state,
          hand: state.hand.filter(c => c.instanceId !== action.instanceId),
          discard: [...state.discard, card],
          goldPool: state.goldPool + val,
          combatBanner: `+${val} 골드 획득!`,
          logs: [`🪙 [골드 사용] ${def.name_ko} 사용: 골드 +${val} (보유: ${state.goldPool + val}G)`, ...state.logs]
        };
      }

      // 2. 유닛 카드 플레이 -> 전장(ALLIES)으로 출진!
      if (def.type === 'unit') {
        // 라타리 폭풍의 주술사 특수 능력 (영향력 +2 획득 후 버려짐)
        if (def.id === 'unit_latari_storm_sorceress') {
          return {
            ...state,
            hand: state.hand.filter(c => c.instanceId !== action.instanceId),
            discard: [...state.discard, card], // 파괴가 아닌 버림!
            influencePool: state.influencePool + 2,
            combatBanner: `⚡ 폭풍의 주술사: 영향력 +2 획득!`,
            logs: [
              `⚡ [특수 능력] ${def.name_ko}: 영향력 +2를 얻고 턴 종료 시 버려집니다 (파괴되지 않음).`,
              ...state.logs
            ]
          };
        }

        // 일반 유닛: 아군 전장(fieldAllies)으로 배치
        return {
          ...state,
          hand: state.hand.filter(c => c.instanceId !== action.instanceId),
          fieldAllies: [...state.fieldAllies, { ...card, canAttack: true, hasAttacked: false }],
          combatBanner: `${def.name_ko} 전장 출진!`,
          logs: [`🛡️ [유닛 출진] ${def.name_ko}이(가) 전장에 배치되었습니다. (전투력: ${def.strength})`, ...state.logs]
        };
      }

      // 3. 점령한 도시/요새 -> 지원 구역(SUPPORT)으로 배치
      if (def.type === 'city' || def.type === 'stronghold') {
        const inf = def.influence_value || 2;
        return {
          ...state,
          hand: state.hand.filter(c => c.instanceId !== action.instanceId),
          supportZone: [...state.supportZone, def],
          influencePool: state.influencePool + inf,
          combatBanner: `${def.name_ko} 지원 활성화!`,
          logs: [`🏛️ [지원 활성화] ${def.name_ko} 배치: 영향력 +${inf}`, ...state.logs]
        };
      }

      return state;
    }

    case 'PLAY_ALL_GOLD': {
      const goldCards = state.hand.filter(c => ALL_CARDS[c.definitionId]?.type === 'gold');
      if (goldCards.length === 0) return state;

      let addedGold = 0;
      goldCards.forEach(c => {
        addedGold += ALL_CARDS[c.definitionId]?.gold_value || 1;
      });

      const goldIds = new Set(goldCards.map(c => c.instanceId));
      return {
        ...state,
        hand: state.hand.filter(c => !goldIds.has(c.instanceId)),
        discard: [...state.discard, ...goldCards],
        goldPool: state.goldPool + addedGold,
        combatBanner: `+${addedGold} 골드 일괄 획득!`,
        logs: [`🪙 [골드 일괄 사용] 골드 카드 ${goldCards.length}장 사용 (+${addedGold}G)`, ...state.logs]
      };
    }

    case 'DEPLOY_ALL_UNITS': {
      // 손패의 모든 유닛을 아군 전장으로 일괄 출진
      const unitCards = state.hand.filter(c => ALL_CARDS[c.definitionId]?.type === 'unit' && c.definitionId !== 'unit_latari_storm_sorceress');
      if (unitCards.length === 0) return state;

      const unitIds = new Set(unitCards.map(c => c.instanceId));
      const deployedInstances = unitCards.map(c => ({ ...c, canAttack: true, hasAttacked: false }));

      return {
        ...state,
        hand: state.hand.filter(c => !unitIds.has(c.instanceId)),
        fieldAllies: [...state.fieldAllies, ...deployedInstances],
        combatBanner: `전군 돌격 배치 완료!`,
        logs: [`🛡️ [전군 출진] 유닛 ${unitCards.length}부대가 전장으로 일괄 배치되었습니다.`, ...state.logs]
      };
    }

    case 'BUY_MARKET_CARD': {
      const def = ALL_CARDS[action.cardId];
      if (!def) return state;

      if (state.goldPool < def.cost) {
        return {
          ...state,
          combatBanner: `골드가 부족합니다!`,
          logs: [`❌ 골드 부족: ${def.name_ko} (필요: ${def.cost}G, 보유: ${state.goldPool}G)`, ...state.logs]
        };
      }

      // 골드 카드 구매
      if (def.type === 'gold') {
        const gKey = def.id as 'gold_1' | 'gold_2' | 'gold_3';
        const stock = state.marketGoldStock[gKey];
        if (stock <= 0) return state;

        return {
          ...state,
          goldPool: state.goldPool - def.cost,
          marketGoldStock: { ...state.marketGoldStock, [gKey]: stock - 1 },
          discard: [...state.discard, createInstance(def.id)],
          combatBanner: `${def.name_ko} 구매 완료!`,
          logs: [`🛒 [마켓 구매] ${def.name_ko} 획득 (-${def.cost}G)`, ...state.logs]
        };
      }

      return state;
    }

    case 'BUY_BARRACKS_UNIT': {
      const def = ALL_CARDS[action.unitId];
      if (!def) return state;

      if (state.goldPool < def.cost) {
        return {
          ...state,
          combatBanner: `골드가 부족합니다!`,
          logs: [`❌ 골드 부족: ${def.name_ko} (필요: ${def.cost}G, 보유: ${state.goldPool}G)`, ...state.logs]
        };
      }

      const stock = state.barracksStock[def.id] || 0;
      if (stock <= 0) {
        return {
          ...state,
          combatBanner: `병영 재고가 없습니다.`,
          logs: [`❌ ${def.name_ko}의 병영 재고가 모두 소진되었습니다.`, ...state.logs]
        };
      }

      return {
        ...state,
        goldPool: state.goldPool - def.cost,
        barracksStock: { ...state.barracksStock, [def.id]: stock - 1 },
        discard: [...state.discard, createInstance(def.id)],
        combatBanner: `${def.name_ko} 징집 완료!`,
        logs: [`🛡️ [병영 징집] ${def.name_ko} 고용 (-${def.cost}G)`, ...state.logs]
      };
    }

    case 'ATTACK_TARGET': {
      // 전장에 공격 가능한 유닛이 있는지 확인
      const readyAllies = state.fieldAllies.filter(a => a.canAttack && !a.hasAttacked);
      if (readyAllies.length === 0) {
        return {
          ...state,
          combatBanner: `공격 가능한 유닛이 없습니다!`,
          logs: [`❌ 전장에 공격 가능한 유닛이 없습니다. 손패에서 유닛을 전장으로 먼저 출진시키세요.`, ...state.logs]
        };
      }

      // 1. 공격력 계산 및 다칸 기사 [징집] 발동
      let totalAttack = 0;
      readyAllies.forEach(a => {
        totalAttack += ALL_CARDS[a.definitionId]?.strength || 1;
      });

      let currentDeck = [...state.deck];
      let currentDiscard = [...state.discard];
      const knightCards = readyAllies.filter(a => a.definitionId === 'unit_daqan_knight');
      const combatLogs: string[] = [];

      for (let k = 0; k < knightCards.length; k++) {
        if (currentDeck.length === 0 && currentDiscard.length > 0) {
          currentDeck = shuffle(currentDiscard);
          currentDiscard = [];
        }

        if (currentDeck.length > 0) {
          const revealed = currentDeck.pop()!;
          const rDef = ALL_CARDS[revealed.definitionId];

          // 룰 수정: 오직 '유닛'만 징집 가능! (골드는 징집 불가)
          if (rDef?.type === 'unit') {
            const addStr = rDef.strength || 1;
            totalAttack += addStr;
            currentDiscard.push(revealed);
            combatLogs.push(`⚔️ [기사의 징집 성공] 덱에서 [${rDef.name_ko}]이(가) 지원군으로 합류! (공격력 +${addStr}, 총합: ${totalAttack})`);
          } else {
            currentDiscard.push(revealed);
            combatLogs.push(`🛡️ [기사의 징집 실패] [${rDef?.name_ko || '카드'}] 공개: 유닛이 아니므로 징집 불가 (골드 징집 제외 규칙). 카드는 버려집니다.`);
          }
        }
      }

      // 공격한 유닛들은 이번 턴 공격 완료 처리
      const updatedAllies = state.fieldAllies.map(a => ({ ...a, hasAttacked: true, canAttack: false }));

      // 2. 대상별 전투 정산
      // 2-1. 적 위협 몬스터 공격
      if (action.targetType === 'enemy') {
        const enemy = state.enemyAllies.find(e => e.id === action.targetId);
        if (!enemy) return state;

        const req = enemy.defense || 2;
        if (totalAttack >= req) {
          return {
            ...state,
            deck: currentDeck,
            discard: currentDiscard,
            fieldAllies: updatedAllies,
            enemyAllies: state.enemyAllies.filter(e => e.id !== action.targetId),
            eventDiscard: [...state.eventDiscard, enemy.id],
            combatBanner: `💥 ${enemy.name_ko} 토벌 성공!`,
            logs: [
              `🏆 [전투 승리] ${enemy.name_ko} 토벌 완료! (공격력 ${totalAttack} >= 방어력 ${req})`,
              ...combatLogs,
              ...state.logs
            ]
          };
        } else {
          return {
            ...state,
            deck: currentDeck,
            discard: currentDiscard,
            fieldAllies: updatedAllies,
            combatBanner: `토벌 실패 (공격력 부족)`,
            logs: [
              `⚠️ [전투 실패] ${enemy.name_ko} 공략 실패 (공격력 ${totalAttack} < 필요 방어력 ${req})`,
              ...combatLogs,
              ...state.logs
            ]
          };
        }
      }

      // 2-2. 중립 도시 점령 공격
      if (action.targetType === 'city') {
        const cityDef = ALL_CARDS[action.targetId];
        if (!cityDef) return state;

        const req = cityDef.defense || 3;
        if (totalAttack >= req) {
          return {
            ...state,
            deck: currentDeck,
            discard: currentDiscard,
            fieldAllies: updatedAllies,
            marketCities: state.marketCities.filter(c => c !== action.targetId),
            supportZone: [...state.supportZone, cityDef],
            influencePool: state.influencePool + (cityDef.influence_value || 2),
            combatBanner: `🏰 ${cityDef.name_ko} 점령 성공!`,
            logs: [
              `🏆 [도시 점령] ${cityDef.name_ko} 점령 완료! 지원 구역(SUPPORT)에 배치되어 영향력 +${cityDef.influence_value} 영구 획득!`,
              ...combatLogs,
              ...state.logs
            ]
          };
        } else {
          return {
            ...state,
            deck: currentDeck,
            discard: currentDiscard,
            fieldAllies: updatedAllies,
            combatBanner: `도시 공략 실패`,
            logs: [
              `⚠️ [도시 공략 실패] ${cityDef.name_ko} (공격력 ${totalAttack} < 필요 방어력 ${req})`,
              ...combatLogs,
              ...state.logs
            ]
          };
        }
      }

      // 2-3. 최종 보스 드래곤 공격
      if (action.targetType === 'boss') {
        const damage = totalAttack;
        const newHp = Math.max(0, state.bossDragon.hp - damage);
        const isVictory = newHp <= 0;

        return {
          ...state,
          deck: currentDeck,
          discard: currentDiscard,
          fieldAllies: updatedAllies,
          bossDragon: { ...state.bossDragon, hp: newHp },
          phase: isVictory ? 'VICTORY' : state.phase,
          combatBanner: isVictory ? `🏆 보스 토벌! 승리!` : `드래곤 로드에게 -${damage} 피해!`,
          logs: [
            isVictory
              ? `🎉 [최종 승리!] 고대 드래곤 로드를 완전히 쓰러뜨렸습니다! 테리노스의 영웅이 되셨습니다!`
              : `🔥 [보스 공격] 고대 드래곤 로드에게 ${damage} 피해를 입혔습니다! (남은 HP: ${newHp}/${state.bossDragon.maxHp})`,
            ...combatLogs,
            ...state.logs
          ]
        };
      }

      return state;
    }

    case 'ALL_ATTACK': {
      // 섀도우 에라 스타일의 일괄 돌격!
      // 적 위협 몬스터가 있으면 첫 번째 위협을 공격, 없으면 보스 드래곤을 공격!
      if (state.enemyAllies.length > 0) {
        const targetEnemy = state.enemyAllies[0];
        return gameReducer(state, {
          type: 'ATTACK_TARGET',
          targetType: 'enemy',
          targetId: targetEnemy.id
        });
      } else {
        return gameReducer(state, {
          type: 'ATTACK_TARGET',
          targetType: 'boss',
          targetId: state.bossDragon.definitionId
        });
      }
    }

    case 'END_TURN': {
      // 1. 미격퇴 적 몬스터 공격 정산
      let newRealmHp = state.homeRealmHp;
      const turnLogs: string[] = [];

      if (state.enemyAllies.length > 0) {
        state.enemyAllies.forEach(enemy => {
          const dmg = enemy.strength || 1;
          newRealmHp = Math.max(0, newRealmHp - dmg);
          turnLogs.push(`🚨 [적의 공습] ${enemy.name_ko}의 공격! 홈 렐름이 ${dmg} 피해를 입었습니다! (남은 HP: ${newRealmHp})`);
        });
      }

      if (newRealmHp <= 0) {
        return {
          ...state,
          homeRealmHp: 0,
          phase: 'DEFEAT',
          combatBanner: `💀 수도 함락... 패배`,
          logs: [`💀 [패배] 수도 홈 렐름이 파괴되었습니다! 게임 오버.`, ...turnLogs, ...state.logs]
        };
      }

      // 2. 전장 유닛 및 손패 정리 (전장에 있던 유닛들은 버린더미로 이동하고 다음 턴 재충전)
      const allToDiscard = [...state.discard, ...state.fieldAllies, ...state.hand];

      // 3. 새 카드 5장 드로우
      const drawResult = drawCards({
        ...state,
        deck: state.deck,
        discard: allToDiscard,
        hand: []
      }, 5);

      // 4. 새로운 시나리오 이벤트 드로우
      let nextEventDeck = [...state.eventDeck];
      const newEnemies = [...state.enemyAllies];

      if (nextEventDeck.length > 0) {
        const nextEvtId = nextEventDeck.pop()!;
        const nextEvt = ALL_CARDS[nextEvtId];
        if (nextEvt) {
          newEnemies.push(nextEvt);
          turnLogs.push(`🚨 [위협 출현] 새로운 위협 [${nextEvt.name_ko}]이(가) 나타났습니다!`);
        }
      }

      const nextTurn = state.turn + 1;
      return {
        ...state,
        turn: nextTurn,
        phase: 'ACTION_STEP',
        phaseName: `T${nextTurn} - Action`,
        homeRealmHp: newRealmHp,
        goldPool: 0,
        influencePool: 0,
        fieldAllies: [],
        hand: drawResult.hand,
        deck: drawResult.deck,
        discard: drawResult.discard,
        enemyAllies: newEnemies,
        eventDeck: nextEventDeck,
        combatBanner: `턴 ${nextTurn} 시작! (5장 드로우)`,
        logs: [`--- 턴 ${nextTurn} 시작 (카드 5장 재충전) ---`, ...turnLogs, ...state.logs]
      };
    }

    default:
      return state;
  }
}
