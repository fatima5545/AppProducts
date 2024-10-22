import sys
import os
import pytest

# Ajouter le répertoire parent de 'app' au chemin système (sys.path)
# Cela permet d'importer correctement le module 'app' pour les tests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Importation de l'application Flask et de l'extension SQLAlchemy (db) depuis le module 'app'
from app import create_app, db


@pytest.fixture(scope="module")
def test_client():
    # Création de l'application Flask configuré pour les tests
    flask_app = create_app()

    # Établissement du contexte d'application pour interagir avec la base de données
    with flask_app.app_context():
        db.create_all()  # Création des tables de la base de données pour les tests

        # Création d'un client de test Flask pour simuler les requêtes HTTP
        testing_client = flask_app.test_client()

        # 'yield' permet de retourner le client de test et d'exécuter les tests
        yield testing_client

        # Nettoyage après les tests càd suppression des sessions de base de données
        db.session.remove()
        # Suppression de la table
        db.drop_all()
