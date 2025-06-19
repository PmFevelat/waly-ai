from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# =============================================================================
# ENUMS
# =============================================================================

class UserRole(str, Enum):
    """Rôles d'utilisateur"""
    USER = "user"
    ADMIN = "admin"
    PREMIUM = "premium"

class SubscriptionStatus(str, Enum):
    """Statuts d'abonnement"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

# =============================================================================
# MODÈLES D'AUTHENTIFICATION
# =============================================================================

class UserSignup(BaseModel):
    """Modèle pour l'inscription d'un utilisateur"""
    email: EmailStr = Field(..., description="Adresse email de l'utilisateur")
    password: str = Field(..., min_length=6, description="Mot de passe (minimum 6 caractères)")
    display_name: Optional[str] = Field(None, description="Nom d'affichage de l'utilisateur")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "motdepasse123",
                "display_name": "John Doe"
            }
        }

class UserLogin(BaseModel):
    """Modèle pour la connexion d'un utilisateur"""
    email: EmailStr = Field(..., description="Adresse email de l'utilisateur")
    password: str = Field(..., description="Mot de passe de l'utilisateur")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "motdepasse123"
            }
        }

class EmailVerificationRequest(BaseModel):
    """Modèle pour la demande de renvoi d'email de vérification"""
    email: EmailStr = Field(..., description="Adresse email pour renvoyer la vérification")

class PasswordResetRequest(BaseModel):
    """Modèle pour la demande de réinitialisation de mot de passe"""
    email: EmailStr = Field(..., description="Adresse email pour la réinitialisation")

class PasswordReset(BaseModel):
    """Modèle pour la réinitialisation de mot de passe"""
    token: str = Field(..., description="Token de réinitialisation")
    new_password: str = Field(..., min_length=6, description="Nouveau mot de passe")

# =============================================================================
# MODÈLES D'UTILISATEUR
# =============================================================================

class UserBase(BaseModel):
    """Modèle de base pour un utilisateur"""
    email: EmailStr
    display_name: Optional[str] = None
    role: UserRole = UserRole.USER
    is_active: bool = True
    email_verified: bool = False

class UserCreate(UserBase):
    """Modèle pour la création d'un utilisateur"""
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    """Modèle pour la mise à jour d'un utilisateur"""
    display_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserProfile(BaseModel):
    """Modèle pour le profil utilisateur étendu"""
    bio: Optional[str] = Field(None, max_length=500, description="Biographie de l'utilisateur")
    avatar_url: Optional[str] = Field(None, description="URL de l'avatar")
    phone: Optional[str] = Field(None, description="Numéro de téléphone")
    language: Optional[str] = Field("fr", description="Langue préférée")
    timezone: Optional[str] = Field("Europe/Paris", description="Fuseau horaire")
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Préférences utilisateur")

class UserResponse(BaseModel):
    """Modèle de réponse pour un utilisateur"""
    uid: str = Field(..., description="Identifiant unique Firebase")
    email: EmailStr
    display_name: Optional[str] = None
    email_verified: bool
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    profile: Optional[UserProfile] = None

# =============================================================================
# MODÈLES DE RÉPONSE D'AUTHENTIFICATION
# =============================================================================

class AuthResponse(BaseModel):
    """Réponse d'authentification de base"""
    message: str
    success: bool = True

class SignupResponse(AuthResponse):
    """Réponse pour l'inscription"""
    uid: str
    verification_email_sent: bool = True
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Utilisateur créé avec succès. Veuillez vérifier votre email.",
                "success": True,
                "uid": "firebase_user_id",
                "verification_email_sent": True
            }
        }

class LoginResponse(AuthResponse):
    """Réponse pour la connexion"""
    custom_token: str
    user: UserResponse
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Connexion réussie",
                "success": True,
                "custom_token": "firebase_custom_token",
                "user": {
                    "uid": "firebase_user_id",
                    "email": "user@example.com",
                    "display_name": "John Doe",
                    "email_verified": True,
                    "role": "user",
                    "is_active": True
                }
            }
        }

class TokenVerificationResponse(BaseModel):
    """Réponse pour la vérification de token"""
    valid: bool
    user: Optional[UserResponse] = None
    
class RefreshTokenResponse(BaseModel):
    """Réponse pour le rafraîchissement de token"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int

# =============================================================================
# MODÈLES D'ERREUR
# =============================================================================

class ErrorResponse(BaseModel):
    """Modèle de réponse d'erreur"""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    
class ValidationErrorResponse(BaseModel):
    """Modèle de réponse pour les erreurs de validation"""
    detail: str
    errors: List[Dict[str, Any]]

# =============================================================================
# MODÈLES POUR LES FONCTIONNALITÉS FUTURES
# =============================================================================

class Subscription(BaseModel):
    """Modèle pour les abonnements"""
    user_id: str
    plan_name: str
    status: SubscriptionStatus
    start_date: datetime
    end_date: Optional[datetime] = None
    features: List[str] = Field(default_factory=list)
    
class ApiUsage(BaseModel):
    """Modèle pour l'utilisation de l'API"""
    user_id: str
    endpoint: str
    timestamp: datetime
    request_count: int = 1
    response_time_ms: Optional[float] = None

class UserSettings(BaseModel):
    """Modèles pour les paramètres utilisateur"""
    notifications_email: bool = True
    notifications_push: bool = True
    theme: str = "light"  # light, dark, auto
    language: str = "fr"
    timezone: str = "Europe/Paris"
    privacy_level: str = "normal"  # low, normal, high

# =============================================================================
# MODÈLES POUR LES LOGS ET MONITORING
# =============================================================================

class ActivityLog(BaseModel):
    """Log d'activité utilisateur"""
    user_id: str
    action: str
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class SystemHealth(BaseModel):
    """Santé du système"""
    status: str  # healthy, degraded, down
    services: Dict[str, str]  # service_name: status
    timestamp: datetime = Field(default_factory=datetime.now)
    version: str 