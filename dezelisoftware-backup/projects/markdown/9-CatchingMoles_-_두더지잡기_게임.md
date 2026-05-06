---
id: 9
type: project
title: "CatchingMoles - 두더지잡기 게임"
tech_stacks: ["Python Tkinter", "Sqlite3"]
start_date: "2020-01-01"
end_date: "2020-06-30"
thumbnail: ""
---

### 개요

Python Tkinter로 만든 두더지잡기 게임이다. 9마리의 두더지가 임의로 튀어나오면 1분 동안 클릭해 점수를 쌓고, 종료 후 결과를 SQLite3 점수판에 저장한다. **첫 Tkinter GUI 게임**이다.

### 기술 스택

- **Language**: Python
- **Library**: Tkinter, Pillow, playsound, PyInstaller
- **Database**: SQLite3
- **Module**: threading, random, time, datetime, os, sys

### 게임 규칙

- 9마리의 두더지가 화면에 배치되어 있고, 1분간 진행된다.
- 튀어나온 두더지를 클릭하면 +1점, 들어가 있는 두더지를 잘못 클릭하면 -1점.
- 튀어나온 동안 연속으로 클릭하면 점수가 누적된다 — 두더지가 들어가기 전까지 빠르게 여러 번 클릭하는 게 점수 전략.
- 1분 종료 후 닉네임을 입력받아 SQLite3 `score.db`에 날짜·시간·닉네임·점수가 저장된다.
- 점수판 화면은 점수 내림차순 상위 10개를 표시한다.

### 구현 — 두더지 출현 로직

각 두더지의 출현은 **숫자 매칭** 방식으로 처리된다.

- 각 두더지마다 1~100 중 랜덤 14개를 미리 뽑아 `change` 리스트로 보관.
- 게임 루프는 2초마다 1~100 중 하나를 뽑아 `self.move`에 저장.
- 클릭 시점에 `self.move in change` 이면 튀어나온 상태(정답), 아니면 들어가 있는 상태(오답).

```python
def Button(self, x, y):
    change = []
    for i in range(14):
        change.append(random.randint(0, 100))

    def Button_clicked():
        if self.stop == 0:
            if self.timer > 0:
                if self.move in change:
                    self.score += 1
                    ...
```

결과적으로 각 두더지가 약 14% 확률로 튀어나오는 구조다. 단순히 매번 `random.random() < 0.14` 같은 확률 분기로 짜는 대신 "리스트 멤버십"으로 표현한 이유는, 당시 시점에서 그게 랜덤을 다루는 자연스러운 방식이라고 생각했기 때문이다.

### 구현 — 닉네임과 점수 저장

`self.name`은 초기 기본값 `"test"`로 시작하고, 게임 종료 시 입력 위젯에서 받은 값을 `self.name = name.get()`으로 덮어쓴 뒤 INSERT한다.

```python
insert_query = f"INSERT INTO Score_table VALUES('{self.date}', '{self.time}', '{self.name}', '{self.score}')"
```

점수판은 `SELECT * FROM Score_table ORDER BY Score DESC` 쿼리 결과를 1~10등까지 라벨로 그려 보여준다. 점수판 디자인은 별도로 꾸미지 않고 yellow/green 배경에 라벨만 올린 단순한 형태다.

### 미실현 기능

코드 상단에 "추가해야 할 점" 메모가 그대로 남아 있다.

- 망치 / 점수 표시 이펙트
- 난이도 상승, 시간 변경
- 화면 비율 변경
- 아이템 추가
- 두더지 출현 로직 변경

다음 프로젝트로 넘어가느라 모두 보류됐다. "언젠가 리뉴얼할 날이 오면 하겠다"고 메모해 두었지만, 리뉴얼은 이루어지지 않았다.

### 메모

- 첫 Tkinter GUI 게임이다. 같은 2020년 상반기의 AutomaticGuestBook과 함께 GUI 작업의 출발점에 해당한다.
- About 대화상자 문구에 작업 시점의 자기 인식이 그대로 담겨 있다 — `"Dezeli가 처음 만드는 Gui 게임\n두더지잡기 게임인데 아직 부족하지만\n재밌게 플레이 해주세요"`.
