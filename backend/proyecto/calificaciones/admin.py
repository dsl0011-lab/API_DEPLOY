from django.contrib import admin
from .models import NotaAcademica, Asistencia

@admin.register(NotaAcademica)
class NotaAcademicaAdmin(admin.ModelAdmin):
    list_display = ['estudiante', 'curso', 'nombre_evaluacion', 'nota', 'calificacion_texto']
    list_filter = ['tipo_evaluacion', 'curso']

@admin.register(Asistencia)
class AsistenciaAdmin(admin.ModelAdmin):
    list_display = ['estudiante', 'curso', 'fecha', 'presente']
    list_filter = ['presente', 'curso']