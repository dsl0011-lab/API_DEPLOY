from django.db import models
from django.contrib.auth.hashers import make_password

class UsuarioPersonalizado(models.Model):
    GENEROS = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]

    ROLES = [
        ('E', 'Estudiante'),
        ('P', 'Profesor'),
        ('A', 'Administrador'),
    ]

    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    clave = models.CharField(max_length=128)
    genero = models.CharField(max_length=1, choices=GENEROS)
    rol = models.CharField(max_length=1, choices=ROLES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Encripta la contraseña antes de guardar
        if not self.pk:  # Solo al crear (no al actualizar)
            self.clave = make_password(self.clave)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.username})"
