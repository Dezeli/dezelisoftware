---
id: 3
type: project
title: "PC Time Check - 컴퓨터사용시간프로그램"
tech_stacks: ["Sqlite3", "Python Tkinter"]
start_date: "2021-01-01"
end_date: "2021-06-30"
thumbnail: "https://dezelisoftware.com/media/profile/%25Y/%25m/27fc9ffd-fda0-4230-ae53-5a3b8f55bac0.PNG"
---

# PC Time Check - 컴퓨터사용시간프로그램

**기간**: 2021-01-01 ~ 2021-06-30

**기술 스택**: Sqlite3, Python Tkinter

### 필요하니까 만든다 — 내 PC 사용시간이 궁금했다

단순한 궁금증에서 시작됐다. 하루에 컴퓨터를 얼마나 쓰는지 알고 싶었다. 딱히 쓸만한 도구를 찾기보다, 직접 만들어보기로 했다. 그렇게 'PcTimeCheck'가 시작됐다.

### 기술 스택

- **Language**: Python
- **Library**: Tkinter, Pillow, Pyglet, PyInstaller
- **Database**: SQLite3
- **Module**: threading, datetime, os

### 모르면 돌아간다 — datetime으로 시간 재기

사실 더 나은 방법은 있었다. `system` 함수 같은 걸 쓰면 OS에서 직접 사용시간을 가져올 수 있었을 것이다. 하지만 당시엔 그 방법을 몰랐고, 알아도 쉽지 않았을 것 같았다.

그래서 택한 방법은 이렇다. 컴퓨터가 켜질 때 자동으로 측정 프로그램이 시작되도록 시작프로그램에 등록하고, `datetime` 모듈로 1초마다 시간을 업데이트하면서 `Pc_Time.db`에 기록하는 방식이다. 비효율적이라는 건 알았지만, 내가 할 수 있는 방법으로 끝까지 완성했다.

```python
def check_time_start(self):
    self.start_time = datetime.datetime.now()
    self.Seq = self.read_row_num()[0] + 1
    insert_query = (
        f'INSERT INTO Pc_Time VALUES("{self.Seq}","{self.start_time}", "", "")'
    )
    self.cursor.execute(insert_query)
    self.db.commit()
    self.update_time()

def update_time(self):
    self.terminate_time = datetime.datetime.now()
    self.use_time = self.terminate_time - self.start_time
    self.cursor.execute(
        f"UPDATE Pc_Time SET End_time ='{self.terminate_time}', Use_time ='{self.use_time}' WHERE Seq=='{self.Seq}'"
    )
    self.db.commit()
    timer = threading.Timer(1, self.update_time)  # 1초마다 재귀 호출로 시간 업데이트
    timer.start()
```

### 프로그램의 흐름

세 개의 모듈이 맞물려 돌아간다.

- **Time_Check**: 시작프로그램에 등록된 exe 파일이 부팅과 함께 실행되어 사용시간 측정 시작
- **Database**: 측정된 시작 시간, 종료 시간, 이용 시간을 `Pc_Time.db`에 지속 저장
- **GUI**: 저장된 데이터를 불러와 현재 사용시간, 이번 주 사용 횟수, 상세 기록을 화면에 출력

### .py에서 .exe로 — PyInstaller

이 프로젝트에서 처음으로 PyInstaller를 써봤다. 파이썬 파일을 exe로 변환해야 시작프로그램에 등록할 수 있었기 때문이다. `.py` 파일이 실제로 실행 가능한 프로그램으로 탈바꿈하는 과정이 꽤 신기했다.

다만 절대경로로 작성된 부분 때문에 다른 환경에서 실행하려면 `C:\코딩\Pc_time_check` 구조를 그대로 맞춰야 하는 한계가 있었다. 지금 보면 아쉬운 부분이지만, 당시엔 일단 내 컴퓨터에서 돌아가는 게 목표였다.

### 돌아보며

직접 시작프로그램에 등록해서 잠깐 써보기도 했다. 오래 쓰진 못했지만, 내가 만든 프로그램이 컴퓨터가 켜질 때마다 자동으로 실행된다는 게 그 자체로 뿌듯했다. 코드 구조도 투박하고 시간 측정 방식도 비효율적이지만, 아이디어를 떠올리고 내 방식대로 끝까지 완성했다는 것 — 그게 이 프로젝트의 의미다.
