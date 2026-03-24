# back/apis/schemas.py
from ninja import ModelSchema, Schema
from typing import List, Optional, Generic, TypeVar
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

    class Meta:
        model = Profile
        fields = ['name', 'slogan', 'profile_image', 'logo_image', 'introduction', 'contact_email']

    @staticmethod
    def resolve_skills(obj):
        return obj.skills.all()

class ProjectSchema(ModelSchema):
    tech_stacks: List[SkillSchema]

    class Meta:
        model = Project
        fields = ['id', 'title', 'thumbnail', 'description', 'github_url', 'is_public', 'order', 'created_at']
        
    @staticmethod
    def resolve_tech_stacks(obj):
        return obj.tech_stacks.all()

class RelatedProjectSchema(Schema):
    id: int
    title: str

class ProjectDetailSchema(ModelSchema):
    tech_stacks: List[SkillSchema]
    previous_projects: List[RelatedProjectSchema]
    next_projects: List[RelatedProjectSchema]

    class Meta:
        model = Project
        fields = ['id', 'title', 'thumbnail', 'description', 'github_url', 'is_public', 'order', 'created_at']

    @staticmethod
    def resolve_tech_stacks(obj):
        return obj.tech_stacks.all()


class PostListSchema(ModelSchema):
    category: CategorySchema

    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'is_published', 'created_at']

class RelatedPostSchema(Schema):
    id: int
    title: str

class PostDetailSchema(ModelSchema):
    category: CategorySchema
    previous_posts: List[RelatedPostSchema]
    next_posts: List[RelatedPostSchema]

    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'content', 'is_published', 'created_at']