---
id: 1
type: project
title: "Football Owner - 축구 시뮬레이터"
tech_stacks: ["Sqlite3", "Python Tkinter"]
start_date: "2020-07-01"
end_date: "2020-12-31"
thumbnail: "https://dezelisoftware.com/media/profile/%25Y/%25m/ccc98946-bf5e-4884-bb1e-fc1b9d7eaaec.png"
---

### FM을 따라 하되, 나만의 색깔을 담다
Football Manager 게임(FM)을 너무 좋아해서 시작한 프로젝트다. 하지만 똑같이 따라 하는 건 의미가 없다고 생각해서 'FootballOwner'라는 이름을 붙였다. 2020년, 개발 초창기 시절에 한 작업이라 지금 보면 풋풋하지만, 당시에는 구단주로서 팀을 운영하는 핵심 로직을 구현하는 데 모든 열정을 쏟았다.

### 기술 스택
지금처럼 화려한 웹 프레임워크를 쓰던 시절이 아니었다. 파이썬의 기본기에 충실하며 하나하나 수동으로 쌓아 올린 결과물이다.

- Language: **Python** (핵심 로직 및 데이터 처리)
- Library: **Tkinter, BeautifulSoup4, Requests** (GUI 구현, Crawling)
- Database: **SQLite3** (선수 및 구단 데이터 관리)
- Design: PowerPoint (UI 디자인 후 사진으로 불러오기)

###  PPT 디자인과 Tkinter의 만남
디자인 도구가 익숙지 않던 시절이라, 파워포인트로 모든 UI를 직접 그렸다. 버튼 하나, 배경 하나까지 PPT에서 디자인한 뒤 사진 파일로 추출해서 Tkinter 위젯 위에 입혔다. 투박해 보일지 몰라도 나름대로 최선의 사용자 경험을 고민했던 흔적이다.

- 데이터 로드: SQLite3에서 수만 명의 선수 데이터를 긁어와 프로그램에 뿌려준다.
- 시뮬레이션 엔진: 가져온 선수들의 능력치를 기반으로 경기 결과를 산출하는 로직을 태운다.
- 시각화: 시뮬레이션 결과를 실시간으로 GUI 화면에 보여준다.

```python
# PPT 디자인 이미지를 활용한 UI 배치

def Menu_Screen(self):
    # 배경 및 버튼 이미지를 절대 좌표(place)로 배치하여 커스텀 UI 구현
    Menu_Screen_background = Get_label.image_label(
        self.Gui, os.path.join(img_path, "../../Images/Title_Screen_bg.png"), 0, 0
    )
    Game_Start_button = Get_label.image_button(
        self.Gui,
        os.path.join(img_path, "../../Images/Game_Start_btn.png"),
        20, 350, # x, y 좌표 직접 지정
        self.loadfiles_Screen,
    )
```

### 데이터 수집의 집념: Transfermarkt 크롤링
단순히 이름만 있는 더미 데이터가 아니라 실제 데이터를 쓰고 싶었다. Transfermarkt 사이트를 샅샅이 뒤져서 전 세계 리그, 구단, 선수, 코치 데이터를 층층이 긁어왔다. BeautifulSoup으로 복잡한 HTML 구조를 파싱하고 수만 건의 데이터를 SQLite에 밀어 넣는 과정은 그 자체로 거대한 도전이었다. 특히 HTTP 헤더 설정부터 데이터 정제까지 하나하나 수동으로 맞췄던 기억이 난다.

```python
# BeautifulSoup을 활용한 데이터 수집 및 SQLite 저장 로직

def Get_Player():
    headers = {"User-Agent": "Mozilla/5.0 ..."}
    for URL in URLs:
        html = requests.get(URL, headers=headers).text
        soup = BeautifulSoup(html, "html.parser")
        
        # 선수명, 등번호, 포지션, 시장가치 등 정밀 파싱
        Player_soup = soup.find_all("span", {"class": "hide-for-small"})
```

### 스케일과 싸우는 멀티스레딩의 지옥
개발 초창기에 가장 큰 벽은 'Thread(스레드) 관리'였다. 데이터 규모가 커지다 보니, 메인 스레드에서 시뮬레이션을 돌리면 GUI 화면이 멈춰버리는 현상이 발생했다. 

화면은 부드럽게 유지하면서 백그라운드에서는 무거운 데이터 연산을 돌려야 했는데, 당시 지식으로 스레드 간의 충돌과 동기화를 맞추는 건 그야말로 지옥이었다. 수없이 뻗어버리는 프로그램을 보며 데이터 스케일이 커졌을 때의 자원 관리 능력이 왜 중요한지 뼈저리게 배웠다.

```python
# GUI 멈춤 방지를 위한 멀티스레딩 및 로딩 애니메이션

def Loading_Screen(self, thread):
    def loading(num, thread):
        if thread.is_alive() == False: # 백그라운드 작업 완료 체크
            self.Main_Screen()
            return 0
        
        # after 함수를 재귀 호출하여 메인 스레드 점유 없이 애니메이션 구현
        Loading_Screen_background = Get_label.image_label(
            self.Gui, os.path.join(img_path, f"../../Images/로딩{num}.png"), 0, 0
        )
        Loading_Screen_background.after(200, lambda: loading(num + 1, thread))

    loading(1, thread)

# 무거운 데이터 생성 시 별도 스레드 할당
def injury(self):
    make_thread = threading.Thread(target=make_player_data)
    make_thread.daemon = True
    make_thread.start()
    self.Main_Screen()
```

### 개발의 시작
지금 보면 코드 구조도 투박하고 디자인도 PPT로 만든 사진들이지만, 이 프로젝트 덕분에 데이터가 어떻게 흐르고 시스템이 어떻게 맞물려 돌아가는지 이해할 수 있었다. 특히 초창기에 겪었던 멀티스레딩의 고통은 이후 성능 최적화와 안정적인 아키텍처를 고민하는 데 아주 단단한 밑거름이 되었다.
