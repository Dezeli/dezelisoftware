---
id: 2
type: project
title: "SoundMakesFootball - 축구 커뮤니티"
tech_stacks: ["Django", "Sqlite3", "Heroku"]
start_date: "2021-01-01"
end_date: "2021-06-30"
thumbnail: "https://dezelisoftware.com/media/profile/%25Y/%25m/c63c8a8e-665c-4ec7-aab4-7d9e56d6dbe3.png"
---

### 기술 스택

- **Language**: Python
- **Framework**: Django
- **Database**: SQLite3
- **Frontend**: HTML, CSS
- **Deploy**: Heroku
- **Load Test**: Artillery

### 처음 만져보는 Django, 처음 만드는 백엔드

Django를 처음 쓰는 입장에서 가장 낯선 건 '프레임워크의 규칙'이었다. HTML/CSS로 화면만 그리던 것과 달리, Django는 URL 라우팅, View, Model, Template이 각자의 자리에서 맞물려 돌아갔다. 하나가 어긋나면 전체가 안 됐다.

그래도 하나씩 이해하면서 구현한 기능들은 이렇다.

- **게시판 CRUD**: 글 작성, 수정, 삭제, 조회
- **사진 첨부**: 업로드 파일 경로 관리 (`uploads/Post/2021/06`)
- **댓글**: 게시글에 댓글 작성 기능
- **회원 기능**: 회원가입 및 로그인/로그아웃
- **팬사이트**: 외부 정보 제공 페이지 (예시 구성)


### 처음으로 세상에 배포하다 — Heroku

그때까지 내게 '서버를 켠다'는 건 터미널에 `py manage.py runserver`를 입력하는 게 전부였다. 배포라는 개념 자체가 낯설었다. Procfile이 뭔지, requirements.txt를 왜 따로 관리해야 하는지, 로컬에서 잘 돌아가던 게 왜 서버에선 안 되는지 — 처음엔 뭐가 뭔지 몰라서 그냥 막막했다.

그래도 하나씩 부딪히며 맞춰나갔고, 결국 Heroku에 배포하는 데 성공했다.

그때까지 이 프로젝트는 오직 내 컴퓨터 안에서만 존재했다. 내가 켜야만 열리고, 내가 꺼야만 닫히는, 나만 아는 사이트였다. 그런데 배포에 성공한 순간, URL 하나로 세상 누구에게나 열리는 프로젝트가 됐다. '내가 만든 것'이 처음으로 세상 밖으로 나온 순간이었고, 그 짜릿함은 아직도 기억난다.

> 현재는 Heroku 무료 플랜 종료로 서비스가 내려간 상태다. 로컬에서 `py manage.py runserver`로 실행 확인 가능하다.


### 공부 겸 해본 Artillery 부하 테스트

배포까지 해놓고 나니 한 가지 궁금증이 생겼다. '이 서버, 동시에 많은 사람이 들어오면 버틸 수 있을까?' Artillery를 공부하면서 직접 부하 테스트를 돌려봤다. 실제 서비스를 운영하는 입장에서 성능을 어떻게 측정하는지 처음으로 경험해본 계기였다.

```yaml
# cpu-test.yaml — Artillery 부하 테스트 설정
```


### 돌아보며

지금 보면 기능도 단순하고 디자인도 투박하다. 하지만 이 프로젝트는 내가 처음으로 백엔드 프레임워크를 써보고, 처음으로 서비스를 배포하고, 처음으로 부하 테스트를 돌려본 프로젝트다. 'HTML/CSS만 아는 사람'에서 '직접 서비스를 만들고 올릴 수 있는 사람'으로 넘어간 지점이었다.
