# back/apis/schemas.py
from ninja import ModelSchema, Schema
from typing import List, Optional, Generic, TypeVar
from django.conf import settings
from datetime import datetime, date
from .models import Skill, Project, Post, Profile, Category

T = TypeVar('T')

class ApiResponse(Schema, Generic[T]):
    success: bool = True
    message: str
    data: Optional[T] = None

class PaginatedData(Schema, Generic[T]):
    items: List[T]
    count: int

class SkillSchema(ModelSchema):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class CategorySchema(ModelSchema):
    class Meta:
        model = Category
        fields = ['id', 'name', 'order']

class ProfileSchema(ModelSchema):
    skills: List[SkillSchema]
    profile_image: str = None
    logo_image: str = None

    class Meta:
        model = Profile
        fields = ['name', 'slogan', 'introduction', 'contact_email']

    @staticmethod
    def resolve_skills(obj):
        return obj.skills.all()

    @staticmethod
    def resolve_profile_image(obj):
        if obj.profile_image:
            return f"{settings.SITE_URL}{obj.profile_image.url}"
        return None

    @staticmethod
    def resolve_logo_image(obj):
        if obj.logo_image:
            return f"{settings.SITE_URL}{obj.logo_image.url}"
        return None

class ProjectSchema(ModelSchema):
    tech_stacks: List[SkillSchema]
    thumbnail: str = None

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'github_url', 'is_public', 'order', 'start_date', 'end_date', 'created_at']

    @staticmethod
    def resolve_tech_stacks(obj):
        return obj.tech_stacks.all()

    @staticmethod
    def resolve_thumbnail(obj):
        if obj.thumbnail:
            return f"{settings.SITE_URL}{obj.thumbnail.url}"
        return None

class RelatedProjectSchema(Schema):
    id: int
    title: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    tech_stacks: List[SkillSchema]

class ProjectDetailSchema(ModelSchema):
    tech_stacks: List[SkillSchema]
    previous_projects: List[RelatedProjectSchema]
    next_projects: List[RelatedProjectSchema]
    thumbnail: str = None

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'github_url', 'is_public', 'order', 'start_date', 'end_date', 'created_at']

    @staticmethod
    def resolve_tech_stacks(obj):
        return obj.tech_stacks.all()

    @staticmethod
    def resolve_thumbnail(obj):
        if obj.thumbnail:
            return f"{settings.SITE_URL}{obj.thumbnail.url}"
        return None


class PostListSchema(ModelSchema):
    category: CategorySchema

    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'is_published', 'created_at']

class RelatedPostSchema(Schema):
    id: int
    title: str
    created_at: datetime
    category: CategorySchema

class PostDetailSchema(ModelSchema):
    category: CategorySchema
    previous_posts: List[RelatedPostSchema]
    next_posts: List[RelatedPostSchema]

    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'content', 'is_published', 'created_at']