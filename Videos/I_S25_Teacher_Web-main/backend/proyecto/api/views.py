from rest_framework import viewsets
from .models import UsuarioPersonalizado
from .serializers import (
    UsuarioPersonalizadoSerializer,
    RegistroSerializer,
    LoginSerializer
)
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework import status, viewsets, filters

class IsAdminOrSelf(BasePermission):
    """
    Permite acceso total a ADMIN/superuser y acceso de objeto al propio usuario.
    Se usa junto con IsAuthenticated.
    """
    def has_permission(self, request, view):
        # Permiso general: debe estar autenticado para el ViewSet
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # ADMIN o superuser -> acceso total
        if request.user.is_superuser or getattr(request.user, "rol", None) == "ADMIN":
            return True
        # De lo contrario, solo al propio registro
        return obj.id == request.user.id

#endpoints del api default
class UsuarioPersonalizadoViewSet(viewsets.ModelViewSet):
    """
    ViewSet que gestiona las operaciones CRUD del modelo UsuarioPersonalizado.
    Esto incluye:
    - GET /api/usuarios/        → listar usuarios
    - POST /api/usuarios/       → crear un nuevo usuario
    - GET /api/usuarios/{id}/   → ver un usuario específico
    - PUT /api/usuarios/{id}/   → actualizar usuario
    - DELETE /api/usuarios/{id}/→ eliminar usuario
    """

    queryset = UsuarioPersonalizado.objects.all()
    serializer_class = UsuarioPersonalizadoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    # Búsqueda y ordenación útiles
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["email", "first_name", "last_name", "rol"]
    ordering = ["id"]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, "rol", None) == "ADMIN":
            return UsuarioPersonalizado.objects.all()
        # No-ADMIN solo su propio registro
        return UsuarioPersonalizado.objects.filter(id=user.id)

    def perform_create(self, serializer):
        """
        Crea usuario respetando set_password si viene 'password' en el body.
        Ojo: los checks de rol/is_active los gestiona el serializer (solo ADMIN).
        """
        user = serializer.save()
        password = self.request.data.get("password")
        if password:
            user.set_password(password)
            user.save()

    def destroy(self, request, *args, **kwargs):
        """
        Restringe la eliminación a ADMIN/superuser.
        """
        if not (request.user.is_superuser or getattr(request.user, "rol", None) == "ADMIN"):
            return Response({"detail": "Solo ADMIN puede eliminar usuarios."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        """
        Devuelve el perfil del usuario autenticado.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="set-password")
    def set_password(self, request):
        """
        Cambia la contraseña del usuario autenticado.
        Body: { "new_password": "..." } (mín. 8)
        """
        new_password = request.data.get("new_password")
        if not new_password or len(new_password) < 8:
            return Response({"detail": "Nueva contraseña inválida (mínimo 8 caracteres)."},
                            status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user.set_password(new_password)
        user.save()
        return Response({"ok": True})

# METODO QUE GESTIONA LOS DATOS DEL REGISTRO 
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegistroSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        #respuesta con datos y cookie para inicio de sesión
        request = Response({
            "first_name": user.first_name,
            "last_name": user.last_name,
            "rol": user.rol,
            "gender": user.gender,
            "access": str(refresh.access_token)},
            status=status.HTTP_201_CREATED)
    
        # Cookie HttpOnly para el refresh token
        request.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,  # True en producción con HTTPS 
            samesite='Lax'  # Ajusta según las necesidades
        )
        return request

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        # Crear respuesta con access token
        response = Response({
            "access": str(refresh.access_token),
            "first_name": user.first_name,
            "last_name": user.last_name,
            "rol": user.rol,
            "gender": user.gender
        }, status=status.HTTP_200_OK)

        # Guardar refresh token en cookie HttpOnly
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,   # True en producción con HTTPS
            samesite='Lax' # Ajusta según necesidades
        )

        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_access_token(request):
    refresh_token = request.COOKIES.get('refresh_token')
    
    if not refresh_token:
        return Response({"detail": "No refresh token"}, status=401)
    
    token = RefreshToken(refresh_token)
    access_token = str(token.access_token)
    
    return Response({"access": access_token})

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Campo extra en el payload
        token["rol"] = getattr(user, "rol", None)
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["rol"] = getattr(self.user, "rol", None)
        data["email"] = self.user.email
        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
