from rest_framework import serializers
from .models import UsuarioPersonalizado
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegistroSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = UsuarioPersonalizado
        fields = ("email", "first_name", "last_name", "password", "gender", "rol")
        extra_kwargs = {
            'contraseña': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = UsuarioPersonalizado(**validated_data)
        user.set_password(password)
        if not user.username:  # opcional: generar uno interno
            import uuid
            user.username = str(uuid.uuid4())[:8]
        user.save()
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs.get("email"), password=attrs.get("password"))
        if not user:
            raise serializers.ValidationError("Credenciales inválidas.")
        attrs["user"] = user
        return attrs
    

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioPersonalizado
        fields = ("id", "email", "first_name")


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["rol"] = getattr(user, "rol", None)
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["rol"] = getattr(self.user, "rol", None)
        data["email"] = self.user.email
        return data
    

class UsuarioPersonalizadoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8, allow_blank=False)

    class Meta:
        model = UsuarioPersonalizado
        fields = [
            "id", "username", "first_name", "last_name",
            "email", "role", "password",
            "is_active", "last_login", "date_joined",
        ]
        read_only_fields = ["id", "last_login", "date_joined"]  # is_active lo controlamos por rol abajo

    # ----- helpers -----
    def _is_admin(self):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        return bool(user and (user.is_superuser or getattr(user, "role", None) == "ADMIN"))

    # ----- create -----
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        # Solo ADMIN puede asignar role / is_active al crear
        if (("role" in validated_data) or ("is_active" in validated_data)) and not self._is_admin():
            raise serializers.ValidationError({"detail": "Solo ADMIN puede asignar rol o activar/desactivar usuarios."})

        user = UsuarioPersonalizado(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    # ----- update -----
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        # Si intentan cambiar role o is_active sin ser ADMIN → error
        if ("role" in validated_data or "is_active" in validated_data) and not self._is_admin():
            raise serializers.ValidationError({"detail": "Solo ADMIN puede cambiar rol o estado del usuario."})

        # Actualiza campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Cambiar contraseña correctamente
        if password:
            instance.set_password(password)

        instance.save()
        return instance