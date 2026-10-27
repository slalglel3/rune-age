export type FactionId = 'daqan' | 'latari' | 'waiqar' | 'uthuk';

export type CardType = 'unit' | 'gold' | 'city' | 'stronghold' | 'realm' | 'event' | 'boss';

export interface CardDefinition {
  id: string;
  name_ko: string;
  name_en: string;
  type: CardType;
  faction?: FactionId;
  cost: number;
  cost_type: 'gold' | 'influence';
  strength?: number;
  defense?: number;
  gold_value?: number;
  influence_value?: number;
  hp?: number;
  card_limit?: number;
  asset_front: string;
  description_ko?: string;
  description_en?: string;
}

export interface CardInstance {
  instanceId: string;
  definitionId: string;
  isFlipped?: boolean;
  canAttack?: boolean;
  hasAttacked?: boolean;
}

export interface CombatTarget {
  type: 'boss' | 'enemy' | 'city' | 'event';
  targetId: string;
  name: string;
  requiredStrength: number;
  currentStrength: number;
  rewardText: string;
}

export type GamePhase = 'EVENT_STEP' | 'ACTION_STEP' | 'REFRESH_STEP' | 'VICTORY' | 'DEFEAT';

export interface GameState {
  turn: number;
  phase: GamePhase;
  phaseName: string;
  playerFaction: FactionId;
  
  // 플레이어 매트 영역
  homeRealmHp: number;
  maxHomeRealmHp: number;
  deck: CardInstance[];
  hand: CardInstance[];
  fieldAllies: CardInstance[]; // 아군 전장 (ALLIES)에 배치된 유닛들
  supportZone: CardDefinition[]; // 점령한 도시/요새 (SUPPORT)
  discard: CardInstance[];
  
  // 자원 (RESOURCES)
  goldPool: number;
  influencePool: number;
  
  // 적 / 시나리오 매트 영역 (상단)
  bossDragon: {
    definitionId: string;
    hp: number;
    maxHp: number;
    strength: number;
  };
  enemyAllies: CardDefinition[]; // 출현한 위협 몬스터들
  eventDeck: string[]; // 이벤트 덱 남은 장수
  eventDiscard: string[];
  
  // 공용 마켓 및 종족 병영
  marketGoldStock: { gold_1: number; gold_2: number; gold_3: number };
  marketCities: string[]; // 미점령 중립 도시들
  barracksStock: Record<string, number>; // 종족 유닛 재고
  
  // 타깃팅 및 선택 상태
  selectedHandCardId: string | null;
  selectedAllyId: string | null;
  zoomedCardId: string | null; // 확대 보기 중인 카드
  
  // 전투 및 연출 효과
  combatBanner: string | null;
  logs: string[];
}

export type GameAction =
  | { type: 'START_GAME'; faction: FactionId }
  | { type: 'DRAW_EVENT' }
  | { type: 'PLAY_HAND_CARD'; instanceId: string }
  | { type: 'DEPLOY_ALL_UNITS' }
  | { type: 'PLAY_ALL_GOLD' }
  | { type: 'BUY_MARKET_CARD'; cardId: string }
  | { type: 'BUY_BARRACKS_UNIT'; unitId: string }
  | { type: 'ATTACK_TARGET'; targetType: 'boss' | 'enemy' | 'city'; targetId: string }
  | { type: 'ALL_ATTACK' }
  | { type: 'SET_ZOOM_CARD'; cardId: string | null }
  | { type: 'END_TURN' };
