from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv
from datetime import datetime
from typing import Optional
import httpx

# Importer les modèles
from models import (
    UserSignup, UserLogin, EmailVerificationRequest, UserResponse,
    SignupResponse, LoginResponse, TokenVerificationResponse,
    AuthResponse, ErrorResponse, UserRole
)

# Charger les variables d'environnement
load_dotenv()

app = FastAPI(
    title="Waly Authentication API", 
    version="1.0.0",
    description="API d'authentification pour Waly avec Firebase et FastAPI",
    contact={
        "name": "Équipe Waly",
        "email": "contact@waly.com",
    }
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        try:
            # Vérifier si un fichier de service account existe
            service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
            if service_account_path:
                # Construire le chemin absolu
                if not os.path.isabs(service_account_path):
                    service_account_path = os.path.join(os.path.dirname(__file__), service_account_path)
                
                if os.path.exists(service_account_path):
                    cred = credentials.Certificate(service_account_path)
                    firebase_admin.initialize_app(cred)
                    print(f"✅ Firebase Admin SDK initialisé avec le fichier: {service_account_path}")
                    return
                else:
                    print(f"❌ Fichier Firebase non trouvé: {service_account_path}")
            
            # Sinon, essayer avec les variables d'environnement
            firebase_credentials = {
                "type": os.getenv("FIREBASE_TYPE"),
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
            }
            
            # Vérifier que les credentials essentiels sont présents
            required_fields = ["project_id", "private_key", "client_email"]
            missing_fields = [field for field in required_fields if not firebase_credentials.get(field)]
            
            if missing_fields:
                print(f"⚠️  Credentials Firebase manquants: {missing_fields}")
                print("L'application fonctionnera en mode développement.")
                print("Pour configurer Firebase:")
                print("1. Téléchargez votre clé de service depuis Firebase Console")
                print("2. Placez-la dans backend/firebase-service-account.json")
                print("3. Ou configurez les variables d'environnement dans .env")
                return
            
            cred = credentials.Certificate(firebase_credentials)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin SDK initialisé avec succès")
            
        except Exception as e:
            print(f"❌ Erreur lors de l'initialisation de Firebase: {e}")
            print("L'application fonctionnera en mode développement.")

initialize_firebase()

# Sécurité HTTP Bearer pour les tokens
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Vérifie le token Firebase et retourne l'utilisateur actuel"""
    try:
        # Vérifier le token Firebase
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/")
async def root():
    return {"message": "Waly Authentication API is running!"}

@app.get("/health")
async def health_check():
    """Endpoint de vérification de santé pour Railway"""
    return {"status": "healthy", "message": "Waly API is running"}

@app.post("/auth/signup", response_model=SignupResponse)
async def signup(user_data: UserSignup):
    """Créer un nouvel utilisateur avec Firebase"""
    try:
        # Créer l'utilisateur avec Firebase Admin SDK
        user = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.display_name,
            email_verified=False
        )
        
        # Ajouter des claims personnalisés pour le rôle
        auth.set_custom_user_claims(user.uid, {
            "role": UserRole.USER.value,
            "created_at": datetime.now().isoformat(),
            "is_active": True
        })
        
        # Envoyer l'email de vérification
        try:
            # Générer un token personnalisé pour la vérification
            verification_token = auth.create_custom_token(user.uid, {"email_verification": True})
            
            # Créer un lien personnalisé vers notre frontend
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
            verification_link = f"{frontend_url}/verify-email-action?token={verification_token.decode('utf-8')}&email={user_data.email}"
            
            await send_verification_email(user_data.email, verification_link)
            verification_sent = True
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email de vérification: {e}")
            verification_sent = False
        
        return SignupResponse(
            message="User created successfully. Please check your email.",
            uid=user.uid,
            verification_email_sent=verification_sent
        )
        
    except auth.EmailAlreadyExistsError:
        # Vérifier si l'utilisateur existe réellement
        try:
            existing_user = auth.get_user_by_email(user_data.email)
            if existing_user.email_verified:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This email address is already in use with a verified account"
                )
            else:
                # L'utilisateur existe mais n'a pas vérifié son email
                # On peut renvoyer l'email de vérification
                link = auth.generate_email_verification_link(user_data.email)
                await send_verification_email(user_data.email, link)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This email address is already associated with an unverified account. A new verification email has been sent."
                )
        except auth.UserNotFoundError:
            # L'utilisateur n'existe pas, erreur étrange
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Synchronization error. Please try again in a few minutes."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating account: {str(e)}"
        )

