import json


def test_get_all_products(test_client):
    """Test de récupération de tous les produits depuis l'API"""
    response = test_client.get("/products/")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)  # On s'attend à une liste de produits
    assert (
        len(data) == 30
    )  # On s'attend à 30 produits initialement, car lors de la première connexion, la base de données sera remplie avec les 30 produits du fichier JSON


def test_create_product(test_client):
    """Test de création d'un nouveau produit"""
    new_product = {
        "code": "p001",
        "name": "Test Product",
        "description": "A test product",
        "image": "http://example.com/test.jpg",
        "category": "Test Category",
        "price": 100.0,
        "quantity": 10,
        "inventoryStatus": "INSTOCK",
        "rating": 4,
    }
    response = test_client.post(
        "/products/", data=json.dumps(new_product), content_type="application/json"
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert (
        data["message"] == "Product created successfully!"
    )  # Produit créé avec succès


def test_get_product_by_id(test_client):
    """Test de récupération d'un produit par son ID"""
    response = test_client.get("/products/1")
    assert response.status_code == 200
    product = json.loads(response.data)
    assert product["id"] == 1
    assert product["name"] == "Bamboo Watch"


def test_patch_product(test_client):
    """Test de modification partielle d'un produit"""
    updated_product = {"name": "Updated Product Name", "price": 120.0}
    response = test_client.patch(
        "/products/1", data=json.dumps(updated_product), content_type="application/json"
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert (
        data["message"] == "Product patched successfully!"
    )  # Produit modifié avec succès


def test_delete_product(test_client):
    """Test de suppression d'un produit par son ID"""
    response = test_client.delete("/products/1")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert (
        data["message"] == "Product deleted successfully!"
    )  # Produit supprimé avec succès

    # Vérifie que le produit n'existe plus
    response = test_client.get("/products/1")
    assert response.status_code == 404
