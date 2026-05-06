---
id: 11
type: project
title: "FindHealthyRaccoon - 건강한 너구리 찾기 게임"
tech_stacks: ["Python Django", "JavaScript", "Sqlite3", "HTML", "CSS"]
start_date: "2021-01-01"
end_date: "2021-06-30"
thumbnail: ""
---

### 개요

3마리 너구리 중 가장 건강한 너구리를 고르는 웹 게임. **첫 JavaScript 중심 웹 게임**이다. 게임 로직 전체는 프론트엔드(`main.js`)에 들어 있고, Django 백엔드는 점수 저장과 랭킹 조회만 담당한다. Ajax로 둘을 잇는 구조이며, 로컬에서 `py manage.py runserver`로 실행한다 (배포는 하지 않음).

### 모티브

2G 폰에 있던 "폭식하는 곰돌이를 찾아라" 게임에서 출발했다. 그대로 따라 하긴 그래서 곰돌이 → 너구리로 바꾸고, "많이 먹는다"는 행동을 "건강해진다"는 점수로 뒤집었다. 폭식하는 캐릭터를 찾는 게임이 아니라, 가장 건강한 너구리를 찾는 게임으로 다시 짠 결과물이다.

### 기술 스택

- **Backend**: Python, Django
- **Frontend**: JavaScript, HTML, CSS
- **Database**: SQLite3 (점수 저장)
- **Communication**: Ajax (jQuery)

### 게임 규칙

- 한 스테이지에서 너구리 3마리가 같은 시간 동안 각자의 행동을 한다.
- 너구리 행동 = `Sit`(0점) / `Sleep`(1점) / `Eat`(2점) 중 임의 선택. 행동 점수의 누적이 곧 "건강 점수"다.
- 스테이지 종료 시점에 플레이어는 가장 건강 점수가 높은 너구리를 골라야 한다.
- 정답이면 점수 획득 + 다음 스테이지로. 오답이면 즉시 게임오버.
- 게임오버 후 닉네임 입력 → 점수가 서버에 저장되고, 메인의 랭킹 화면(상위 10명)에 반영된다.

### 구현 — 프론트 위주, 얇은 백엔드

Django 측은 모델·뷰·URL이 전부 합쳐 30줄 남짓이다.

```python
# models.py
class User(models.Model):
    name = CharField(max_length=8)
    date = DateTimeField(auto_now_add=True)
    score = IntegerField(default=0)

# urls.py
urlpatterns = [
    path('', views.index, name='index'),
    path('save', views.save, name='save'),
]
```

- `index`: `User.objects.all().order_by("-score")[:10]`을 템플릿으로 내려보내 랭킹 표시.
- `save`: 요청 본문 JSON에서 `name`/`score`를 꺼내 `User` 행을 INSERT.

게임 진행·애니메이션·사운드·상태 관리는 모두 `main.js`에 있다. 이 분담 자체가 학습 목적의 의도된 구조였다 — JavaScript로 게임 루프를 직접 짜고, Ajax로 Django와 데이터를 주고받는 패턴을 시도하기 위함. 게임오버 시점의 `$.ajax({...})` POST가 그 학습의 핵심 코드다.

```js
$.ajax({
    url : saveurl,
    type: 'POST',
    data: JSON.stringify({ 'name': name, 'score' : score }),
    ...
});
```

### 구현 — 단계별 난이도 변화

난이도는 두 축으로 조절된다.

**1. 행동 다양성 확장**

- **1~7스테이지**: 너구리 행동이 `Sit` / `Sleep` 두 가지에서만 선택됨. → 가장 잠을 많이 잔 너구리만 가려내면 된다.
- **8스테이지부터**: `Eat`이 추가되어 세 가지 행동에서 선택됨. → 점수 가중치가 다른 행동들이 섞여 구별이 어려워진다.

**2. 길이/속도 사이클**

```js
let moveCnts = [30, 6, 10, 14, 16, 18, 22];
let speeds   = [60, 120, 120, 100, 100, 80, 80];
```

`stageNum % 7` 인덱스로 매 스테이지의 행동 횟수와 속도가 결정된다. 7개 단위 사이클이 반복되며, 같은 단위 안에서도 길고 빠른 스테이지와 짧고 느린 스테이지가 교차된다.

### 구현 — 점수 공식

스테이지 클리어 시 점수는 다음 공식으로 가산된다.

```js
score += stageNum * moveCnts[stageNum%7] - (Math.max(...stageCnt) - Math.min(...stageCnt));
```

두 의도가 섞여 있다.

- `stageNum * moveCnts[...]`: 스테이지가 높을수록, 행동 횟수가 많을수록 기본 점수가 커진다.
- `- (max - min)`: 너구리 3마리의 건강 점수 격차가 클수록 감점. 즉, **점수 차이가 작아 구별이 어려운 스테이지일수록 보너스가 커지는** 구조다.

### 메모

- 첫 JavaScript 중심 웹 게임이다. ToDoList → SoundMakesFootball을 거치며 Django 백엔드와 템플릿 기반 페이지를 익힌 다음, 이 프로젝트에서 JS 게임 루프와 Ajax 통신을 얹는 단계로 넘어갔다.
- 다음 Django 작업은 NeighBiz로 이어진다 (NeighBiz는 정리 후 별도 등록 예정).
