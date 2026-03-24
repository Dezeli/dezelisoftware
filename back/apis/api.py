# back/apis/api.py
from ninja import Router
from typing import Optional, List
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from .models import Project, Post, Profile, Skill, Category
from .schemas import ProjectSchema, ProjectDetailSchema, PostListSchema, PostDetailSchema, ProfileSchema, ApiResponse, PaginatedData, SkillSchema, CategorySchema

router = Router()

@router.get("/profile", response=ApiResponse[ProfileSchema])
def get_profile(request):
    profile = Profile.objects.first()
    return {
        "success": True,
        "message": "프로필 조회 성공",
        "data": profile
    }

@router.get("/projects", response=ApiResponse[PaginatedData[ProjectSchema]])
def list_projects(request, skill: Optional[str] = None, page: int = 1):
    qs = Project.objects.filter(is_public=True).prefetch_related('tech_stacks')
    
    if skill:
        qs = qs.filter(tech_stacks__name__iexact=skill)
    
    paginator = Paginator(qs, 9)
    page_obj = paginator.get_page(page)
    
    return {
        "success": True,
        "message": "프로젝트 목록 조회 성공",
        "data": {
            "items": list(page_obj.object_list),
            "count": paginator.count
        }
    }

@router.get("/projects/{project_id}", response=ApiResponse[ProjectDetailSchema])
def get_project_detail(request, project_id: int):
    project = get_object_or_404(Project, id=project_id, is_public=True)
    prev_projects = Project.objects.filter(
        is_public=True
    ).exclude(id=project.id).filter(
        order__lte=project.order
    ).order_by('-order', 'created_at')[:2]
    
    next_projects = Project.objects.filter(
        is_public=True
    ).exclude(id=project.id).filter(
        order__gte=project.order
    ).order_by('order', '-created_at')[:2]

    project.previous_projects = list(prev_projects)
    project.next_projects = list(next_projects)
    
    return {
        "success": True,
        "message": "프로젝트 상세 조회 성공",
        "data": project
    }

@router.get("/posts", response=ApiResponse[PaginatedData[PostListSchema]])
def list_posts(request, category: Optional[str] = None, page: int = 1):
    qs = Post.objects.filter(is_published=True)
    if category:
        qs = qs.filter(category__name__iexact=category)
        
    paginator = Paginator(qs, 9)
    page_obj = paginator.get_page(page)
    
    return {
        "success": True,
        "message": "포스트 목록 조회 성공",
        "data": {
            "items": list(page_obj.object_list),
            "count": paginator.count
        }
    }

@router.get("/posts/{post_id}", response=ApiResponse[PostDetailSchema])
def get_post_detail(request, post_id: int):
    post = get_object_or_404(Post.objects.select_related('category'), id=post_id, is_published=True)
    related_qs = Post.objects.filter(is_published=True).select_related('category')

    post.previous_posts = list(related_qs.filter(
        created_at__lt=post.created_at
    ).order_by('-created_at')[:2])
    
    post.next_posts = list(related_qs.filter(
        created_at__gt=post.created_at
    ).order_by('created_at')[:2])
    
    return {
        "success": True,
        "message": "포스트 상세 조회 성공",
        "data": post
    }


@router.get("/skills", response=ApiResponse[List[SkillSchema]])
def list_skills(request):
    skills = Skill.objects.all()
    return {
        "success": True,
        "message": "기술 스택 목록 조회 성공",
        "data": list(skills)
    }

@router.get("/categories", response=ApiResponse[List[CategorySchema]])
def list_categories(request):
    categories = Category.objects.all()
    return {
        "success": True,
        "message": "카테고리 목록 조회 성공",
        "data": list(categories)
    }