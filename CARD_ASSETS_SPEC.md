# 룬 에이지 (Rune Age) + 맹세와 모루 (Oath and Anvil) 전체 카드 에셋 명세서 (v2.0.0)

본 문서는 **본판 (Base Game)** 및 **확장팩 (Oath and Anvil Expansion)** 전체 풀 세트를 지원하는 공식 에셋 명세서입니다.

* **기계 판독용 JSON 매니페스트**: `/home/slalglel/rune_age_assets/card_manifest.json`

---

## 1. 표준 에셋 물리 규격

* **해상도 및 크기**: **500 × 700 px** (5:7 종횡비)
* **포맷**: `WebP` (품질 85%, 모바일 OOM 차단 최적화)
* **모서리(Border-radius) 원칙**: 원본 이미지는 직사각형(Square)을 유지하고 CSS(`border-radius: 10px; overflow: hidden;`)에서 깎음.

---

## 2. 카드 뒷면 (Card Backs) 4종

| 카드 ID | 명칭 | 파일 상대 경로 | 적용 대상 |
| :--- | :--- | :--- | :--- |
| `back_player_deck` | 플레이어 공통 뒷면 | `assets/cards/backs/back_player.webp` | 6대 종족 유닛, 골드, 중립 도시, 점령 카드 등 플레이어 덱에 들어가는 모든 카드 |
| `back_event_deck` | 시나리오 이벤트 덱 뒷면 | `assets/cards/backs/back_event.webp` | 시나리오 이벤트 카드 더미 |
| `back_dragonlord` | 드래곤 로드 뒷면 | `assets/cards/backs/back_dragon.webp` | 최종 보스 드래곤 로드 카드 |
| `back_mercenary` | 용병 카드 뒷면 | `assets/cards/backs/back_mercenary.webp` | 확장팩 중립 용병 카드 |

---

## 3. 6대 종족 전체 카드 풀 (각 6종 유닛 + 홈렐름 + 요새 + 기념비)

### ① 다칸 연합 (The Daqan Lords - 인간 / `#1E40AF`)
* **홈 렐름**: `daqan_realm` (HP 20) | **요새**: `daqan_stronghold` | **기념비**: `daqan_monument`
* **유닛 6종**:
  1. `unit_daqan_footman` (보병 / 비용 1 / 공격 1) [본판]
  2. `unit_daqan_bowman` (궁병 / 비용 2 / 공격 2) [본판]
  3. `unit_daqan_knight` (기사 / 비용 3 / 공격 3) [본판]
  4. `unit_daqan_siege_engine` (공성 병기 / 비용 5 / 공격 4) [본판]
  5. `unit_daqan_novice_wizard` (수습 마법사 / 비용 2 / 공격 1) [확장]
  6. `unit_daqan_roc_warrior` (로크 전사 / 비용 5 / 공격 4) ★ **신화 유닛** [확장]

### ② 라타리 엘프 (The Latari Elves - 엘프 / `#065F46`)
* **홈 렐름**: `latari_realm` (HP 20) | **요새**: `latari_stronghold` | **기념비**: `latari_monument`
* **유닛 6종**:
  1. `unit_latari_deepwood_archer` (깊은숲 궁수 / 비용 1 / 공격 1) [본판]
  2. `unit_latari_darnati_warrior` (다르나티 전사 / 비용 2 / 공격 2) [본판]
  3. `unit_latari_storm_sorceress` (폭풍 마법사 / 비용 3 / 공격 2) [본판]
  4. `unit_latari_pegasus_rider` (페가수스 기수 / 비용 5 / 공격 3) [본판]
  5. `unit_latari_leonx_rider` (레옹크스 기수 / 비용 3 / 공격 2) [확장]
  6. `unit_latari_forest_guardian` (숲의 수호자 / 비용 6 / 공격 4) ★ **신화 유닛** [확장]

### ③ 와이카의 불멸자들 (Waiqar the Undying - 언데드 / `#581C87`)
* **홈 렐름**: `waiqar_realm` (HP 20) | **요새**: `waiqar_stronghold` | **기념비**: `waiqar_monument`
* **유닛 6종**:
  1. `unit_waiqar_reanimate` (부활한 시체 / 비용 1 / 공격 1) [본판]
  2. `unit_waiqar_skeleton_archer` (해골 궁수 / 비용 2 / 공격 2) [본판]
  3. `unit_waiqar_necromancer` (강령술사 / 비용 3 / 공격 2) [본판]
  4. `unit_waiqar_vampire` (흡혈귀 / 비용 5 / 공격 4) [본판]
  5. `unit_waiqar_dark_noble` (암흑 귀족 / 비용 3 / 공격 2) [확장]
  6. `unit_waiqar_barrow_wyrm` (고분 웜 / 비용 6 / 공격 5) ★ **신화 유닛** [확장]

