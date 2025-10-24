from django.contrib.auth.models import AbstractUser
from django.db import models

class UsuarioPersonalizado(AbstractUser):
    username = models.CharField(max_length=150, blank=True, null=True)  # ahora opcional
    email = models.EmailField(unique=True)

    class gender(models.TextChoices):
        MALE = 'M', 'Masculino',
        FEMALE = 'F', 'Femenino',
    
    gender = models.CharField(
        max_length=1,
        choices=gender.choices,
        default=gender.MALE
    )

    #roles
    class rol(models.TextChoices):
        ADMIN = "A", "Administrador"
        TEACHER = "P", "Profesor"
        STUDENT = "E", "Estudiante"

    rol = models.CharField(
        max_length=1,
        choices=rol.choices,
        default=rol.STUDENT
    )

    USERNAME_FIELD = 'email'          # <- Clave para JWT y Django login
    REQUIRED_FIELDS = ['first_name', "rol"]  # Campos obligatorios para crear superuser

    def __str__(self):
        return f"{self.name} {self.last_name} ({self.role})"
