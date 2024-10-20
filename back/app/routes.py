from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_restx import Api, Resource, fields
from .models import Product
from .extensions import db
import smtplib
from email.mime.text import MIMEText
from utils.send_grid_email import envoyer_email_sendgrid
from dotenv import load_dotenv
import os

# Création d'un Blueprint pour le module principal de l'application.
main = Blueprint("main", __name__)

# Initialisation de l'API avec Flask-RESTx, définition des détails pour Swagger.
api = Api(
    main,
    version="1.0",
    title="Product API",
    description="A simple Product API",
    doc="/swagger",
)  # URL pour l'accès à la documentation Swagger

# Définition de la structure du modèle Swagger pour les produits
product_model = api.model(
    "Product",
    {
        "id": fields.Integer(readOnly=True, description="The unique ID of a product"),
        "code": fields.String(required=True, description="Product code"),
        "name": fields.String(required=True, description="Product name"),
        "description": fields.String(description="Product description"),
        "image": fields.String(description="Product image URL"),
        "category": fields.String(description="Product category"),
        "price": fields.Float(required=True, description="Product price"),
        "quantity": fields.Integer(required=True, description="Product quantity"),
        "internal_reference": fields.String(description="Internal reference code"),
        "shell_id": fields.Integer(description="Shell ID"),
        "inventory_status": fields.String(
            required=True, description="Inventory status"
        ),
        "rating": fields.Integer(description="Product rating"),
    },
)

# Définition de la structure du modèle Swagger pour l'envoi d'email
email_model = api.model(
    "Email",
    {
        "email": fields.String(required=True, description="Email"),
        "message": fields.String(required=True, description="Message"),
    },
)

# Création d'un namespace pour les opérations liées aux produits
ns_p = api.namespace("products", description="Product operations")
# Création d'un namespace pour l'envoi d'emails
ns_email = api.namespace("email", description="Send Email")


@ns_p.route("/")
class ProductList(Resource):
    @ns_p.marshal_list_with(product_model)
    def get(self):
        """Récupérer tous les produits"""
        products = Product.query.all()
        return products

    @ns_p.expect(product_model)
    @ns_p.response(201, "Product successfully created.")
    def post(self):
        """Créer un nouveau produit"""
        data = api.payload
        # Création d'une nouvelle instance de Product avec les données fournies
        new_product = Product(
            code=data["code"],
            name=data["name"],
            description=data["description"],
            image=data["image"],
            category=data["category"],
            price=data["price"],
            quantity=data["quantity"],
            internal_reference=data.get("internalReference"),
            shell_id=data.get("shellId"),
            inventory_status=data["inventoryStatus"],
            rating=data.get("rating", 0),
        )
        # Ajout et enregistrement dans la base de données
        db.session.add(new_product)
        db.session.commit()
        return {"message": "Product created successfully!"}, 201

    @ns_p.response(200, "All products successfully deleted.")
    def delete(self):
        """Supprimer tous les produits"""
        Product.query.delete()
        db.session.commit()
        return {"message": "All products deleted successfully!"}, 200


@ns_p.route("/<int:id>")
@ns_p.response(404, "Product not found")
@ns_p.param("id", "The product ID")
class ProductDetail(Resource):
    @ns_p.marshal_with(product_model)
    def get(self, id):
        """Récupérer un produit donné par son ID"""
        product = Product.query.get_or_404(id)
        return product

    @ns_p.expect(product_model)
    @ns_p.response(200, "Product successfully patched.")
    def patch(self, id):
        """Mettre à jour partiellement un produit donné par son ID"""
        product = Product.query.get_or_404(id)
        data = api.payload

        # Mise à jour partielle des champs uniquement si présents dans les données
        if "code" in data:
            product.code = data["code"]
        if "name" in data:
            product.name = data["name"]
        if "description" in data:
            product.description = data["description"]
        if "image" in data:
            product.image = data["image"]
        if "category" in data:
            product.category = data["category"]
        if "price" in data:
            product.price = data["price"]
        if "quantity" in data:
            product.quantity = data["quantity"]
        if "internal_reference" in data:
            product.internal_reference = data["internal_reference"]
        if "shell_id" in data:
            product.shell_id = data["shell_id"]
        if "inventory_status" in data:
            product.inventory_status = data["inventory_status"]
        if "rating" in data:
            product.rating = data["rating"]

        # Enregistrement des modifications dans la base de données
        db.session.commit()
        return {"message": "Product patched successfully!"}, 200

    @ns_p.response(200, "Product successfully deleted.")
    def delete(self, id):
        """Supprimer un produit donné par son ID"""
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
        return {"message": "Product deleted successfully!"}, 200


@ns_email.route("/send-email")
@ns_email.response(404, "Email not sent")
class SendEmail(Resource):
    @ns_email.expect(email_model)
    @ns_email.response(201, "Email successfully sent")
    def post(self):
        """
        Route pour envoyer un email via SendGrid.
        Les données de l'email sont fournies dans le corps de la requête.
        """
        data = request.json
        recipient = data["email"]
        message_content = data["message"]

        try:
            # Charger les variables d'environnement depuis le fichier .env
            load_dotenv()
            # Obtenez la clé API depuis les variables d'environnement
            sender_email = os.getenv('SENDGRID_SENDER_EMAIL') # Adresse expéditeur           
            recipient_email = recipient
            subject = "Contact Products"
            message_body = message_content

            # Envoi de l'email en utilisant SendGrid
            envoyer_email_sendgrid(sender_email, recipient_email, subject, message_body)

            return {"message": "Message sent successfully!"}, 200

        except Exception as e:
            return {"error": f"Failed to send message: {str(e)}"}, 500
