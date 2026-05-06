---
id: 7
type: project
title: "SpotDifference - 틀린그림찾기 게임"
tech_stacks: ["Python Tkinter", "Pygame", "Pillow"]
start_date: "2023-12-11"
end_date: "2024-02-02"
thumbnail: ""
---

### 개요

친구 생일 선물용으로 만든 Tkinter 기반 틀린그림찾기 게임이다. 25라운드 구조에 라운드별 원본/변경본 이미지 두 장을 비교하는 방식이다.

이미지는 친구와 관련된 개인 사진을 포토샵으로 가공해 사용했기 때문에 레포에는 코드만 공개하고 이미지는 포함하지 않는다.

### 기술 스택

- **Language**: Python
- **Library**: Tkinter, Pillow, pygame(mixer), playsound, PyInstaller
- **Module**: threading, os, time, datetime, random
- **Tool**: Photoshop (원본/변경본 이미지 직접 제작)

### 게임 규칙

- 라운드마다 3개의 다른 곳을 찾으면 다음 라운드로 진행.
- 오답 클릭 5회 누적 시 게임오버.
- 25라운드 클리어 시 종료, 시작부터 끝까지 걸린 시간이 기록으로 표시된다.

### 구현 — 클릭 판정에 3×3 픽셀 마진

핵심 로직은 클릭 좌표가 두 이미지에서 다른 픽셀에 해당하는지 판정하는 것이다. 단일 픽셀 비교는 사용자가 1픽셀 단위로 정확히 클릭해야 해서 너무 빡빡했고, 클릭 좌표를 중심으로 **3×3 = 9픽셀**을 비교하도록 바꿨다. 9픽셀이 모두 일치하면 "다른 곳이 아님"으로 판정하고, 한 픽셀이라도 다르면 정답 처리한다 — 즉, 한두 픽셀의 클릭 오차를 허용하는 관용 마진이다.

```python
wrong = 0
for i in range(-1, 2):
    for j in range(-1, 2):
        c1 = image1.getpixel((x+i, y+j))
        c2 = image2.getpixel((x+i, y+j))
        if c1[0]==c2[0] and c1[1]==c2[1] and c1[2]==c2[2]:
            wrong += 1
if wrong == 9:
    # 9픽셀 모두 동일 → 정답 아님
```

### 구현 — BGM과 효과음을 두 라이브러리로 분리

오디오는 두 가지 라이브러리를 섞어 쓴다.

- **BGM**: `pygame.mixer` (`mixer.music.load` + `play`로 길게 재생)
- **효과음(정답/오답)**: `playsound` (한 번 호출하고 반환)

처음에는 한 라이브러리로 통일하려 했지만, 길게 깔린 BGM 위에 짧은 효과음을 즉시 얹으려고 하면 채널 충돌이나 BGM 끊김이 발생했다. 디버깅 대신 역할별로 라이브러리를 갈라서 해결했다 — 길게 가는 건 mixer, 한 번 치고 끝나는 건 playsound.

### 구현 — 25라운드 고정과 BGM 전환

라운드 순서는 다음과 같이 처리된다.

```python
self.rounds = [i for i in range(1, 25)]
random.shuffle(self.rounds)
self.rounds.append(25)
```

1~24라운드는 무작위로 섞고, **25라운드는 항상 마지막에 고정**한다. 25라운드 이미지가 생일 케이크 사진이고, 이 라운드에 도달하는 시점에 BGM을 생일축하곡으로 갈아끼우기 위해서다.

전환 자체는 별도 데몬 스레드가 1초 간격으로 `self.round_num`을 폴링하다가 25에 도달하면 mixer의 BGM을 멈추고 `playsound`로 생일축하곡을 재생하는 구조다.

```python
def main_music(self):
    mixer.init()
    mixer.music.load('../../musics/peppermint.mp3')
    mixer.music.play()
    while True:
        time.sleep(1)
        if self.round_num == 25:
            mixer.music.stop()
            playsound("../../musics/birthday.mp3")
            break
```

### 동작 검증

본인이 25라운드를 전부 클리어하며 흐름과 BGM 전환 타이밍을 확인했고, 친구도 끝까지 클리어하는 것까지 검증되었다. PyInstaller로 exe 빌드해 단축키 형태(`틀린그림찾기.exe.lnk`)로 실행되도록 묶었다.

### 메모

- 고등학생 시절 이후 한동안 멈춰 있던 Tkinter 사용 흐름이 이 프로젝트로 다시 이어졌다.
- 이미지 자산이 비공개라 외부에서 그대로 실행할 수는 없고, 사용하려면 코드의 경로 규칙(`original{n}.png`, `change{order}/change{n}-{order}.png`)에 맞춰 직접 이미지를 채워 넣어야 한다.
