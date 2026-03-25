import os
import uuid
from django.core.management.base import BaseCommand
from django.core.files.uploadedfile import SimpleUploadedFile
from apis.models import Skill, Profile, Project, Post, Category
from datetime import date

class Command(BaseCommand):
    help = '포트폴리오 및 블로그 테스트용 더미 데이터를 생성합니다.'

    def handle(self, *args, **kwargs):
        tiny_gif = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
        dummy_img = SimpleUploadedFile(name='dummy.gif', content=tiny_gif, content_type='image/gif')

        self.stdout.write("기존 데이터를 삭제 중...")
        Skill.objects.all().delete()
        Profile.objects.all().delete()
        Project.objects.all().delete()
        Post.objects.all().delete()
        Category.objects.all().delete()

        skill_names = [
            'Django', 'React', 'React Native', 'PostgreSQL', 
            'Docker', 'Nginx', 'FastAPI', 'AWS EC2', 'Spring Boot',
            'Ubuntu'
        ]
        skills = {}
        for name in skill_names:
            skills[name] = Skill.objects.create(name=name)

        # Profile introduction 수정
        profile = Profile.objects.create(
            name='민성',
            slogan='매일매일 성장하려고 애쓰는 백엔드 중심 프론트엔드 가능한 프리랜서 개발자',
            profile_image=dummy_img,
            logo_image=dummy_img,
            introduction="""# 안녕하세요, 개발자 민성입니다. # 수정

탄탄한 **백엔드 아키텍처**와 사용자 친화적인 **프론트엔드**를 고민합니다. 

### 핵심 역량
- **Backend**: Django, FastAPI를 활용한 효율적인 API 설계
- **Frontend**: React, Flutter를 이용한 크로스 플랫폼 개발
- **Infra**: Docker와 Linux 기반의 홈 서버 운영 및 자동화 배포""",
            contact_email='test@dezelisoftware.com'
        )
        profile.skills.set(list(skills.values()))

        # Project description 수정 (마크다운 적용)
        project_data = [
            ("이커머스 결제 API 연동", "### 주요 구현 사항\n- 가상 결제 모듈 연동\n- **Redis**를 활용한 결제 대기열 처리", ['Django', 'PostgreSQL'], date(2025, 1, 15), date(2025, 2, 28)), # 수정
            ("실시간 채팅 웹 애플리케이션", "### 기술적 도전\n- **WebSocket** 기반 실시간 통신\n- FastAPI의 비동기 처리 최적화", ['FastAPI', 'React'], date(2025, 3, 1), date(2025, 4, 15)), # 수정
            ("개인 포트폴리오 웹사이트", "### 프로젝트 개요\n- 현재 보시는 바로 이 웹사이트입니다.\n- **React**와 **Django**의 REST API 연동", ['Django', 'React', 'Nginx'], date(2026, 3, 1), None), # 수정
            ("사내 인트라넷 모바일 앱", "### 주요 기능\n- 출퇴근 기록 시스템\n- **Spring Security** 기반 권한 관리", ['React Native', 'Spring Boot'], date(2024, 11, 1), date(2025, 1, 10)), # 수정
            ("자동화 배포 파이프라인 구축", "### CI/CD 인프라\n- GitHub Actions 활용\n- **Docker** 컨테이너 기반 배포 자동화", ['Docker', 'AWS EC2'], date(2025, 5, 20), date(2025, 6, 5)), # 수정
            ("크롤링 데이터 분석 대시보드", "### 데이터 파이프라인\n- 공공 데이터 수집 및 정제\n- **PostgreSQL** 복합 인덱스 최적화", ['Django', 'PostgreSQL'], date(2025, 8, 1), date(2025, 10, 30)), # 수정
            ("로컬 홈 서버 아키텍처 설계", "### 인프라 구축\n- 클라우드 비용 절감을 위한 **홈 서버** 네트워크 세팅\n- Cloudflare Tunnel 도입", ['Ubuntu', 'Nginx', 'Docker'], date(2026, 2, 1), date(2026, 3, 14)) # 수정
        ]

        for idx, (title, desc, stack_names, s_date, e_date) in enumerate(project_data):
            proj = Project.objects.create(
                title=title,
                thumbnail=dummy_img,
                description=desc,
                start_date=s_date,
                end_date=e_date,
                github_url=f"[https://github.com/minseong/project-](https://github.com/minseong/project-){idx}",
                is_public=True,
                order=idx
            )
            proj_skills = [skills[name] for name in stack_names if name in skills]
            proj.tech_stacks.set(proj_skills)

        category_names = ['Backend', 'Frontend', 'DevOps', 'Database', 'Infra', 'Life']
        categories = {}
        for idx, name in enumerate(category_names):
            # Category 모델에 order 필드가 없는 경우를 대비해 name만 사용하거나 모델에 맞춰 수정 필요
            categories[name] = Category.objects.create(name=name)

        # Post content 수정 (실제 작성한 홈 서버 글 포함)
        post_data = [
            ("AWS 비용 부담을 해소한 노트북 홈 서버", "DevOps", """개인 개발자에겐 항상 뒤따라오는 고민이 있다. 바로 **'어떻게 하면 비용을 최소화할 것인가'**이다. # 수정

### 1. AWS 프리티어의 한계와 새로운 대안
처음 선택했던 방법은 누구나 그렇듯 **AWS EC2 프리티어**였다. 하지만 사양의 한계는 명확했다. t3.micro의 빈약한 성능과 12개월이라는 기간 제한은 프로젝트를 장기적으로 운영하기에 제약 사항이 너무 많았다.

### 2. 넘기 힘든 벽: 아파트 네트워크 환경
가장 먼저 미련 없이 노트북의 OS를 **Ubuntu 22.04**로 밀어버리고 서버 환경 설정을 시작했다. 하지만 곧바로 예상치 못한 난관에 부딪혔다. 바로 한국 아파트 특유의 폐쇄적인 네트워크 환경이었다.

### 3. Cloudflare Tunnel을 통한 네트워크 혁신
결국 내가 찾아낸 해결책은 **Cloudflare Tunnel**이었다.
- **포트포워딩 불필요**
- **보안 강화**
- **SSL 자동 적용**

```bash
# Cloudflare Tunnel 실행 예시
cloudflared tunnel run <TUNNEL_NAME>
```"""),
            ("Django N+1 쿼리 최적화 경험기", "Backend", "### N+1 문제 해결\n`prefetch_related`를 활용하여 DB 호출을 줄인 경험을 공유합니다.\n\n```python\nPost.objects.select_related('category').all()\n```"), # 수정
            ("React 컴포넌트 라이프사이클의 이해", "Frontend", "### useEffect 가이드\n메모리 누수 방지를 위한 **Cleanup** 함수 사용법입니다."), # 수정
            ("PostgreSQL 인덱스 설계 주의점", "Database", "### 인덱스 원리\n복합 필터링 시 **B-Tree** 인덱스가 작동하는 방식에 대해 다룹니다."), # 수정
            ("프리랜서 개발자로서의 첫해 회고", "Life", "### 성장 기록\n매일 성장하기 위해 지켜온 루틴과 생각들을 정리했습니다.") # 수정
        ]

        for title, cat_name, content in post_data:
            Post.objects.create(
                title=title,
                category=categories[cat_name],
                content=content,
                is_published=True
            )

        self.stdout.write(self.style.SUCCESS('마크다운 데이터가 포함된 더미 데이터 주입이 완료되었습니다!'))