### ④ 우툭 일란 (The Uthuk Y'llan - 악마/야만족 / `#991B1B`)
* **홈 렐름**: `uthuk_realm` (HP 20) | **요새**: `uthuk_stronghold` | **기념비**: `uthuk_monument`
* **유닛 6종**:
  1. `unit_uthuk_berserker` (광전사 / 비용 1 / 공격 1, 부상 시 +2) [본판]
  2. `unit_uthuk_flesh_ripper` (살점 찢는 자 / 비용 2 / 공격 2) [본판]
  3. `unit_uthuk_blood_warlock` (피의 마법사 / 비용 3 / 공격 3) [본판]
  4. `unit_uthuk_chaos_lord` (혼돈의 군주 / 비용 5 / 공격 4) [본판]
  5. `unit_uthuk_blood_sister` (피의 자매 / 비용 2 / 공격 2) [확장]
  6. `unit_uthuk_obscene` (옵신 / 비용 5 / 공격 5) ★ **신화 유닛** [확장]

### ⑤ 둔와르의 드워프 (The Dwarves of Dunwarr - 드워프 / `#D97706` ★ 확장 신규)
* **홈 렐름**: `dunwarr_realm` (HP 20) | **요새**: `dunwarr_stronghold` | **기념비**: `dunwarr_monument`
* **유닛 6종**:
  1. `unit_dunwarr_sentinel` (파수꾼 / 비용 1 / 공격 1)
  2. `unit_dunwarr_forgemaster` (대장장이 / 비용 2 / 공격 2)
  3. `unit_dunwarr_guardian` (수호자 / 비용 3 / 공격 3)
  4. `unit_dunwarr_demolitionist` (폭파전문가 / 비용 4 / 공격 3)
  5. `unit_dunwarr_battering_ram` (공성 망치 / 비용 4 / 공격 4)
  6. `unit_dunwarr_ironclad_golem` (철갑 골렘 / 비용 6 / 공격 5) ★ **신화 유닛**

### ⑥ 부서진 평원의 오크 (The Orcs of the Broken Plains - 오크 / `#15803D` ★ 확장 신규)
* **홈 렐름**: `orc_realm` (HP 20) | **요새**: `orc_stronghold` | **기념비**: `orc_monument`
* **유닛 6종**:
  1. `unit_orc_raider` (부족 약탈자 / 비용 1 / 공격 1)
  2. `unit_orc_wolf_rider` (늑대 기수 / 비용 2 / 공격 2)
  3. `unit_orc_brawler` (싸움꾼 / 비용 3 / 공격 3)
  4. `unit_orc_war_shaman` (전쟁 주술사 / 비용 3 / 공격 2)
  5. `unit_orc_chieftain` (부족 족장 / 비용 5 / 공격 4)
  6. `unit_orc_behemoth` (베히모스 / 비용 6 / 공격 5) ★ **신화 유닛**

---

## 4. 중립 용병 (Mercenaries - 10종)

* **카테고리 I (기본 용병)**:
  * `merc_battle_cry` (전투 함성 / 비용 3 영향력)
  * `merc_forced_march` (강제 행군 / 비용 2 영향력)
  * `merc_scout` (정찰병 / 비용 2 영향력 / 공격 1)
  * `merc_alchemist` (연금술사 / 비용 3 영향력)
  * `merc_bounty_hunter` (현상금 사냥꾼 / 비용 4 영향력 / 공격 2)
* **카테고리 II (고급/공성 용병)**:
  * `merc_siege_tower` (공성탑 / 비용 5 영향력 / 공격 4 / Siege)
  * `merc_war_catapult` (전쟁 투석기 / 비용 4 영향력 / 공격 3 / Siege)
  * `merc_dragon_slayer` (용 사냥꾼 / 비용 5 영향력 / 공격 4)
  * `merc_shadow_assassin` (그림자 암살자 / 비용 4 영향력 / 공격 3)
  * `merc_captain` (용병대장 / 비용 6 영향력 / 공격 5)

---

## 5. 공용 마켓 및 시나리오

* **골드 3종**: `gold_1`, `gold_2`, `gold_3`
* **중립 도시 & 랜드마크**:
  * 도시: `city_tamalir`, `city_riverwatch`, `city_forge`, `city_dawnsmoor`
  * 랜드마크 [확장]: `landmark_great_library` (대도서관), `landmark_sunken_temple` (가라앉은 사원)
* **시나리오 6종**:
  1. 용군주의 부활 (Resurgence of the Dragonlords) + 확장 변형 이벤트
  2. 기념비 (The Monument)
  3. 룬 전쟁 (Runewars)
  4. 대격변 (The Cataclysm)
  5. 군주의 부상 (Ascent of the Overlord) [확장 신규]
  6. 힘을 향한 탐색 (The Quest for Power) [확장 신규]
