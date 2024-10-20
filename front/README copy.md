# ProductsApp Frontend

Bienvenue dans la partie **frontend** de l'application **ProductsApp**. Cette partie est développée en utilisant **Angular** et consomme les services REST fournis par le backend Flask.

## Prérequis

- **Node.js** (version 14+ recommandée) : Assurez-vous que Node.js est installé sur votre machine. Vous pouvez le télécharger [ici](https://nodejs.org/).
- **Angular CLI** (version 12+) : Si ce n'est pas déjà fait, installez l'interface en ligne de commande Angular globalement sur votre système :

  ```bash
  npm install -g @angular/cli
  ```

## Installation

1. **Clonez le dépôt** (si ce n'est pas déjà fait) :

   ```bash
   git clone <lien-du-repository>
   cd front
   ```

2. **Installez les dépendances** :

   ```bash
   npm install
   ```

## Démarrage de l'application

Pour démarrer l'application Angular en mode de développement, exécutez la commande suivante :

```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200/`.

## Fonctionnalités principales

- **Affichage des produits** : Voir la liste des produits disponibles.
- **Ajout au panier** : Ajouter des produits au panier.
- **Envoi de mail via un formulaire**
