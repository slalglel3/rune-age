# 룬 에이지 (Rune Age) + 확장팩 공용 연동 안내서 (INTEGRATION GUIDE v2.0.0)

본 문서는 **본판 (Base Game)** 및 **맹세와 모루 확장팩 (Oath and Anvil)** 전체 카드 리소스를 **코드 개발 세션**에서 오차 없이 즉시 불러와 게임 엔진 및 UI에 적용할 수 있도록 정리한 통합 연동 가이드입니다.

---

## 1. 핵심 연동 파일 목록

| 파일명 | 절대 경로 | 용도 및 설명 |
| :--- | :--- | :--- |
| **`card_manifest.json`** | `/home/slalglel/rune_age_assets/card_manifest.json` | **[핵심]** 6대 종족(각 6유닛), 중립 마켓, 10종 용병, 6대 시나리오 전체 카드 ID 및 속성 매니페스트 (v2.0.0) |
| **`CARD_ASSETS_SPEC.md`** | `/home/slalglel/rune_age_assets/CARD_ASSETS_SPEC.md` | 카드 물리 규격(500×700 WebP), 신화 유닛 룰, 확장팩 포함 전체 카드 풀 상세표 |

---

## 2. 확장팩 (Oath and Anvil) 핵심 변경점

1. **6대 종족 체제**:
   * 기존 4대 진영(다칸, 라타리, 와이카, 우툭) + **신규 2대 진영(둔와르 드워프, 부서진 평원 오크)**
2. **병영 6유닛 체제 & 신화 유닛(Mythic Unit)**:
   * 각 종족의 병영이 4개에서 **6개 유닛**으로 확장.
   * 종족당 1개의 최고 티어 **신화 유닛**(`is_mythic: true`) 탑재 (파괴 시 공급처로 돌아가지 않고 버린 카드 더미로 이동).
3. **중립 용병(Mercenary) 10종 탑재**:
   * 영향력(Influence)으로 고용 가능한 용병 덱 추가 (카테고리 1과 2).
4. **신규 시나리오 2종 & 랜드마크(Landmarks)**:
   * 군주의 부상 (Ascent of the Overlord) / 힘을 향한 탐색 (The Quest for Power).

---

## 3. 카드 뒤집기 (3D Flip) UI 표준 가이드

* 앞/뒷면 크기가 **500 × 700 px (5:7)** 로 100% 동일하므로, CSS 3D transform을 적용하면 회전 시 덜컹거림(Jitter) 없이 60fps로 매끄럽게 회전합니다.
* 모서리 라운딩은 이미지 원본을 손상시키지 않고 코드 세션의 CSS(`border-radius: 10px; overflow: hidden;`)로 적용합니다.

---

## 4. 6대 종족 및 시나리오 카드 ID 요약표 (v2.0.0)

### 6대 종족 (홈렐름, 요새, 기념비 + 유닛 6종)
* **다칸 연합 (인간 / `#1E40AF`)**:
  * 렐름: `daqan_realm` | 요새: `daqan_stronghold` | 기념비: `daqan_monument`
  * 유닛: `unit_daqan_footman`, `unit_daqan_bowman`, `unit_daqan_knight`, `unit_daqan_siege_engine`, `unit_daqan_novice_wizard`, `unit_daqan_roc_warrior` (신화)
* **라타리 엘프 (엘프 / `#065F46`)**:
  * 렐름: `latari_realm` | 요새: `latari_stronghold` | 기념비: `latari_monument`
  * 유닛: `unit_latari_deepwood_archer`, `unit_latari_darnati_warrior`, `unit_latari_storm_sorceress`, `unit_latari_pegasus_rider`, `unit_latari_leonx_rider`, `unit_latari_forest_guardian` (신화)
* **와이카의 불멸자들 (언데드 / `#581C87`)**:
  * 렐름: `waiqar_realm` | 요새: `waiqar_stronghold` | 기념비: `waiqar_monument`
  * 유닛: `unit_waiqar_reanimate`, `unit_waiqar_skeleton_archer`, `unit_waiqar_necromancer`, `unit_waiqar_vampire`, `unit_waiqar_dark_noble`, `unit_waiqar_barrow_wyrm` (신화)
* **우툭 일란 (악마 / `#991B1B`)**:
  * 렐름: `uthuk_realm` | 요새: `uthuk_stronghold` | 기념비: `uthuk_monument`
  * 유닛: `unit_uthuk_berserker`, `unit_uthuk_flesh_ripper`, `unit_uthuk_blood_warlock`, `unit_uthuk_chaos_lord`, `unit_uthuk_blood_sister`, `unit_uthuk_obscene` (신화)
* **둔와르의 드워프 (드워프 / `#D97706` ★ 확장 신규)**:
  * 렐름: `dunwarr_realm` | 요새: `dunwarr_stronghold` | 기념비: `dunwarr_monument`
  * 유닛: `unit_dunwarr_sentinel`, `unit_dunwarr_forgemaster`, `unit_dunwarr_guardian`, `unit_dunwarr_demolitionist`, `unit_dunwarr_battering_ram`, `unit_dunwarr_ironclad_golem` (신화)
* **부서진 평원의 오크 (오크 / `#15803D` ★ 확장 신규)**:
  * 렐름: `orc_realm` | 요새: `orc_stronghold` | 기념비: `orc_monument`
  * 유닛: `unit_orc_raider`, `unit_orc_wolf_rider`, `unit_orc_brawler`, `unit_orc_war_shaman`, `unit_orc_chieftain`, `unit_orc_behemoth` (신화)

### 중립 용병 (10종)
* Cat I: `merc_battle_cry`, `merc_forced_march`, `merc_scout`, `merc_alchemist`, `merc_bounty_hunter`
* Cat II: `merc_siege_tower`, `merc_war_catapult`, `merc_dragon_slayer`, `merc_shadow_assassin`, `merc_captain`
