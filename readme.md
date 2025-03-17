# Gestion des Emprunts d'une Librairie

## Navigation

- [Envirement Variables](#envirement-variables)
- [Services](#services)
  - [1 - Service de Gestion des Livres](#1---service-de-gestion-des-livres)
  - [2 - Service de Gestion des Emprunts](#2---service-de-gestion-des-emprunts)
  - [3 - Service de Gestion des Clients](#3---service-de-gestion-des-clients)
  - [4 - Service de Gestion des Notifications](#4---service-de-gestion-des-notifications)

## Envirement Variables

```.env
LIVRES_PORT = 5002
CLINETS_PORT = 5003
EMPRUNTS_PORT = 5004
NOTIFICATIONS_PORT = 5005

# DB Configuration
MONGODB_URI = mongodb://localhost:27017/ # ou votre URI MongoDB
DB_NAME = gestion-bibliotheque

```

## Services

### 1 - **Service de Gestion des Livres**

- **Responsabilité** :

  - Gérer les informations sur les livres disponibles dans la bibliotique.

- **Fonctionnalités** :

  - Afficher, Ajouter, modifier et supprimer des livres.
  - Consulter la disponibilité des livres.
  - Mettre à jour l’état d’un livre (disponible, emprunté, réservé).

- **Canal de communication** :

  - API REST pour les interactions avec d’autres services.

- **Base de données** :

  - Une base de données pour les informations sur les livres (isbn, titre, auteur, categorie, annee_publication, editeur, langue, description, tags, disponible).

---

### 2 - **Service de Gestion des Emprunts**

- **Responsabilité** :

  - Gérer les emprunts effectués par les clients.

- **Fonctionnalités** :

  - Créer, mettre à jour la disponibilité et la retourne des emprunts.

- **Canal de communication** :

  - API REST.
  - Messages asynchrones pour notifier d’autres services (service de notification).

- **Base de données** :

  - Une base de données pour les enregistrements des emprunts (clientId, livreId, startDate, returnDate, status).

---

### 3 - **Service de Gestion des Clients**

- **Responsabilité** :

  - Gérer les informations et les profils des clients.

- **Fonctionnalités** :

  - Ajouter, modifier et supprimer des clients.
  - Suivre les emprunts en cours et les historiques des clients.

- **Canal de communication** :

  - API REST pour fournir les informations sur les clients aux autres services.

- **Base de données** :

  - Une base de données pour les profils des clients (username, email, password (Hash Password), historique des emprunts).

---

### 4 - **Service de Gestion des Notifications**

- **Responsabilité** :

  - Gérer les notifications envoyées aux clients pour les informer des événements liés à leurs emprunts, et autres activités dans la bibliothèque.

- **Fonctionnalités** :

  - Envoyer des notifications aux clients (par exemple, rappel de retour de livre, confirmation d’emprunt, etc.).

  - Marquer les notifications comme lues ou non lues.

  - Consulter les notifications pour un client spécifique (toutes les notifications ou filtrées par état : lues/non lues).

  - Supprimer des notifications.

- **Canal de communication** :

  - API REST pour recevoir des demandes de notifications des autres services (par exemple, le service des emprunts).

- **Base de données** :

  - Une base de données pour stocker les notifications (\_id, clientID, message, read (booléen), createdAt).

---
