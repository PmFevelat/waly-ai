# Waly Authentication API

API d'authentification pour Waly utilisant Firebase et FastAPI.

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
pip install -r requirements.txt
```

### 2. Configuration Firebase

1. Créez un projet Firebase sur [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Activez l'authentification Firebase avec Email/Password
3. Générez une clé privée pour le SDK Admin :
   - Allez dans Paramètres du projet > Comptes de service
   - Cliquez sur "Générer une nouvelle clé privée"
   - Téléchargez le fichier JSON

### 3. Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

Remplissez les variables avec les informations de votre fichier JSON Firebase :

```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_PRIVATE_KEY_ID=votre-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nvotre-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=votre-client-email
FIREBASE_CLIENT_ID=votre-client-id
# ... autres variables
```

### 4. Configuration Email (optionnel)

Pour envoyer les emails de vérification, configurez les variables SMTP :

#### Gmail Configuration
1. Activez la vérification en 2 étapes sur votre compte Gmail
2. Générez un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Configurez dans `.env` :
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

#### Anti-Spam Best Practices
L'API inclut automatiquement :
- Headers anti-spam (Message-ID, Date, Precedence)
- Lien de désinscription
- Format de message professionnel

### 5. Démarrage du serveur

```bash
# Méthode 1: Avec le script de démarrage
python start.py

# Méthode 2: Directement avec uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera accessible sur :
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## 📚 API Endpoints

### Authentification

- `POST /auth/signup` - Créer un compte
- `POST /auth/login` - Se connecter
- `POST /auth/resend-verification` - Renvoyer l'email de vérification
- `GET /auth/user` - Obtenir le profil utilisateur (authentifié)
- `GET /auth/verify-token` - Vérifier la validité du token

### Santé

- `GET /` - Status de l'API

## 🏗️ Structure du projet

```
backend/
├── main.py              # Point d'entrée FastAPI
├── models.py            # Modèles Pydantic
├── start.py             # Script de démarrage
├── requirements.txt     # Dépendances Python
├── .env.example        # Variables d'environnement exemple
└── README.md           # Ce fichier
```

## 🔧 Modèles de données

### UserSignup
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "display_name": "John Doe"
}
```

### UserLogin
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

### UserResponse
```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "display_name": "John Doe",
  "email_verified": true,
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00",
  "last_login": "2024-01-01T00:00:00"
}
```

## 🔐 Sécurité

- Les mots de passe sont gérés par Firebase Authentication
- Les tokens sont vérifiés via Firebase Admin SDK
- CORS configuré pour le frontend
- Validation des données avec Pydantic
- Claims personnalisés pour les rôles utilisateur

## 🧪 Test de l'API

Vous pouvez tester l'API avec curl :

```bash
# Test de santé
curl http://localhost:8000/

# Créer un compte
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","display_name":"Test User"}'

# Se connecter
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🐛 Dépannage

### Erreur Firebase
Si vous obtenez des erreurs Firebase, vérifiez :
1. Que toutes les variables d'environnement sont définies
2. Que les règles Firebase Authentication sont configurées
3. Que le projet Firebase existe et est actif

### Erreur CORS
Si vous avez des erreurs CORS depuis le frontend :
1. Vérifiez que `FRONTEND_URL` est correctement défini
2. Assurez-vous que le frontend tourne sur l'URL spécifiée

### Emails non envoyés
Si les emails de vérification ne sont pas envoyés :
1. Vérifiez la configuration SMTP
2. Les liens seront affichés dans les logs si la configuration email échoue

## 📝 Développement

Pour contribuer au projet :

1. Fork le repository
2. Créez une branche feature
3. Commitez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 License

Ce projet est sous licence MIT. # Force redeploy Fri Jun 20 10:51:24 CEST 2025
