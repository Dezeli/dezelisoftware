---
id: 5
type: project
title: "AutomaticGuestBook - 전자 방문록 프로그램"
tech_stacks: ["Arduino", "Python Tkinter", "Sqlite3"]
start_date: "2020-01-01"
end_date: "2020-06-30"
thumbnail: ""
---

# AutomaticGuestBook - 전자 방문록 프로그램

**기간**: 2020-01-01 ~ 2020-06-30

**기술 스택**: Arduino, Python Tkinter, Sqlite3

**GitHub**: [Dezeli/AutomaticGuestBook](https://github.com/Dezeli/AutomaticGuestBook)

### 카드만 갖다 대면 끝나는 방문록

2020년 상반기, 코로나가 일상을 본격적으로 흔들기 시작하던 시기였다. 가게나 시설 입구마다 종이 방문록이 놓이고, 한쪽에서는 그걸 디지털로 바꾸려는 시도들이 막 보이던 무렵이었다. 학교 프로젝트의 주제로 그 흐름을 골랐다.

콘셉트는 단순했다. **RFID 태그나 휴대폰 NFC를 가져다 대면, 종이도 펜도 줄도 없이 방문 기록이 남는 작은 키오스크.**

### 기술 스택

소프트웨어와 하드웨어가 같이 묶인 프로젝트라, 양쪽을 함께 정리한다.

- **Language**: Python, Arduino (C/C++)
- **Library**: Tkinter, Pillow, Pyglet, pyserial, PyInstaller
- **Database**: SQLite3
- **Module**: threading, os, time
- **Hardware**: MFRC522 RFID 모듈, LED, 피에조 부저

### 시스템 구성 — Python ↔ Arduino

이 프로젝트의 핵심은 결국 Arduino와 Python 사이의 시리얼 통신이었다.

```
[RFID 태그 / NFC] → [Arduino + MFRC522] → 시리얼 통신 → [Python Tkinter GUI] → [SQLite3 DB]
                            ↓
                       LED + 피에조 부저 (피드백)
```

- **Arduino**: MFRC522 RFID 모듈로 태그를 읽고, 인식되면 LED 색을 바꾸고 부저를 울려 즉각 반응을 준 뒤, 태그 ID를 시리얼로 전달.
- **Python**: Tkinter GUI가 시리얼 포트를 열고 별도 스레드에서 태그 ID를 받음. 처음 보는 ID는 회원 가입, 등록된 ID는 방문 기록 자동 저장.
- **DB**: SQLite3에 회원과 방문 기록을 분리해 저장. GUI에서 원하는 정렬 방식으로 조회.

### 가장 막혔던 지점 — 시리얼과 COM 포트

기능 자체는 한 줄로 정리되지만, 정작 시간을 가장 많이 잡아먹은 건 **시리얼 통신을 처음 다뤄 본다는 것** 그 자체였다.

PC가 Arduino 보드를 어느 COM 포트에 물리는지, 왜 다음에 꽂으면 번호가 바뀌어 있는지, `pyserial`로 그 포트를 어떻게 열어 두는지 — 개념 자체가 처음이라 한참 헤맸다. 회로 문제도 아니고 코드 문제도 아닌, 둘을 잇는 채널에서 막히는 경험이 그 전엔 없었다.

GUI 실행 시 사용자가 직접 COM 포트 번호를 입력하도록 만든 건, 결국 그 헤맨 흔적이다.

### 발표까지

학교 프로젝트 발표에 그대로 들고 나갔다. `design.pptx`는 디자인을 1도 모르던 내가 디자인으로 사용한 pptx고, `introduce.pptx`는 프로젝트 발표 자료이다. 실행 스크린샷도 그 시기에 찍은 것들이다.

실제로 어딘가에 설치해 운영해 본 적은 없다. 만들어진 시점에 임무는 끝난, 데모로서의 프로젝트였다.

### 시작이 어려운 거였다

이 프로젝트로 얻은 가장 큰 건 결과물보다 감각이었다. 모르는 영역을 처음 건드릴 때의 막막함은 결국 시작하기 전까지의 것이고, 일단 한 줄을 적어 내려가기 시작하면 어떻게든 끝까지 간다는 감각.

Arduino도 시리얼도 처음이었지만, 그래도 작동하는 무언가를 만들어 발표대 위에 올려놓을 수 있었다. 그 한 번의 경험이, 다음에 처음 보는 영역을 만나도 일단 손부터 대 보게 만드는 자신감의 시작이 됐다.