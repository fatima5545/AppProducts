# Flask Product Management API

Cette application est un **API Flask** qui gère une liste de produits et interagit avec une base de données SQLite. Elle prend également en charge les requêtes Cross-Origin Resource Sharing (CORS) depuis un frontend en Angular (ou toute autre application sur `http://localhost:4200`).

## Architecture du projet

Le projet **Flask Product Management API** est organisé selon une architecture de type **MVC (Modèle-Vue-Contrôleur)** adaptée aux API RESTful. Elle se compose des éléments suivants :

- **Modèles (Models)** : La partie _models_ gère les entités de base de données, notamment les produits.

- **Vues (Views)** : Dans ce projet, les vues correspondent aux _routes_ de l'API. Elles sont définies dans le fichier `routes.py` (par exemple la méthide get)

- **Contrôleur (Controller)** : La logique de traitement est principalement dans les méthodes des ressources (_resources_) définies dans `routes.py`. Le contrôleur reçoit les requêtes, interagit avec les modèles, applique les règles métier et renvoie les réponses JSON. par exemple la classe ProductDetail

### Schéma de l'architecture

```
                          +-----------------------+
                          |     Frontend (Angular)|
                          |-----------------------|
                          |   Consomme l'API REST |
                          +-----------------------+
                                    |
                                    V
       +---------------------------------------------+
       |            API Flask Product Management     |
       |---------------------------------------------|
       |            +----------------------+         |
       |            |        Routes        |         |
       |            +----------------------+         |
       |                    |                        |
       |                    V                        |
       |            +----------------------+         |
       |            |      Modèles         |         |
       |            +----------------------+         |
       |                    |                        |
       |                    V                        |
       |            +----------------------+         |
       |            |    Base de données   |         |
       |            |       SQLite         |         |
       +---------------------------------------------+
```

## Prérequis

- **Python 3.8+** doit être installé sur votre système.
- **Flask** et ses dépendances sont listées dans le fichier `requirements.txt`.

## Installation

1. **Clonez le projet** :

   ```bash
   git clone https://github.com/fatima5545/ProductsApp.git
   cd back
   ```

2. **Créez et activez votre environnement virtuel et installez les dépendances :**

   ```bash
   python -m venv venv
   source venv/bin/activate        # Sur macOS/Linux
   .\venv\Scripts\activate         # Sur Windows
   pip install -r requirements.txt
   ```

## Configuration

Le fichier `products.json` dans le dossier `assets/` contient les données de produits initiales qui seront insérées dans la base de données.

## Utilisation de SendGrid pour l'envoi d'emails

Ce projet utilise SendGrid pour l'envoi d'emails transactionnels ou de notifications. SendGrid est un service cloud permettant d'envoyer des emails de manière sécurisée et fiable, en utilisant une clé API.

Pour utiliser la fonctionnalité d'envoi d'emails de ce projet, vous devrez configurer une clé API SendGrid et vérifier un expéditeur unique (Single Sender Verification). Suivez les étapes ci-dessous pour configurer votre propre clé API SendGrid.

### Étape 1: Créer un compte SendGrid

