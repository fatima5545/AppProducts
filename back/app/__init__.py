import os
import json
from flask import Flask
from .extensions import db
from .models import Product
from flask_cors import CORS
from datetime import datetime
from .routes import main


def create_app():
    """
    Crée et configure l'application Flask.

    Cette fonction configure l'application Flask, initialise la base de données,
    et charge les données initiales si la base de données est vide.

    Retourne:
        app (Flask): L'application Flask configurée.
    """

    app = Flask(__name__)

    # Autoriser les requêtes provenant de l'origine spécifiée (ici, pour le front-end sur localhost:4200)
    CORS(app, origins=["http://localhost:4200"])
    app.register_blueprint(main)

    # Configuration de la base de données SQLite
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///products.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialisation de l'extension SQLAlchemy avec l'application Flask
    db.init_app(app)

    # Création des tables si elles n'existent pas
    with app.app_context():
        db.create_all()

        # Vérifier si la base de données est vide
        if not Product.query.first():
            print(
                "La base de données est vide. Remplissage avec les données initiales."
            )
            load_products_from_json()

    return app


def load_products_from_json():
    """
    Charge les produits à partir d'un fichier JSON et les insère dans la base de données.

    Cette fonction lit un fichier JSON contenant une liste de produits, convertit les données
    en objets Product, et les insère dans la base de données.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, "../assets/products.json")

    # Charger les données du fichier JSON
    if os.path.exists(json_path):
        with open(json_path, "r") as f:
            products_data = json.load(f)

        # Ajouter les produits à la base de données
        for product_data in products_data:
            # Convertir les timestamps en objets datetime
            created_at = datetime.utcfromtimestamp(product_data["createdAt"] / 1000.0)
            updated_at = datetime.utcfromtimestamp(product_data["updatedAt"] / 1000.0)
            product = Product(
                code=product_data["code"],
                name=product_data["name"],
                description=product_data.get("description"),
                image=product_data.get("image"),
                category=product_data.get("category"),
                price=product_data["price"],
                quantity=product_data["quantity"],
                internal_reference=product_data.get("internalReference"),
                shell_id=product_data.get("shellId"),
                inventory_status=product_data.get("inventoryStatus"),
                rating=product_data.get("rating"),
                created_at=created_at,
                updated_at=updated_at,
            )
            db.session.add(product)
        db.session.commit()
        print("Données initiales insérées avec succès.")
    else:
        print("Fichier products.json introuvable.")
