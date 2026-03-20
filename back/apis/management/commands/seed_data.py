from django.core.management.base import BaseCommand
from django.core.files.uploadedfile import SimpleUploadedFile
from apis.models import Skill, Profile, Project, Post

class Command(BaseCommand):
    help = '포트폴리오 및 블로그 테스트용 더미 데이터를 생성합니다.'

    def handle(self, *args, **kwargs):
        # 1. 1x1 투명 GIF 더미 이미지 바이트 코드 (URL 호출 에러 방어용)
        tiny_gif = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
        dummy_img = SimpleUploadedFile(name='dummy.gif', content=tiny_gif, content_type='image/gif')

        # 2. 기존 데이터 초기화 (중복 생성 방지)
        self.stdout.write("기존 데이터를 삭제 중...")
        Skill.objects.all().delete()
        Profile.objects.all().delete()
        Project.objects.all().delete()
        Post.objects.all().delete()

        # 3. 기술 스택 (Skill) 생성
        skill_names = [
            'Django', 'React', 'React Native', 'PostgreSQL', 
            'Docker', 'Nginx', 'FastAPI', 'AWS EC2', 'Spring Boot'
        ]
        skills = {}
        for name in skill_names:
            skills[name] = Skill.objects.create(name=name)

        # 4. 프로필 (Profile) 생성
        profile = Profile.objects.create(
            name='민성',
            slogan='매일매일 성장하려고 애쓰는 백엔드 중심 프론트엔드 가능한 프리랜서 개발자',
            profile_image=dummy_img,
            logo_image=dummy_img,
            introduction='안녕하세요. 탄탄한 백엔드 아키텍처와 사용자 친화적인 프론트엔드를 고민합니다.',
            contact_email='test@dezelisoftware.com'
        )
        profile.skills.set(list(skills.values()))

        # 5. 프로젝트 (Project) 7개 생성
        project_data = [
            ("이커머스 결제 API 연동", "가상 결제 모듈을 연동한 백엔드 시스템 구축", ['Django', 'PostgreSQL']),
            ("실시간 채팅 웹 애플리케이션", "WebSocket을 활용한 실시간 채팅 서비스", ['FastAPI', 'React']),
            ("개인 포트폴리오 웹사이트", "현재 보시는 바로 이 웹사이트입니다.", ['Django', 'React', 'Nginx']),
            ("사내 인트라넷 모바일 앱", "출퇴근 기록 및 연차 관리용 사내 앱", ['React Native', 'Spring Boot']),
            ("자동화 배포 파이프라인 구축", "GitHub Actions를 활용한 서버 자동 배포", ['Docker', 'AWS EC2']),
            ("크롤링 데이터 분석 대시보드", "수집된 공공 데이터를 시각화하는 플랫폼", ['Django', 'PostgreSQL']),
            ("로컬 홈 서버 아키텍처 설계", "클라우드 비용 절감을 위한 홈 서버 네트워크 세팅", ['Ubuntu', 'Nginx', 'Docker'])
        ]

        for idx, (title, desc, stack_names) in enumerate(project_data):
            proj = Project.objects.create(
                title=title,
                thumbnail=dummy_img,
                description=desc,
                github_url=f"https://github.com/minseong/project-{idx}",
                is_public=True,
                order=idx
            )
            proj_skills = [skills[name] for name in stack_names if name in skills]
            proj.tech_stacks.set(proj_skills)

        # 6. 블로그 포스트 (Post) 7개 생성
        post_data = [
            ("Django N+1 쿼리 최적화 경험기", "Backend", "<p>prefetch_related를 활용하여 DB 호출을 줄인 경험을 공유합니다.</p>"),
            ("React 컴포넌트 라이프사이클의 이해", "Frontend", "<p>useEffect의 올바른 사용법과 메모리 누수 방지 팁입니다.</p>"),
            ("Ubuntu 22.04 환경에서 Docker Compose 세팅하기", "DevOps", "<p>가벼운 홈 서버 환경을 구축하는 과정입니다.</p>"),
            ("PostgreSQL 인덱스 설계 주의점", "Database", "<p>단순 조회가 아닌 복합 필터링 시 B-Tree 인덱스가 작동하는 원리입니다.</p>"),
            ("FastAPI vs Django Ninja 비교", "Backend", "<p>포트폴리오 규모에 맞는 경량 프레임워크 선택 기준을 다룹니다.</p>"),
            ("AWS EC2 프리티어 성능 한계 극복하기", "Infra", "<p>Swap 메모리 설정을 통해 t2.micro의 뻗음 현상을 방지합니다.</p>"),
            ("프리랜서 개발자로서의 첫해 회고", "Life", "<p>매일 성장하기 위해 어떤 루틴을 지켜왔는지 정리해보았습니다.</p>")
        ]

        for title, category, content in post_data:
            Post.objects.create(
                title=title,
                category=category,
                content=content,
                is_published=True
            )

        self.stdout.write(self.style.SUCCESS('더미 데이터 주입이 완벽하게 완료되었습니다!'))