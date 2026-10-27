import { CardDefinition, FactionId } from '../types/game';

export const FACTION_INFO: Record<FactionId, { name_ko: string; name_en: string; color: string; desc: string }> = {
  daqan: {
    name_ko: '다칸 연합',
    name_en: 'The Daqan Lords',
    color: '#1E40AF',
    desc: '인간 진영 - 공수 밸런스, 영향력 특화 및 강력한 공성 병기'
  },
  latari: {
    name_ko: '라타리 엘프',
    name_en: 'The Latari Elves',
    color: '#065F46',
    desc: '엘프 진영 - 드로우 가속, 덱 순환, 민첩한 기동력'
  },
  waiqar: {
    name_ko: '와이카의 불멸자들',
    name_en: 'Waiqar the Undying',
    color: '#581C87',
    desc: '언데드 진영 - 무덤(버린더미) 부활 및 카드 희생 연계'
  },
  uthuk: {
    name_ko: '우툭 일란',
    name_en: 'The Uthuk Y\'llan',
    color: '#991B1B',
    desc: '악마/야만족 - 자해와 부상을 통한 폭발적인 공격력'
  }
};

export const ALL_CARDS: Record<string, CardDefinition> = {
  // === 다칸 연합 (인간) ===
  'daqan_realm': {
    id: 'daqan_realm',
    name_ko: '다칸 연합 홈 렐름',
    name_en: 'Daqan Home Realm',
    type: 'realm',
    faction: 'daqan',
    cost: 0,
    cost_type: 'gold',
    hp: 20,
    asset_front: 'assets/cards/daqan/daqan_realm.webp',
    description_ko: '다칸 연합의 중심 수도 (체력 20)'
  },
  'daqan_stronghold': {
    id: 'daqan_stronghold',
    name_ko: '다칸 요새',
    name_en: 'Daqan Stronghold',
    type: 'stronghold',
    faction: 'daqan',
    cost: 4,
    cost_type: 'gold',
    influence_value: 2,
    asset_front: 'assets/cards/daqan/daqan_stronghold.webp',
    description_ko: '영향력 +2를 제공하는 견고한 요새'
  },
  'unit_daqan_footman': {
    id: 'unit_daqan_footman',
    name_ko: '보병',
    name_en: 'Footman',
    type: 'unit',
    faction: 'daqan',
    cost: 1,
    cost_type: 'gold',
    strength: 1,
    card_limit: 6,
    asset_front: 'assets/cards/daqan/unit_footman.webp',
    description_ko: '기본 보병 부대 (전투력 1)'
  },
  'unit_daqan_bowman': {
    id: 'unit_daqan_bowman',
    name_ko: '궁병',
    name_en: 'Bowman',
    type: 'unit',
    faction: 'daqan',
    cost: 2,
    cost_type: 'gold',
    strength: 2,
    card_limit: 5,
    asset_front: 'assets/cards/daqan/unit_bowman.webp',
    description_ko: '원거리 지원 궁병 (전투력 2)'
  },
  'unit_daqan_knight': {
    id: 'unit_daqan_knight',
    name_ko: '기사',
    name_en: 'Knight',
    type: 'unit',
    faction: 'daqan',
    cost: 3,
    cost_type: 'gold',
    strength: 3,
    card_limit: 4,
    asset_front: 'assets/cards/daqan/unit_knight.webp',
    description_ko: '전투력 3 / [징집] 전투 참여 시 덱 맨 위 카드를 확인하여 유닛인 경우에만 추가 참전 (골드 징집 불가 규칙 수정)'
  },
  'unit_daqan_siege_engine': {
    id: 'unit_daqan_siege_engine',
    name_ko: '공성 병기',
    name_en: 'Siege Engine',
    type: 'unit',
    faction: 'daqan',
    cost: 5,
    cost_type: 'gold',
    strength: 4,
    card_limit: 3,
    asset_front: 'assets/cards/daqan/unit_siege_engine.webp',
    description_ko: '도시와 요새를 파괴하는 강력한 공성기 (전투력 4)'
  },

  // === 라타리 엘프 ===
  'latari_realm': {
    id: 'latari_realm',
    name_ko: '라타리 엘프 홈 렐름',
    name_en: 'Latari Home Realm',
    type: 'realm',
    faction: 'latari',
    cost: 0,
    cost_type: 'gold',
    hp: 20,
    asset_front: 'assets/cards/latari/latari_realm.webp'
  },
  'unit_latari_deepwood_archer': {
    id: 'unit_latari_deepwood_archer',
    name_ko: '깊은숲 궁수',
    name_en: 'Deepwood Archer',
    type: 'unit',
    faction: 'latari',
    cost: 1,
    cost_type: 'gold',
    strength: 1,
    card_limit: 6,
    asset_front: 'assets/cards/latari/unit_deepwood_archer.webp'
  },
  'unit_latari_darnati_warrior': {
    id: 'unit_latari_darnati_warrior',
    name_ko: '다르나티 전사',
    name_en: 'Darnati Warrior',
    type: 'unit',
    faction: 'latari',
    cost: 2,
    cost_type: 'gold',
    strength: 2,
    card_limit: 5,
    asset_front: 'assets/cards/latari/unit_darnati_warrior.webp'
  },
  'unit_latari_storm_sorceress': {
    id: 'unit_latari_storm_sorceress',
    name_ko: '폭풍의 주술사',
    name_en: 'Storm Sorceress',
    type: 'unit',
    faction: 'latari',
    cost: 3,
    cost_type: 'gold',
    strength: 2,
    influence_value: 2,
    card_limit: 4,
    asset_front: 'assets/cards/latari/unit_storm_sorceress.webp',
    description_ko: '전투력 2 / [특수 능력] 플레이 시 영향력 +2 획득 후 버려짐 (파괴되지 않음)'
  },
  'unit_latari_pegasus_rider': {
    id: 'unit_latari_pegasus_rider',
    name_ko: '페가수스 기수',
    name_en: 'Pegasus Rider',
    type: 'unit',
    faction: 'latari',
    cost: 5,
    cost_type: 'gold',
    strength: 3,
    card_limit: 3,
    asset_front: 'assets/cards/latari/unit_pegasus_rider.webp'
  },

  // === 와이카의 불멸자들 (언데드) ===
  'waiqar_realm': {
    id: 'waiqar_realm',
    name_ko: '와이카 홈 렐름',
    name_en: 'Waiqar Home Realm',
    type: 'realm',
    faction: 'waiqar',
    cost: 0,
    cost_type: 'gold',
    hp: 20,
    asset_front: 'assets/cards/waiqar/waiqar_realm.webp'
  },
  'unit_waiqar_reanimate': {
    id: 'unit_waiqar_reanimate',
    name_ko: '부활한 시체',
    name_en: 'Reanimate',
    type: 'unit',
    faction: 'waiqar',
    cost: 1,
    cost_type: 'gold',
    strength: 1,
    card_limit: 6,
    asset_front: 'assets/cards/waiqar/unit_reanimate.webp'
  },
  'unit_waiqar_skeleton_archer': {
    id: 'unit_waiqar_skeleton_archer',
    name_ko: '해골 궁수',
    name_en: 'Skeleton Archer',
    type: 'unit',
    faction: 'waiqar',
    cost: 2,
    cost_type: 'gold',
    strength: 2,
    card_limit: 5,
    asset_front: 'assets/cards/waiqar/unit_skeleton_archer.webp'
  },
  'unit_waiqar_necromancer': {
    id: 'unit_waiqar_necromancer',
    name_ko: '강령술사',
    name_en: 'Necromancer',
    type: 'unit',
    faction: 'waiqar',
    cost: 3,
    cost_type: 'gold',
    strength: 2,
    card_limit: 4,
    asset_front: 'assets/cards/waiqar/unit_necromancer.webp'
  },
  'unit_waiqar_vampire': {
    id: 'unit_waiqar_vampire',
    name_ko: '흡혈귀',
    name_en: 'Vampire',
    type: 'unit',
    faction: 'waiqar',
    cost: 5,
    cost_type: 'gold',
    strength: 4,
    card_limit: 3,
    asset_front: 'assets/cards/waiqar/unit_vampire.webp'
  },

  // === 우툭 일란 (악마) ===
  'uthuk_realm': {
    id: 'uthuk_realm',
    name_ko: '우툭 홈 렐름',
    name_en: 'Uthuk Home Realm',
    type: 'realm',
    faction: 'uthuk',
    cost: 0,
    cost_type: 'gold',
    hp: 20,
    asset_front: 'assets/cards/uthuk/uthuk_realm.webp'
  },
  'unit_uthuk_berserker': {
    id: 'unit_uthuk_berserker',
    name_ko: '광전사',
    name_en: 'Berserker',
    type: 'unit',
    faction: 'uthuk',
    cost: 1,
    cost_type: 'gold',
    strength: 1,
    card_limit: 6,
    asset_front: 'assets/cards/uthuk/unit_berserker.webp'
  },
  'unit_uthuk_flesh_ripper': {
    id: 'unit_uthuk_flesh_ripper',
    name_ko: '살점 찢는 자',
    name_en: 'Flesh Ripper',
    type: 'unit',
    faction: 'uthuk',
    cost: 2,
    cost_type: 'gold',
    strength: 2,
    card_limit: 5,
    asset_front: 'assets/cards/uthuk/unit_flesh_ripper.webp'
  },
  'unit_uthuk_blood_warlock': {
    id: 'unit_uthuk_blood_warlock',
    name_ko: '피의 마법사',
    name_en: 'Blood Warlock',
    type: 'unit',
    faction: 'uthuk',
    cost: 3,
    cost_type: 'gold',
    strength: 3,
    card_limit: 4,
    asset_front: 'assets/cards/uthuk/unit_blood_warlock.webp'
  },
  'unit_uthuk_chaos_lord': {
    id: 'unit_uthuk_chaos_lord',
    name_ko: '혼돈의 군주',
    name_en: 'Chaos Lord',
    type: 'unit',
    faction: 'uthuk',
    cost: 5,
    cost_type: 'gold',
    strength: 4,
    card_limit: 3,
    asset_front: 'assets/cards/uthuk/unit_chaos_lord.webp'
  },

  // === 공용 마켓 (골드) ===
  'gold_1': {
    id: 'gold_1',
    name_ko: '1 골드',
    name_en: '1 Gold',
    type: 'gold',
    cost: 0,
    cost_type: 'gold',
    gold_value: 1,
    asset_front: 'assets/cards/neutral/gold_1.webp',
    description_ko: '플레이 시 1골드를 생성합니다.'
  },
  'gold_2': {
    id: 'gold_2',
    name_ko: '2 골드',
    name_en: '2 Gold',
    type: 'gold',
    cost: 3,
    cost_type: 'gold',
    gold_value: 2,
    asset_front: 'assets/cards/neutral/gold_2.webp',
    description_ko: '플레이 시 2골드를 생성합니다.'
  },
  'gold_3': {
    id: 'gold_3',
    name_ko: '3 골드',
    name_en: '3 Gold',
    type: 'gold',
    cost: 6,
    cost_type: 'gold',
    gold_value: 3,
    asset_front: 'assets/cards/neutral/gold_3.webp',
    description_ko: '플레이 시 3골드를 생성합니다.'
  },

  // === 중립 도시 ===
  'city_tamalir': {
    id: 'city_tamalir',
    name_ko: '타말리르',
    name_en: 'Tamalir',
    type: 'city',
    cost: 0,
    cost_type: 'gold',
    defense: 3,
    influence_value: 2,
    asset_front: 'assets/cards/neutral/city_tamalir.webp',
    description_ko: '방어력 3 / 점령 시 영향력 +2 획득'
  },
  'city_riverwatch': {
    id: 'city_riverwatch',
    name_ko: '리버워치',
    name_en: 'Riverwatch',
    type: 'city',
    cost: 0,
    cost_type: 'gold',
    defense: 4,
    influence_value: 3,
    asset_front: 'assets/cards/neutral/city_riverwatch.webp',
    description_ko: '방어력 4 / 점령 시 영향력 +3 획득'
  },
  'city_forge': {
    id: 'city_forge',
    name_ko: '포지',
    name_en: 'Forge',
    type: 'city',
    cost: 0,
    cost_type: 'gold',
    defense: 4,
    influence_value: 3,
    asset_front: 'assets/cards/neutral/city_forge.webp',
    description_ko: '방어력 4 / 점령 시 영향력 +3 획득'
  },
  'city_dawnsmoor': {
    id: 'city_dawnsmoor',
    name_ko: '던스무어',
    name_en: 'Dawnsmoor',
    type: 'city',
    cost: 0,
    cost_type: 'gold',
    defense: 5,
    influence_value: 4,
    asset_front: 'assets/cards/neutral/city_dawnsmoor.webp',
    description_ko: '방어력 5 / 점령 시 영향력 +4 획득'
  },

  // === 시나리오: 용군주의 부활 ===
  'boss_dragonlord': {
    id: 'boss_dragonlord',
    name_ko: '고대 드래곤 로드',
    name_en: 'Ancient Dragonlord',
    type: 'boss',
    cost: 0,
    cost_type: 'gold',
    strength: 8,
    defense: 8,
    hp: 12,
    asset_front: 'assets/cards/scenario_dragonlords/boss_dragonlord.webp',
    description_ko: '테리노스를 파멸시키려는 고대 드래곤 (체력 12 / 전투력 8)'
  },
  'event_dragon_spawn': {
    id: 'event_dragon_spawn',
    name_ko: '드래곤의 유충들',
    name_en: 'Dragon Spawn',
    type: 'event',
    cost: 0,
    cost_type: 'gold',
    strength: 2,
    defense: 2,
    asset_front: 'assets/cards/scenario_dragonlords/event_dragon_spawn.webp',
    description_ko: '티어 1 위협: 처치하지 않으면 턴마다 홈 렐름에 1 데미지'
  },
  'event_drake_raiders': {
    id: 'event_drake_raiders',
    name_ko: '드레이크 약탈단',
    name_en: 'Drake Raiders',
    type: 'event',
    cost: 0,
    cost_type: 'gold',
    strength: 4,
    defense: 4,
    asset_front: 'assets/cards/scenario_dragonlords/event_drake_raiders.webp',
    description_ko: '티어 2 위협: 처치하지 않으면 턴마다 홈 렐름에 2 데미지'
  },
  'event_dragon_wrath': {
    id: 'event_dragon_wrath',
    name_ko: '용의 분노',
    name_en: 'Dragon\'s Wrath',
    type: 'event',
    cost: 0,
    cost_type: 'gold',
    strength: 6,
    defense: 6,
    asset_front: 'assets/cards/scenario_dragonlords/event_dragon_wrath.webp',
    description_ko: '티어 3 재앙: 강력한 화염 폭풍! 처치하지 못하면 3 데미지'
  }
};

/** 종족별 4개 유닛 ID 목록 */
export const FACTION_UNITS: Record<FactionId, string[]> = {
  daqan: [
    'unit_daqan_footman',
    'unit_daqan_bowman',
    'unit_daqan_knight',
    'unit_daqan_siege_engine'
  ],
  latari: [
    'unit_latari_deepwood_archer',
    'unit_latari_darnati_warrior',
    'unit_latari_storm_sorceress',
    'unit_latari_pegasus_rider'
  ],
  waiqar: [
    'unit_waiqar_reanimate',
    'unit_waiqar_skeleton_archer',
    'unit_waiqar_necromancer',
    'unit_waiqar_vampire'
  ],
  uthuk: [
    'unit_uthuk_berserker',
    'unit_uthuk_flesh_ripper',
    'unit_uthuk_blood_warlock',
    'unit_uthuk_chaos_lord'
  ]
};

/** 기본 카드 뒷면 매핑 */
export const CARD_BACKS = {
  player: 'assets/cards/backs/back_player.webp',
  event: 'assets/cards/backs/back_event.webp',
  dragon: 'assets/cards/backs/back_dragon.webp'
};
