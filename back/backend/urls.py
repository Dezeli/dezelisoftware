from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja import NinjaAPI
from apis.api import router as apis_router
from ninja.errors import ValidationError
from django.http import Http404

api = NinjaAPI()
api.add_router("", apis_router)

@api.exception_handler(Http404)
def not_found_handler(request, exc):
    return api.create_response(
        request,
        {"success": False, "message": "요청하신 데이터를 찾을 수 없습니다.", "data": None},
        status=404,
    )

@api.exception_handler(ValidationError)
def validation_errors(request, exc):
    return api.create_response(
        request,
        {"success": False, "message": "잘못된 요청 파라미터입니다.", "data": exc.errors},
        status=400,
    )

@api.exception_handler(Exception)
def global_exception(request, exc):
    return api.create_response(
        request,
        {"success": False, "message": "서버 내부 오류가 발생했습니다.", "data": None},
        status=500,
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)