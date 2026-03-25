import os
import uuid
from django.db import models

def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('profile/%Y/%m/', filename)


class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Profile(models.Model):
    name = models.CharField(max_length=50)
    slogan = models.CharField(max_length=200)
    profile_image = models.ImageField(upload_to=get_file_path, null=True, blank=True)
    logo_image = models.ImageField(upload_to=get_file_path, null=True, blank=True)
    introduction = models.TextField()
    contact_email = models.EmailField()
    skills = models.ManyToManyField(Skill, related_name='profiles', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to=get_file_path, null=True, blank=True)
    description = models.TextField()
    github_url = models.URLField(blank=True, null=True)
    is_public = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    tech_stacks = models.ManyToManyField(Skill, related_name='projects', blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

class Post(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='posts')
    content = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title