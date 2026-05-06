---
id: 4
type: project
title: "BOJ - 백준 알고리즘 풀이 아카이브"
tech_stacks: ["Python", "C++17", "Ada", "Algol68", "Fortran", "FreeBasic", "GolfScript", "VisualBasic", "아희", "Text"]
start_date: "2023-08-23"
end_date: "2025-12-30"
thumbnail: ""
---

# BOJ - 백준 알고리즘 풀이 아카이브

**기간**: 2023-08-23 ~ 2025-12-30

**기술 스택**: Python, C++17, Ada, Algol68, Fortran, FreeBasic, GolfScript, VisualBasic, 아희, Text

**GitHub**: [Dezeli/BOJ](https://github.com/Dezeli/BOJ)

### 1,448문제가 쌓인 자리

블로그에는 [백준이 문을 닫았다]는 글을 따로 남겼다. 그 글이 백준이라는 공간에 대한 작별이라면, 이 레포는 그 풀이들이 실제로 쌓여 있는 자리다.

플래티넘까지 끌고 간 1,448문제 중 상당수의 코드가 이 디렉토리 안에 그대로 남아 있다. 채점기가 죽어도, 정답 코드는 남는다. 이게 그 보관함이다.

### 기술 스택

알고리즘 풀이 자체가 곧 스택인 레포라, 사용한 언어를 정리하면 이렇다.

- **메인 언어**: Python (거의 모든 풀이의 기준 언어)
- **서브 언어**: C++17, Ada, Algol68, Fortran, FreeBasic, GolfScript, VisualBasic, 아희, Text — 브론즈 5·4 올솔브용으로 한두 문제씩 손댄 흔적들
- **자동화**: `Update_README.py` (Python) — 디렉토리를 훑어 README 통계 자동 갱신

### 디렉토리 구조

언어별로 폴더를 갈라 두었다.

```
BOJ/
├── Python/        ← 메인. 거의 모든 풀이가 여기 있다.
├── C++17/
├── Ada/
├── Algol68/
├── Fortran/
├── FreeBasic/
├── GolfScript/
├── VisualBasic/
├── 아희/
├── Text/
└── Update_README.py
```

메인은 어디까지나 Python이다. 나머지 언어들은 **브론즈 5와 4 문제 올솔브**를 노리며 한두 문제씩 손댄 흔적들이다. Ada나 Algol68로 A+B 문제를 푸는 데 굳이 시간을 들였다는 것 자체가, 그 시기 내가 얼마나 풀고 싶어서 미쳐 있었는지를 말해 주는 것 같다.

### Update_README.py — 통계는 자동으로

`Update_README.py`는 디렉토리를 훑어 푼 문제 목록을 README에 자동으로 정리해 주는 스크립트다. 풀고, 커밋하고, 이걸 한 번 돌리면 그날의 기록이 그대로 README에 새겨진다. 매번 손으로 표를 그리고 싶지 않았던 게으름이 만든 작은 자동화다.

### 마지막 커밋과 그 이후

마지막 커밋은 **2025년 12월 30일**에 찍혀 있다.

그리고 약 4개월이 지난 2026년 04월 28일, 백준이 문을 닫았다.

이렇게 내 BOJ 레포의 커밋도 멈췄다.

언젠가는 커밋과 함께 문제풀이의 짜릿함을 느끼는 날이 다시 돌아온다면 좋겠다.
