export interface ElementLayout {
  x: number;       // left offset (px)
  y: number;       // top offset (px)
  w?: number;      // width (px)
  h?: number;      // height (px)
  scale?: number;  // scale factor (0.5 ~ 2.0)
}

export type LayoutKey =
  | 'enemyMat'
  | 'playerMat'
  | 'realm'
  | 'battlefield'
  | 'deck'
  | 'resources'
  | 'support'
  | 'barracks'
  | 'graveyard'
  | 'neutralMarket'  // 우측 상시 공용 마켓 존
  | 'fanHand'
  | 'actionButtons';

export interface LayoutConfig {
  tiltAngle: number; // 3D 틸트 각도 (0 ~ 45 deg, 0이면 완전한 2D 플랫)
  elements: Record<LayoutKey, ElementLayout>;
}

// 100% 개별 조작 가능한 2D/3D 절대 좌표(Absolute Stage) 기본 프리셋
// 1920x960 캔버스 기준, 카드 2배 확대 규격에 맞춘 무간섭 배치
export const DEFAULT_LAYOUT: LayoutConfig = {
  tiltAngle: 12,
  elements: {
    // 1. 상단 적진 영역 (보스 드래곤 + 이벤트 덱 + 적 위협 몬스터 + 적 무덤)
    enemyMat: { x: 20, y: 10, w: 1440, h: 260, scale: 1 },

    // 2. 하단 아군 보드판 배경 (단순 배경 레이어, zIndex: 1)
    playerMat: { x: 20, y: 285, w: 1440, h: 545, scale: 1 },

    // [아군 보드판 위 6대 개별 요소 - 상호작용 0%, 독립 조작]
    // 1) 홈 렐름 (전장의 왼쪽, 가로형)
    realm: { x: 35, y: 300, w: 260, h: 245, scale: 1 },

    // 중앙 전장 (ALLIES)
    battlefield: { x: 310, y: 300, w: 1135, h: 245, scale: 1 },

    // 2) 내 덱 (렐름 아래)
    deck: { x: 35, y: 560, w: 160, h: 255, scale: 1 },

    // 4) 리소스 (덱의 오른쪽)
    resources: { x: 210, y: 560, w: 160, h: 255, scale: 1 },

    // 3) 획득 요새 & 점령 도시 (리소스 오른쪽, 전장 왼쪽 아래)
    support: { x: 385, y: 560, w: 320, h: 255, scale: 1 },

    // 5) 종족 유닛 4종 병영 (서포트 오른쪽, 전장 오른쪽 아래)
    barracks: { x: 720, y: 560, w: 580, h: 255, scale: 1 },

    // 6) 무덤 (종족 유닛 오른쪽)
    graveyard: { x: 1315, y: 560, w: 130, h: 255, scale: 1 },

    // 3. 우측 공용 마켓 (골드 1/2/3 카드 + 중립 도시 4종)
    neutralMarket: { x: 1480, y: 10, w: 360, h: 820, scale: 1 },

    // 4. 하단 부채꼴 손패 (HUD 레이어)
    fanHand: { x: 360, y: 840, w: 840, h: 170, scale: 1 },

    // 5. 우하단 턴 종료 버튼 (단일 전용 액션)
    actionButtons: { x: 1240, y: 850, w: 220, h: 70, scale: 1 },
  }
};

const STORAGE_KEY = 'rune_age_interactive_layout_v3';

export function loadSavedLayout(): LayoutConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tiltAngle: parsed.tiltAngle ?? DEFAULT_LAYOUT.tiltAngle,
        elements: { ...DEFAULT_LAYOUT.elements, ...parsed.elements }
      };
    }
  } catch (e) {
    console.error('Failed to load layout from localStorage', e);
  }
  return DEFAULT_LAYOUT;
}

export function saveLayoutToStorage(config: LayoutConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    saveLayoutToServer(config).catch(() => {});
  } catch (e) {
    console.error('Failed to save layout to localStorage', e);
  }
}

export async function saveLayoutToServer(config: LayoutConfig): Promise<boolean> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    const res = await fetch('/api/save-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config, null, 2)
    });
    return res.ok;
  } catch (e) {
    console.warn('Could not sync layout with server API', e);
    return false;
  }
}

export async function fetchServerLayout(): Promise<LayoutConfig | null> {
  try {
    const res = await fetch('/api/get-layout');
    if (res.ok) {
      const data = await res.json();
      if (data && data.elements) {
        return {
          tiltAngle: data.tiltAngle ?? DEFAULT_LAYOUT.tiltAngle,
          elements: { ...DEFAULT_LAYOUT.elements, ...data.elements }
        };
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}