1. Allez sur [SendGrid](https://sendgrid.com/).
2. Créez un compte gratuit si vous n’en avez pas déjà un.
3. Vérifiez votre compte via l'email de confirmation envoyé par SendGrid.

### Étape 2: Créez une clé API SendGrid

1. Connectez-vous à votre compte SendGrid.
2. Allez dans _Settings_ -> _API Keys_.
3. Cliquez sur _Create API Key_, donnez un nom à la clé et sélectionnez les autorisations nécessaires.
4. Copiez la clé générée (elle ne sera plus visible par la suite).

### Étape 3: Vérifiez un expéditeur unique (Single Sender Verification)

1. Allez dans _Settings_ -> _Sender Authentication_.
2. Cliquez sur _Get Started_ sous _Single Sender Verification_.
3. Renseignez les informations de votre expéditeur, puis cliquez sur _Create_.
4. Vous recevrez un email de vérification. Confirmez votre expéditeur en cliquant sur le lien dans l'email.

### Étape 4: Créez un fichier `.env`

Créez un fichier `.env` dans le répertoire racine de l'application Flask (`back/`). Ce fichier contiendra votre clé SendGrid et l'email expéditeur vérifié :

```
SENDGRID_API_KEY=Votre_Clé_API_SendGrid
SENDGRID_SENDER_EMAIL=Votre_Email_Expéditeur
```

Ne partagez jamais ce fichier `.env` publiquement ou dans un dépôt de code.

## Lancer l'Application et Tester

Une fois toutes les étapes de configuration terminées, démarrez votre application Flask et testez l'envoi d'emails à partir de l'API. Vous pouvez utiliser Postman ou un autre outil pour envoyer une requête à l'endpoint de l'API.

## Démarrage

Pour démarrer l'application, exécutez la commande suivante :

```bash
python run.py
```

Cela va :

1. **Créer une instance de l'application Flask.**

2. **Configurer une base de données SQLite appelée `products.db`.**

3. **Charger les données de produits depuis le fichier `assets/products.json` si la base de données est vide.**

## Accès au Swagger

Le swagger sera disponible à l'adresse suivante :

```
http://localhost:5000/swagger
```

<img width="732" alt="image" src="https://github.com/user-attachments/assets/b5662655-3955-437a-927e-1713a848ebf9">


## Tests de l'API ProductsApp

Cette partie détaille comment exécuter les tests unitaires pour l'API de l'application. Les tests sont basés sur `pytest`

### Prérequis

Avant d'exécuter les tests, assurez-vous d'avoir installé les dépendances nécessaires.



### Structure des fichiers de test

- `configtest.py` : Ce fichier configure l'application Flask pour les tests.
- `test_api.py` : Ce fichier contient les tests unitaires pour l'API des produits.

### 1. Lancer les tests

Pour exécuter tous les tests dans le répertoire `tests/`, exécutez la commande suivante depuis la racine du projet :

```bash
pytest
```

Cette commande exécutera tous les tests définis dans le dossier `tests/`.

### 2. Résultats des tests

Après l'exécution, `pytest` affichera les résultats dans le terminal, indiquant si les tests ont réussi ou échoué. Voici un exemple de sortie si tous les tests réussissent :

```
====================================== test session starts =======================================
platform win32 -- Python 3.12.4, pytest-8.3.3, pluggy-1.5.0
plugins: flask-1.3.0
collected 5 items

tests\test_api.py .....                                                                     [100%]
tests/test_api.py::test_create_product
tests/test_api.py::test_patch_product
tests/test_api.py::test_get_product_by_id
tests/test_api.py::test_delete_product

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
================================= 5 passed, 69 warnings in 0.24s ================================= 
```
<img width="544" alt="image" src="https://github.com/user-attachments/assets/ecb68aa0-d3c1-4b62-8ada-fa0b4e689fd9">


### 3. Tests spécifiques

Si vous souhaitez exécuter un seul fichier de test ou un test spécifique, utilisez l'une des commandes suivantes :

- **Exécuter un fichier de test spécifique :**

  ```bash
  pytest tests/test_api.py
  ```

- **Exécuter une fonction de test spécifique :**

  ```bash
  pytest tests/test_api.py::test_create_product
  ```
## Description des tests

Les tests couvrent les principales fonctionnalités de l'API :

- **`test_get_all_products`** : Vérifie que la récupération de tous les produits fonctionne et renvoie un statut `200 OK` avec une liste de produits.
- **`test_create_product`** : Vérifie que la création d'un produit fonctionne correctement et que l'API renvoie un statut `201 Created` avec un message de succès.
- **`test_get_product_by_id`** : Vérifie que la récupération d'un produit par son ID fonctionne et renvoie les bonnes informations.
- **`test_patch_product`** : Teste la mise à jour partielle d'un produit et s'assure que l'API retourne un message de succès.
- **`test_delete_product`** : Vérifie que la suppression d'un produit par ID fonctionne et que le produit n'est plus disponible après la suppression.

---
