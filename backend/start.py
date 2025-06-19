#!/usr/bin/env python3
"""
Script de démarrage pour l'API Waly Authentication
"""

import uvicorn
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

if __name__ == "__main__":
    # Configuration du serveur
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    log_level = os.getenv("LOG_LEVEL", "info")
    
    print("🚀 Démarrage de l'API Waly Authentication...")
    print(f"📍 Serveur: http://{host}:{port}")
    print(f"📚 Documentation: http://{host}:{port}/docs")
    print(f"🔄 Rechargement automatique: {'✅' if reload else '❌'}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level=log_level
    ) 