@app.post("/auth/login", response_model=LoginResponse)
async def login(user_data: UserLogin):
    """Connexion utilisateur - retourne un token personnalisé"""
    try:
        # Vérifier que l'utilisateur existe
        user = auth.get_user_by_email(user_data.email)
        
        # Vérifier si l'utilisateur est actif
        custom_claims = user.custom_claims or {}
        if not custom_claims.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account disabled. Contact administrator."
            )
        
        # Mettre à jour la dernière connexion
        auth.set_custom_user_claims(user.uid, {
            **custom_claims,
            "last_login": datetime.now().isoformat()
        })
        
        # Créer un token personnalisé
        custom_token = auth.create_custom_token(user.uid)
        
        # Créer la réponse utilisateur
        user_response = UserResponse(
            uid=user.uid,
            email=user.email,
            display_name=user.display_name,
            email_verified=user.email_verified,
            role=UserRole(custom_claims.get("role", UserRole.USER.value)),
            is_active=custom_claims.get("is_active", True),
            created_at=datetime.fromisoformat(custom_claims["created_at"]) if custom_claims.get("created_at") else None,
            last_login=datetime.now()
        )
        
        return LoginResponse(
            message="Login successful",
            custom_token=custom_token.decode('utf-8'),
            user=user_response
        )
        
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )

@app.post("/auth/resend-verification", response_model=AuthResponse)
async def resend_verification_email(request: EmailVerificationRequest):
    """Renvoyer l'email de vérification"""
    try:
        user = auth.get_user_by_email(request.email)
        
        if user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified"
            )
        
        # Générer et envoyer le lien de vérification personnalisé
        verification_token = auth.create_custom_token(user.uid, {"email_verification": True})
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        verification_link = f"{frontend_url}/verify-email-action?token={verification_token.decode('utf-8')}&email={request.email}"
        
        await send_verification_email(request.email, verification_link)
        
        return AuthResponse(message="Verification email sent")
        
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'envoi de l'email: {str(e)}"
        )

@app.get("/auth/user", response_model=UserResponse)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Obtenir le profil de l'utilisateur connecté"""
    try:
        user = auth.get_user(current_user['uid'])
        return UserResponse(
            uid=user.uid,
            email=user.email,
            display_name=user.display_name,
            email_verified=user.email_verified
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération du profil: {str(e)}"
        )

@app.get("/auth/verify-token", response_model=TokenVerificationResponse)
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Vérifier si le token est valide"""
    try:
        # Récupérer les informations complètes de l'utilisateur
        user = auth.get_user(current_user['uid'])
        custom_claims = user.custom_claims or {}
        
        user_response = UserResponse(
            uid=user.uid,
            email=user.email,
            display_name=user.display_name,
            email_verified=user.email_verified,
            role=UserRole(custom_claims.get("role", UserRole.USER.value)),
            is_active=custom_claims.get("is_active", True),
            created_at=datetime.fromisoformat(custom_claims["created_at"]) if custom_claims.get("created_at") else None,
            last_login=datetime.fromisoformat(custom_claims["last_login"]) if custom_claims.get("last_login") else None
        )
        
        return TokenVerificationResponse(
            valid=True,
            user=user_response
        )
    except Exception as e:
        return TokenVerificationResponse(valid=False)

@app.post("/auth/google-signin", response_model=LoginResponse)
async def google_signin(current_user: dict = Depends(get_current_user)):
    """Connexion/inscription avec Google"""
    try:
        user_uid = current_user['uid']
        user = auth.get_user(user_uid)
        
        # Vérifier si c'est un nouvel utilisateur ou existant
        custom_claims = user.custom_claims or {}
        
        # Si c'est un nouvel utilisateur, ajouter les claims
        if not custom_claims.get("created_at"):
            auth.set_custom_user_claims(user.uid, {
                "role": UserRole.USER.value,
                "created_at": datetime.now().isoformat(),
                "is_active": True,
                "last_login": datetime.now().isoformat(),
                "provider": "google"
            })
            custom_claims = {
                "role": UserRole.USER.value,
                "created_at": datetime.now().isoformat(),
                "is_active": True,
                "last_login": datetime.now().isoformat(),
                "provider": "google"
            }
        else:
            # Mettre à jour la dernière connexion
            auth.set_custom_user_claims(user.uid, {
                **custom_claims,
                "last_login": datetime.now().isoformat()
            })
        
        # Créer un token personnalisé
        custom_token = auth.create_custom_token(user.uid)
        
        # Créer la réponse utilisateur
        user_response = UserResponse(
            uid=user.uid,
            email=user.email,
            display_name=user.display_name,
            email_verified=user.email_verified,  # Google emails sont automatiquement vérifiés
            role=UserRole(custom_claims.get("role", UserRole.USER.value)),
            is_active=custom_claims.get("is_active", True),
            created_at=datetime.fromisoformat(custom_claims["created_at"]) if custom_claims.get("created_at") else None,
            last_login=datetime.now()
        )
        
        return LoginResponse(
            message="Connexion Google réussie",
            custom_token=custom_token.decode('utf-8'),
            user=user_response
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la connexion Google: {str(e)}"
        )

@app.post("/auth/verify-email-token")
async def verify_email_token(request: dict):
    """Vérifier le token personnalisé et marquer l'email comme vérifié"""
    try:
        token = request.get("token")
        email = request.get("email")
        
        if not token or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token and email required"
            )
        
        # Vérifier le token personnalisé
        decoded_token = auth.verify_id_token(token)
        
        # Vérifier que le token contient la claim de vérification d'email
        if not decoded_token.get("email_verification"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email verification token"
            )
        
        # Vérifier que l'email correspond
        user = auth.get_user(decoded_token['uid'])
        if user.email != email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email ne correspond pas au token"
            )
        
        # Marquer l'email comme vérifié
        auth.update_user(user.uid, email_verified=True)
        
        return {"message": "Email vérifié avec succès", "success": True}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de la vérification: {str(e)}"
        )

