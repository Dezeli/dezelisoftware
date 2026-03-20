from ninja import ModelSchema, Schema
from typing import List
from .models import Skill, Project, Post

class SkillSchema(ModelSchema):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class ProjectSchema(ModelSchema):
    tech_stacks: List[SkillSchema]

    class Meta:
        model = Project
        fields = ['id', 'title', 'thumbnail', 'description', 'github_url', 'is_public', 'order', 'created_at']

class PostListSchema(ModelSchema):
    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'is_published', 'created_at']

class RelatedPostSchema(Schema):
    id: int
    title: str

class PostDetailSchema(ModelSchema):
    previous_posts: List[RelatedPostSchema]
    next_posts: List[RelatedPostSchema]

    class Meta:
        model = Post
        fields = ['id', 'title', 'category', 'content', 'is_published', 'created_at']