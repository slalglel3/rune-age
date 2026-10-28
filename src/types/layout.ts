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
  tiltAngle: number; // 3D 틸트 각도 (0 ~ 45 deg)
  elements: Record<LayoutKey, ElementLayout>;
}

// 2배 커진 카드 크기와 확장된 보드판에 맞춘 기본 레이아웃 프리셋
export const DEFAULT_LAYOUT: LayoutConfig = {
  tiltAngle: 16,
  elements: {
    enemyMat: { x: 0, y: 0, w: 1450, h: 280, scale: 1 },
    playerMat: { x: 0, y: 0, w: 1450, h: 540, scale: 1 },
    realm: { x: 0, y: 0, w: 260, h: 190, scale: 1 },
    battlefield: { x: 0, y: 0, w: 1100, h: 270, scale: 1 },
    deck: { x: 0, y: 0, w: 170, h: 240, scale: 1 },
    resources: { x: 0, y: 0, w: 170, h: 180, scale: 1 },
    support: { x: 0, y: 0, w: 320, h: 240, scale: 1 },
    barracks: { x: 0, y: 0, w: 720, h: 240, scale: 1 },
    graveyard: { x: 0, y: 0, w: 170, h: 240, scale: 1 },
    neutralMarket: { x: 0, y: 0, w: 320, h: 840, scale: 1 },
    fanHand: { x: 0, y: 0, w: 800, h: 240, scale: 1 },
    actionButtons: { x: 0, y: 0, w: 240, h: 90, scale: 1 },
  }
};

const STORAGE_KEY = 'rune_age_interactive_layout_v2';

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
    // 백엔드 API로도 백그라운드 자동 동기화
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
      return {
        tiltAngle: data.tiltAngle ?? DEFAULT_LAYOUT.tiltAngle,
        elements: { ...DEFAULT_LAYOUT.elements, ...data.elements }
      };
    }
  } catch (e) {
    // ignore
  }
  return null;
}
