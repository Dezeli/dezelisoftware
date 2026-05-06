---
id: 12
type: project
title: "Lyrics Audio Maker - 가사·앨범아트 자동 주입 MP3 메이커"
tech_stacks: ["Python", "BeautifulSoup", "yt-dlp", "mutagen", "FFmpeg"]
start_date: "2023-12-11"
end_date: "2026-03-06"
thumbnail: ""
---

### 개요

가수명 하나만 입력하면 벅스 인기곡 목록을 추출하고, 유튜브에서 음원을 받아 **MP3 파일에 가사와 앨범아트를 자동으로 주입**하는 개인용 라이브러리 구축 도구다. 음악 스트리밍을 구독하지 않으면서도 가사가 박힌 음악 라이브러리를 갖고 싶다는 개인적 필요에서 출발했고, 외부에 공개·배포한 적은 없는 **순수 개인용 자동화 도구**다.

### v1 → v2.0 — 다시 짠 도구

이 프로젝트는 두 번 만들어졌다.

- **v1**: "노래를 들으면서 가사를 같이 보고 싶다"는 출발점에서 만든 도구. **영상에 가사를 입혀 출력하는 형태**였다. 자동화가 부분적이라 결과물을 다듬는 사람의 수작업(자르고, 맞추고, 보정하는 노가다)이 많이 필요했다. 그리고 무료 라이브러리 의존 구조라, 2026년 3월에 의존 라이브러리 일부가 사실상 작동을 멈추면서 동작이 깨졌다.
- **v2.0**: 깨진 v1을 고치는 대신 접근 자체를 바꿔 처음부터 다시 만들었다. 영상에 가사를 입히는 방식 대신 **MP3 파일의 ID3 태그에 가사와 앨범아트 메타데이터를 직접 주입**하는 방식이다. 결과물이 단순한 MP3 한 파일로 떨어지므로 어떤 플레이어에서도 가사·앨범아트가 그대로 읽힌다.

리뉴얼 시점은 2026년 3월. 현재 레포의 README가 v2.0 기준이다.

### 기술 스택

- **Language**: Python
- **Crawling**: requests, BeautifulSoup4 (벅스 메타데이터 추출)
- **Audio Download**: yt-dlp (유튜브 음원 추출)
- **Audio Conversion**: FFmpeg (mp3로 변환)
- **MP3 Tagging**: mutagen (ID3v2 태그 주입 — TIT2 / TPE1 / USLT / APIC)

### 동작 흐름

도구는 두 스크립트로 나뉜다.

**1. `make_list.py` — 곡 목록 생성**

- 입력: 가수 이름 한 명
- 벅스(`music.bugs.co.kr/search/track?q=...&sort=popular`)에서 해당 가수 인기곡 목록 추출
- 19금 곡, 입력 가수 외 다른 가수, 괄호 내 부가표기 등 정제
- 결과: `songs.txt`에 `제목|가수` 한 줄씩 기록

**2. `main.py` — 음원 다운로드 + 태그 주입**

`songs.txt`의 각 줄에 대해:

1. 벅스 통합 검색으로 **공식 메타데이터** 보강 — 정확한 제목·가수, 가사(`xmp` 또는 `lyricsContainer` 노드), 앨범아트 URL(`/50/` → `/500/` 치환으로 고화질).
2. 유튜브 검색 쿼리에 `"Official Audio"`를 붙여 yt-dlp로 다운로드 → FFmpeg 후처리(`FFmpegExtractAudio`, `mp3`, `192 kbps`).
3. `mutagen.id3.ID3`로 기존 태그 초기화 후 새 태그 주입.

```python
tags = ID3()
tags.add(TIT2(encoding=3, text=title))                    # 제목
tags.add(TPE1(encoding=3, text=artist))                   # 가수
tags.add(USLT(encoding=3, lang='kor', desc='', text=lyrics_text))  # 가사
tags.add(APIC(encoding=3, mime='image/jpeg', type=3, desc='', data=img_data))  # 앨범아트
tags.save(mp3_path, v2_version=3)
```

결과 MP3는 `/assets/musics/`에 `가수 - 제목.mp3` 형식으로 저장된다.

### 구현 — 검색 매칭률을 위한 정제

곡 매칭이 실패하면 가사·앨범아트 없이 입력값만으로 MP3가 만들어진다. 매칭률을 끌어올리기 위해 검색 쿼리를 다음과 같이 정제한다.

- 가수명: `re.sub(r'\(.*?\)', '', artist)` — 영문 병기 등 괄호 제거
- 제목: `re.sub(r'\(feat.*?\)|\[.*?\]', '', title)` — feat 표기, 대괄호 부가표기 제거
- 파일명: 윈도우 금지 문자(`\\/*?:"<>|`) 및 제어 문자 제거

이 정제가 빠지면 "Aimer (에메)"나 "곡명 (feat. XX)" 같은 표기가 검색을 막는 경우가 흔하다.

### 구현 — yt-dlp 로그 필터링

yt-dlp는 검색·다운로드 과정에서 경고 로그를 많이 출력하는데, 그중 다수가 무시해도 되는 메시지(`No supported JavaScript runtime`, `android_vr client`, `SABR-only`)다. 그대로 흘리면 진행 로그가 묻히기 때문에, 커스텀 `MyLogger` 클래스로 해당 메시지만 잘라 내고 나머지만 출력하도록 했다.

### 메모

- 만든 동기는 명확하다. 음악 스트리밍을 구독하지 않는 상태에서 자기 라이브러리에 가사를 함께 가지고 싶었다는 개인적 필요다. 외부 공개나 배포는 한 번도 하지 않았다.
- 벅스를 메타데이터 소스로 고른 데에 특별한 이유는 없었다 — 처음 시도해 본 사이트가 벅스였고 매칭이 잘 됐기에 그대로 둔 것이다.
- v1은 동영상 출력 기반이라 사람 손이 많이 들어가는 구조였고, 의존 라이브러리가 깨지면서 자연스럽게 v2로의 재작성이 결정됐다. v2는 MP3 메타데이터 주입이라는 단순한 출력 형태로 방향을 틀어, 자동화 정도와 결과물 호환성이 모두 올라갔다.
