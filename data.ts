import { Scenario } from './types';

export const SCENARIOS: Record<string, Scenario> = {
  MOON: {
    id: 'MOON',
    title: 'NASA 달 생존 게임',
    description: '당신은 달 탐사 임무 중 우주선 고장으로 달의 밝은 면에 있는 모선과 도킹하지 못하고, 약 200마일(320km) 떨어진 곳에 불시착했습니다. 우주선의 많은 장비가 파손되었고, 생존을 위해서는 모선까지 이동해야 합니다. 200마일의 여정을 위해 남아있는 15개의 장비 중 가장 중요한 것들을 선택해야 합니다.',
    themeColor: 'slate',
    expertEntity: 'NASA',
    survivalTips: [
      '산소와 물은 생물학적 생존을 위해 가장 중요합니다.',
      '기지를 찾기 위한 항법 도구(별자리 지도)가 그 다음으로 중요합니다.',
      '구조를 위해서는 통신 수단이 필수적입니다.',
      '달에는 대기가 없고, 중력이 약하며, 기온 차가 극심하다는 환경을 고려해야 합니다.'
    ],
    items: [
      { id: 'm1', name: '성냥 한 갑', expertRank: 15, rationale: '사실상 쓸모없습니다. 달에는 연소를 지속시킬 산소가 없습니다.' },
      { id: 'm2', name: '농축 식량', expertRank: 4, rationale: '에너지 필요량을 효율적으로 공급할 수 있습니다.' },
      { id: 'm3', name: '나일론 밧줄 50피트', expertRank: 6, rationale: '절벽을 오르거나 부상자를 함께 묶는 데 유용합니다.' },
      { id: 'm4', name: '낙하산 천', expertRank: 8, rationale: '태양 광선으로부터 보호할 수 있습니다.' },
      { id: 'm5', name: '휴대용 난방기', expertRank: 13, rationale: '달의 어두운 면에 있지 않는 한 필요하지 않습니다.' },
      { id: 'm6', name: '45구경 권총 2정', expertRank: 11, rationale: '자기 추진의 수단으로 사용 가능합니다 (반동 이용).' },
      { id: 'm7', name: '분유 1상자', expertRank: 12, rationale: '농축 식량과 중복되는 부피가 큰 음식입니다.' },
      { id: 'm8', name: '산소탱크 2개 (각 100lb)', expertRank: 1, rationale: '가장 중요한 생존 필수품입니다. (달의 중력이 지구의 1/6이므로 무게는 문제되지 않습니다).' },
      { id: 'm9', name: '별자리 지도', expertRank: 3, rationale: '주요 항법 수단입니다. 달에서 보이는 별의 패턴은 지구와 본질적으로 동일합니다.' },
      { id: 'm10', name: '자동팽창 구명보트', expertRank: 9, rationale: '추진력을 위해 CO2 병을 사용할 수 있으며, 물건을 운반하는 수단으로 쓸 수 있습니다.' },
      { id: 'm11', name: '자기 나침반', expertRank: 14, rationale: '달에는 자기장이 거의 없어 항법용으로 쓸모없습니다.' },
      { id: 'm12', name: '물 20리터', expertRank: 2, rationale: '생존을 위해 수분 보충이 필수적입니다 (특히 달의 밝은 면에서 땀으로 인한 손실 보충).' },
      { id: 'm13', name: '조명탄', expertRank: 10, rationale: '모선이 시야에 들어왔을 때 신호용으로 사용 가능합니다.' },
      { id: 'm14', name: '응급 처치 키트', expertRank: 7, rationale: '부상이나 질병 시 약물이 필요하며, 주사기는 우주복 특수 구멍에 맞습니다.' },
      { id: 'm15', name: '태양열 FM 송수신기', expertRank: 5, rationale: '모선과 통신할 수 있는 유일한 방법입니다 (단, FM은 가시거리 내에서만 작동).' },
    ]
  },
  SEA: {
    id: 'SEA',
    title: '해상 조난 게임',
    description: '친구들과 대서양 횡단 요트 여행 중 화재가 발생하여 선장과 선원을 잃고 요트는 서서히 침몰하고 있습니다. 화재 진압 과정에서 위치 파악에 실패하여 현재 위치는 불분명하며, 가장 가까운 육지에서 약 1,000마일 떨어져 있는 것으로 추정됩니다. 손상되지 않은 15개의 물품을 이용해 구조될 때까지 생존해야 합니다.',
    themeColor: 'cyan',
    expertEntity: '해안경비대',
    survivalTips: [
      '구조 신호 장치가 식량/물보다 우선입니다 (대부분 첫 36시간 내 구조됨).',
      '항법 도구는 중요도가 낮습니다 (작은 보트로는 육지 도달 불가능).',
      '구조가 지연될 경우 식수가 가장 중요합니다.'
    ],
    items: [
      { id: 's1', name: '면도용 거울', expertRank: 1, rationale: '햇빛 반사를 통해 구조대에게 신호를 보내는 가장 중요한 도구입니다.' },
      { id: 's2', name: '기름/석유 혼합물 2갤런', expertRank: 2, rationale: '물에 뜨며 지폐와 성냥으로 점화하여 신호를 보낼 수 있어 매우 중요합니다.' },
      { id: 's3', name: '물 5갤런', expertRank: 3, rationale: '땀으로 손실된 수분을 보충하는 데 필수적입니다.' },
      { id: 's4', name: '군용 식량 1상자', expertRank: 4, rationale: '기본적인 에너지 섭취를 위해 필요합니다.' },
      { id: 's5', name: '불투명 플라스틱 (20sq ft)', expertRank: 5, rationale: '빗물을 모으거나 비바람을 피하는 보호막으로 사용합니다.' },
      { id: 's6', name: '초콜릿 바 2상자', expertRank: 6, rationale: '예비 식량입니다.' },
      { id: 's7', name: '낚시 도구', expertRank: 7, rationale: '물고기를 잡을 보장이 없으므로 확실한 식량(초콜릿)보다 순위가 낮습니다.' },
      { id: 's8', name: '나일론 밧줄 15피트', expertRank: 8, rationale: '장비가 떠내려가지 않게 묶거나 사람들을 서로 연결하는 데 사용합니다.' },
      { id: 's9', name: '부유식 방석', expertRank: 9, rationale: '사람이 물에 빠졌을 때 구명조끼 대용으로 쓸 수 있습니다.' },
      { id: 's10', name: '상어 기피제', expertRank: 10, rationale: '상어의 공격을 받을 경우 필요합니다.' },
      { id: 's11', name: '160도 럼주 1쿼트', expertRank: 11, rationale: '알코올 80%로 소독제로는 쓸 수 있지만, 마시면 탈수를 유발하여 위험합니다.' },
      { id: 's12', name: '소형 트랜지스터 라디오', expertRank: 12, rationale: '송신 기능이 없고 육지 라디오 수신 범위를 벗어나 가치가 거의 없습니다.' },
      { id: 's13', name: '태평양 지도', expertRank: 13, rationale: '항법 장비 없이 지도만으로는 현재 위치를 알 수 없어 무용지물입니다.' },
      { id: 's14', name: '모기장', expertRank: 14, rationale: '대서양 한가운데에는 모기가 없습니다.' },
      { id: 's15', name: '육분의', expertRank: 15, rationale: '정확한 시간(크로노미터)과 천체력 없이는 위치를 파악할 수 없습니다.' },
    ]
  }
};