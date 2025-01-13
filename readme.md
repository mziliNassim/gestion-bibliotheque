# Gestion des Emprunts d'une Librairie

## Envirement

```.env
PORT = 5000

# DB Configuration

MONGODB_URI = mongodb://localhost:27017/ # ou votre URI MongoDB
DB_NAME = gestion-bibliotheque

# JWT Configuration

JWT_SECRET = "your_jwt_secret_key"
JWT_EXPIRES_IN = "1d"
```

## Services

### 1. **Service de Gestion des Livres**

- **Responsabilité** : Gérer les informations sur les livres disponibles dans la librairie.

- **Fonctionnalités** :

  - Afficher, Ajouter, modifier et supprimer des livres.
  - Consulter la disponibilité des livres.
  - Mettre à jour l’état d’un livre (disponible, emprunté, réservé).

- **Canal de communication** : API REST pour les interactions avec d’autres services.

- **Base de données** :
  - Une base de données pour les informations sur les livres (ISBN, titre, auteur, catégorie, etc.).

---
