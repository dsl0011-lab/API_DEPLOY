from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalificacionViewSet, AsistenciaViewSet

router = DefaultRouter()
router.register(r'notas', CalificacionViewSet, basename='calificacion')
router.register(r'asistencias', AsistenciaViewSet, basename='asistencia')

urlpatterns = [
    path('', include(router.urls)),
]