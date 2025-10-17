from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioPersonalizadoViewSet
from .views import register_user
from .views import login_user
from .views import refresh_access_token

router = DefaultRouter()
router.register(r'usuarios', UsuarioPersonalizadoViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user ),
    path('refresh-token/', refresh_access_token, name='refresh-token'),
]
