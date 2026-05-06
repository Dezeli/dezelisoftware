---
id: 10
type: project
title: "ToDoList - Django 할 일 메모 웹사이트"
tech_stacks: ["Python Django", "Sqlite3", "HTML", "CSS"]
start_date: "2020-09-01"
end_date: "2020-12-31"
thumbnail: ""
---

### 개요

Django로 만든 할 일 메모 웹사이트. **첫 웹 프로젝트**다. Django 공식 튜토리얼을 따라가며 연습하는 과정에서 만든 결과물로, 할 일의 추가·조회·수정·삭제(CRUD) 기능을 갖췄다. 로컬에서 `py manage.py runserver`로 띄워 사용하는 형태이며 배포는 하지 않았다.

### 기술 스택

- **Language**: Python
- **Framework**: Django
- **Database**: SQLite3
- **Frontend**: HTML, CSS
- **Tool**: Adobe Illustrator (간단한 UI 디자인)

### 모델 구조

`Do_list` 모델 한 개로 모든 데이터를 담는다.

```python
class Do_list(models.Model):
    content = models.CharField(max_length=50)
    information = models.TextField()
    pub_date = models.DateTimeField()
    modify_date = models.DateTimeField(null=True)
    check_list = models.BooleanField(default=False)
    state = models.BooleanField(default=True)
```

- `content` / `information`: 할 일의 짧은 제목과 세부 설명
- `pub_date` / `modify_date`: 등록 시각, 수정 시각
- `check_list`: 완료 여부 표시 용도로 두었으나 **이번 프로젝트에서는 미구현**으로 남았다
- `state`: 화면 노출 여부. 삭제 처리에 사용한다 (아래 항목 참조)

### URL과 뷰 구조

```python
urlpatterns = [
    path("", views.index, name="index"),
    path("detail/<int:do_list_id>/", views.detail, name="detail"),
    path("add/", views.add, name="add"),
    path("change/<int:do_list_id>/", views.change, name="change"),
]
```

- `index`: `state=True` 항목만 id 오름차순으로 표시
- `add`: GET이면 입력 폼, POST면 새 항목을 INSERT한 뒤 index로 redirect
- `change/<id>`: 같은 패턴으로 수정 처리. `modify_date`를 `timezone.now()`로 갱신
- `detail/<id>`: GET은 상세 화면, POST는 "삭제" 동작 (실제로는 `state=False`로 마킹)

### 구현 — 삭제는 soft delete

삭제 처리는 일반적인 `delete()` 호출 대신 **`state=False`로 마킹하고 `index`에서 `filter(state=True)`로 걸러내는 soft delete** 방식을 택했다. 학습 차원의 의도된 선택이다 — Django ORM에서 BooleanField로 행 상태를 관리하고 쿼리 필터로 노출 제어하는 패턴을 직접 짜 보기 위함이었다.

```python
def detail(request, do_list_id):
    ...
    elif request.method == "POST":
        id_data = Do_list.objects.get(pk=do_list_id)
        id_data.state = False
        id_data.save()
        return HttpResponseRedirect(reverse("main:index"))
```

별도의 delete URL 라우트는 `urls.py`에 주석 형태로만 남겨 두었다 (`# path('delete/<int:do_list_id>/', views.delete, name='delete')`).

### 메모

- 첫 웹 프로젝트다. Django 튜토리얼을 따라가며 익히는 단계에서 만든 결과물이라 기능은 CRUD 기본형이며, 완료 체크 / 카테고리 / 정렬 등 부가 기능은 구현되지 않았다.
- `db.sqlite3`가 레포에 그대로 커밋되어 있다. 당시 `.gitignore`에 익숙하지 않아 의도적으로 함께 올린 것으로, 결과적으로 초기 테스트 데이터가 함께 남아 있는 상태다.
- 이 프로젝트 다음의 Django 작업은 SoundMakesFootball → FindHealthyRaccoon → NeighBiz 순으로 이어진다 (NeighBiz는 정리 후 별도 등록 예정).