@app.delete("/auth/debug/delete-user/{email}")
async def debug_delete_user(email: str):
    """Endpoint de debug pour supprimer complètement un utilisateur (À SUPPRIMER EN PRODUCTION)"""
    try:
        user = auth.get_user_by_email(email)
        auth.delete_user(user.uid)
        return {"message": f"Utilisateur {email} supprimé avec succès"}
    except auth.UserNotFoundError:
        return {"message": f"Utilisateur {email} n'existe pas"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la suppression: {str(e)}"
        )

@app.patch("/auth/profile")
async def update_user_profile(updates: dict, current_user: dict = Depends(get_current_user)):
    """Mettre à jour le profil utilisateur"""
    try:
        user_uid = current_user['uid']
        user = auth.get_user(user_uid)
        
        # Récupérer les claims actuels
        custom_claims = user.custom_claims or {}
        
        # Mettre à jour les claims avec les nouvelles données
        allowed_fields = ['display_name', 'company', 'job_title', 'industry', 'competitors']
        for field in allowed_fields:
            if field in updates:
                if field == 'display_name':
                    # Mettre à jour le display name dans Firebase Auth
                    auth.update_user(user_uid, display_name=updates[field])
                else:
                    # Mettre à jour dans les custom claims
                    custom_claims[field] = updates[field]
        
        # Sauvegarder les claims mis à jour
        auth.set_custom_user_claims(user_uid, custom_claims)
        
        return {"message": "Profile updated successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )

async def send_verification_email(email: str, verification_link: str):
    """Envoyer l'email de vérification"""
    try:
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        # Si SMTP n'est pas configuré, afficher le lien dans les logs
        if not all([smtp_server, smtp_username, smtp_password]):
            print(f"\n🔗 VERIFICATION LINK for {email}:")
            print(f"   {verification_link}")
            print(f"💡 To send emails automatically, configure SMTP in .env\n")
            return
        
        # Envoyer l'email via SMTP
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = email
        msg['Subject'] = "Verify your email - Waly"
        msg['Reply-To'] = smtp_username
        msg['Message-ID'] = f"<{datetime.now().timestamp()}@waly.com>"
        msg['Date'] = datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0000")
        
        # Headers anti-spam
        msg['List-Unsubscribe'] = f"<mailto:{smtp_username}?subject=unsubscribe>"
        msg['Precedence'] = 'bulk'
        
        body = f"""
Hello,

Thank you for signing up for Waly!

To complete your account creation, please click the link below to verify your email address:

{verification_link}

This link expires in 1 hour.

If you did not create an account on Waly, you can ignore this email.

Best regards,
The Waly Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, email, text)
        server.quit()
        
        print(f"✅ Verification email sent to {email}")
        
    except Exception as e:
        print(f"❌ Error sending email to {email}: {e}")
        print(f"🔗 Verification link: {verification_link}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 