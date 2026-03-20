from ninja import Router
from ninja.pagination import paginate, PageNumberPagination
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import Project, Post
from .schemas import ProjectSchema, PostListSchema, PostDetailSchema

router = Router()

@router.get("/projects", response=List[ProjectSchema])
@paginate(PageNumberPagination, page_size=9)
def list_projects(request, skill: Optional[str] = None):
    qs = Project.objects.filter(is_public=True).prefetch_related('tech_stacks')
    if skill:
        qs = qs.filter(tech_stacks__name__iexact=skill)
    return qs

@router.get("/posts", response=List[PostListSchema])
@paginate(PageNumberPagination, page_size=9)
def list_posts(request, category: Optional[str] = None):
    qs = Post.objects.filter(is_published=True)
    if category:
        qs = qs.filter(category__iexact=category)
    return qs

@router.get("/posts/{post_id}", response=PostDetailSchema)
def get_post_detail(request, post_id: int):
    post = get_object_or_404(Post, id=post_id, is_published=True)
    
    prev_posts = Post.objects.filter(
        is_published=True, 
        created_at__lt=post.created_at
    ).order_by('-created_at')[:2]
    
    next_posts = Post.objects.filter(
        is_published=True, 
        created_at__gt=post.created_at
    ).order_by('created_at')[:2]

    post.previous_posts = list(prev_posts)
    post.next_posts = list(next_posts)
    
    return post