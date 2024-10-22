import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from "./product.model";

/**
 * Service permettant de gérer l'état du panier de l'utilisateur.
 * Ce service utilise un `BehaviorSubject` pour suivre les produits ajoutés au panier,
 * et fournir un flux observable pour notifier les composants abonnés des changements.
 */
@Injectable({
  providedIn: "root",
})
export class CartService {
  // Stocker les produitts dans un BehaviorSubject pour permettre aux autres composants de s'abonner aux changements
  private cartProductsSubject = new BehaviorSubject<Product[]>([]);
  cartProducts$ = this.cartProductsSubject.asObservable();

  /**
   * Récupérer les produits actuels du panier
   * @returns {Product[]} La liste des produits actuellement présents dans le panier.
   */
  getCartProducts(): Product[] {
    return this.cartProductsSubject.value;
  }

  /**
   * Ajoute un produit au panier. Si le produit est déjà présent, la quantité est augmentée
   * @param {Product} product - Le produit à ajouter ou à mettre à jour dans le panier.
   */ addProductToCart(product: Product) {
    const currentProducts = this.getCartProducts();

    // Vérifier si le produit existe déjà dans le panier
    const existingProduct = currentProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      // Si le produit existe, augmenter la quantité
      existingProduct.addedQuantity += 1;
    } else {
      // Sinon, ajouter le produit au panier
      currentProducts.push({ ...product, addedQuantity: 1 }); // Faire une copie du produit pour éviter les modifications par référence
    }

    // Mettre à jour le BehaviorSubject
    this.cartProductsSubject.next([...currentProducts]);
  }

  /**
   * Récupérer la quantité totale des produits dans le panier
   * @returns {number} Le nombre total de produits dans le panier.
   */ getCartQuantity(): number {
    return this.getCartProducts().length;
  }

  /**
   * Supprime un produit du panier par son ID
   * @param {number} productId - L'ID du produit à supprimer du panier.
   */ removeProductFromCart(productId: number) {
    const currentProducts = this.getCartProducts();
    // Filtrer les produits en retirant celui avec l'ID correspondant
    const updatedProducts = currentProducts.filter((p) => p.id !== productId);
    this.cartProductsSubject.next(updatedProducts);
  }
}
