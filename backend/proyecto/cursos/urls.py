from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CursoViewSet, TareaViewSet, EntregaViewSet, CalificacionViewSet

router = DefaultRouter()
router.register(r'cursos', CursoViewSet, basename='curso')
router.register(r'tareas', TareaViewSet, basename='tarea')
router.register(r'entregas', EntregaViewSet, basename='entrega')
router.register(r'calificaciones', CalificacionViewSet, basename='calificacion')

urlpatterns = [
    path('', include(router.urls)),
]
