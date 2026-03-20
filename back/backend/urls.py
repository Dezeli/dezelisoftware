from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja import NinjaAPI
from apis.api import router as apis_router

api = NinjaAPI()
api.add_router("/apis/", apis_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)