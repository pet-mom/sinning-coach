# 생활사 데이터 스키마 (src/data/*.json)

각 파일은 JSON 배열이다. 항목 하나는 게임 속 한 장면(기록 한 줄)과 그 근거다.

```json
{
  "id": "epi-001",                     // 파일 접두어 + 번호, 전체에서 유일
  "cat": "epidemic",                   // epidemic|death|medicine|marriage|family|childhood|education|rural|work|food|urban|religion|festival|belief|crime|revolution|war|economy
  "text": "마을에 천연두가 돌아 이웃집 아이 셋이 한 달 사이에 죽었다.",   // 한국어, 주어 없는 과거형 서술, 120자 이내
  "fx": {"hp": -3},                    // 선택. 키: hp edu soc cour faith fame sus pol money. 정수, money는 -300~300, 나머지 -15~15
  "when": {"from": 1750, "to": 1850, "months": [6,7,8]},   // 연도 범위(포함). months(1~12) 선택
  "who": {                             // 모두 선택. 생략하면 누구에게나
    "sex": "M",                        // "M" | "F"
    "age": [16, 60],                   // 나이 범위(포함)
    "estate": ["peasant","artisan"],   // peasant artisan bourgeois hobereau robe epee
    "region": ["paris","bretagne"],    // paris lyon bordeaux marseille nantes rouen bretagne vendee normandie picardie champagne alsace bourgogne auvergne languedoc provence gascogne ile
    "urban": true,                     // true=도시(paris lyon bordeaux marseille nantes rouen), false=농촌
    "married": true,
    "literate": true,
    "job": ["farm","craft"],           // farm craft law church army pol letters
    "faith": "protestant"              // catholic | protestant | jewish
  },
  "w": 1,                              // 등장 가중치 0.2~3 (흔한 일은 크게)
  "once": false,                       // 한 생애에 한 번만
  "fact": "18세기 프랑스 천연두는 전체 사망의 약 10%를 차지했다.",   // 한국어 한 문장. 수치·사실. 기록의 ‘자료’ 줄로 나온다
  "src": [{"cite": "저자 (연도), 「제목」, 학술지 권(호): 쪽", "url": "https://www.persee.fr/doc/..."}]
}
```

규칙
- `src`는 학술 논문·학술지·대학 출판 연구서 등 실제로 확인한 자료만. URL은 실제로 열리는 주소(Persée, Cairn, OpenEdition, JSTOR, DOI, HAL, Gallica, 대학 저장소). 지어낸 DOI·쪽수 금지.
- 같은 출처를 여러 항목에 써도 된다.
- `text`는 플레이어가 겪거나 목격하는 장면. `fact`는 그 근거가 되는 통계나 사실.
- `fx`는 사건의 무게에 비례해 작게. 대부분 0~3, 큰 사건만 5 이상.
