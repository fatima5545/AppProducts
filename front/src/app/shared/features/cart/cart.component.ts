import { Component, inject } from "@angular/core";
import { DataViewModule } from "primeng/dataview";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { CartService } from "app/products/data-access/cart.service";
import { CommonModule } from "@angular/common";
import { Product } from "app/products/data-access/product.model";
import { RatingModule } from "primeng/rating";

/**
 * Composant représentant le panier d'achats de l'utilisateur.
 * Ce composant permet d'afficher les produits ajoutés au panier,
 * de choisir une quantité et de supprimer des produits.
 */
@Component({
  selector: "app-cart",
  standalone: true,
  imports: [
    DataViewModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    RatingModule,
  ],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.scss",
})
export class CartComponent {
  // Injection du service de gestion du panier
  private readonly cartService = inject(CartService);

  //Liste des produits présents dans le panier.
  cartProducts: Product[] = [];

  /**
   * Méthode de cycle de vie appelée après l'initialisation du composant.
   * Récupère les produits présents dans le panier depuis le service `CartService`.
   */
  ngOnInit() {
    this.cartProducts = this.cartService.getCartProducts();
  }

  // Options statiques pour le sélecteur de quantité
  quantities = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
  ];

  // Quantité sélectionnée valeur par defaut
  selectedQty = 1;

  /**
   * Méthode pour supprimer un produit du panier.
   * @param {Product} product - Le produit à supprimer du panier.
   */
  removeFromCart(product: Product) {
    this.cartService.removeProductFromCart(product.id);
  }

  /**
   * Récupère et retourne la liste des produits présents dans le panier depuis le service `CartService`.
   * @returns {Product[]} La liste des produits présents dans le panier.
   */
  getCartProducts() {
    this.cartProducts = this.cartService.getCartProducts();
    return this.cartService.getCartProducts();
  }
}
