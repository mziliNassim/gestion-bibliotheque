# Gestion des Emprunts d'une Librairie

## Navigation

- [Envirement Variables](#envirement-variables)
- [Authentification](#authentification)
  - [1 - Register a User](#1---register-a-user)
  - [2 - Login User](#2---login-user)
  - [3 - Logout User](#3---logout-user)
- [Services](#services)
  - [1 - Service de Gestion des Livres](#1---service-de-gestion-des-livres)
  - [2 - Service de Gestion des Emprunts](#2---service-de-gestion-des-emprunts)

## Envirement Variables

```.env
PORT = 5000

# DB Configuration

MONGODB_URI = mongodb://localhost:27017/ # ou votre URI MongoDB
DB_NAME = gestion-bibliotheque

# JWT Configuration

JWT_SECRET = "your_jwt_secret_key"
JWT_EXPIRES_IN = "1d"
```

## Authentification

> Manages user authentication in the application.
> Includes routes for user registration, login, and logout.

### 1 - Register a User

- **description:** Registers a new user in the system and provides a JWT token for future requests.

- **Method:** _`POST`_

- **Root:** .../auth/register

- **Request Body:**

  ```json
  {
    "username": "exampleUsername",
    "email": "example@example.com",
    "password": "securePassword",
    "confirmPassword": "securePassword"
  }
  ```

- **Response:**

  - **201 Created:**

    ```json
    {
      "message": "User registered successfully.",
      "data": "USER_INFOS",
      "token": "JWT_TOKEN"
    }
    ```

  - **400 Bad Request:**

    ```json
    { "message": "MESSAGE_WHILE_PROCESS", "data": null }
    ```

  - **500 Internal Server Error:**

    ```json
    { "message": "Internal server error", "data": null }
    ```

### 2 - Login User

- **Description:** Authenticates a user and provides a JWT token for future requests.

- **Method:** _`POST`_

- **Root:** .../auth/login

- **Request Body:**

  ```json
  {
    "email": "example@example.com",
    "password": "securePassword"
  }
  ```

- **Response:**

  - **201 Created:**

    ```json
    {
      "message": "Login successful.",
      "data": "USER_INFOS",
      "token": "JWT_TOKEN"
    }
    ```

  - **400 Bad Request:**

    ```json
    { "message": "MESSAGE_WHILE_PROCESS", "data": null }
    ```

  - **500 Internal Server Error:**

    ```json
    { "message": "Internal server error", "data": null }
    ```

### 3 - Logout User

- **Description:** Ends the user's session by invalidating the authentication token.

- **Method:** _`POST`_

- **Root:** .../auth/logout

- **Request Body:** _(No body required)_

- **Response:**

  - **200 OK:**

    ```json
    { "message": "Logout successful.", "data": null }
    ```

  - **401 Unauthorized:**

    ```json
    { "error": "Unauthorized. Token missing or invalid.", "data": null }
    ```

  - **500 Internal Server Error:**

    ```json
    { "message": "Internal server error", "data": null }
    ```

- **Headers Required:**

  - **Authorization:** `Bearer <jwt-token>` _(The token provided during login)._

## Services

### 1 - **Service de Gestion des Livres**

- **Responsabilité** :

  - Gérer les informations sur les livres disponibles dans la librairie.

- **Fonctionnalités** :

  - Afficher, Ajouter, modifier et supprimer des livres.
  - Consulter la disponibilité des livres.
  - Mettre à jour l’état d’un livre (disponible, emprunté, réservé).

- **Canal de communication** :

  - API REST pour les interactions avec d’autres services.

- **Base de données** :

  - Une base de données pour les informations sur les livres (isbn, titre, auteur, categorie, annee_publication, editeur, langue, description, tags, disponible).

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
