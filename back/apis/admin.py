# back/apis/admin.py
from django.contrib import admin
from django.utils.html import format_html

from .models import Skill, Profile, Project, Post, Category

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_public', 'order', 'project_thumbnail']
    list_editable = ['is_public', 'order']
    filter_horizontal = ['tech_stacks']

    def project_thumbnail(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.thumbnail.url)
        return "-"
    project_thumbnail.short_description = '미리보기'

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_email', 'profile_preview']
    filter_horizontal = ['skills']

    def profile_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.profile_image.url)
        return "-"
    profile_preview.short_description = '프로필 이미지'

admin.site.register(Skill)
admin.site.register(Category)
admin.site.register(Post)