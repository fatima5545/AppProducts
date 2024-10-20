import { Component, OnInit, effect, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { RatingModule } from "primeng/rating";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { CartService } from "app/products/data-access/cart.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

/**
 * Représente la liste des produits avec des fonctionnalités de création, mise à jour, suppression et ajout au panier.
 * Ce composant utilise `ProductsService` pour gérer les produits et `CartService` pour ajouter les produits au panier.
 */
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    RatingModule,
    FormsModule,
    CommonModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class ProductListComponent implements OnInit {
  // Injection des services nécessaires
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  // Liste complète des produits
  public products = this.productsService.products;

  // Liste filtrée des produits
  public filteredProducts: Product[] = [];

  // Visibilité du formulaire de création/mise à jour
  public isDialogVisible = false;

  //l'opération en cours est une création de produit ou non
  public isCreation = false;

  // Signal représentant le produit en cours de création ou de modification.
  public readonly editedProduct = signal<Product>(emptyProduct);

  //Liste des produits ajoutés au panier.
  cartProducts: Product[] = [];

  // Effet synchronisant la liste filtrée des produits avec les produits récupérés.
  private readonly synchronizeProductsEffect = effect(() => {
    this.filteredProducts = this.products();
  });

  /**
   * Méthode de cycle de vie appelée après l'initialisation du composant.
   * Récupère la liste initiale des produits depuis le service.
   */
  ngOnInit() {
    this.productsService.get().subscribe();
  }

  /**
   * Ouvre le formulaire pour créer un nouveau produit.
   */
  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  /**
   * Ouvre le formulaire pour mettre à jour un produit existant.
   * @param {Product} product - Le produit à mettre à jour.
   */
  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  /**
   * Supprime un produit de la liste.
   * @param {Product} product - Le produit à supprimer.
   */
  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  /**
   * Sauvegarde un produit après création ou mise à jour.
   * @param {Product} product - Le produit à sauvegarder.
   */
  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe(() => {
        this.showToast(
          "success",
          "Création réussie",
          "Le produit a été créé avec succès !"
        );
      });
    } else {
      this.showToast(
        "success",
        "Mise à jour réussie",
        "Le produit a été mis à jour avec succès !"
      );
    }
    this.closeDialog();
  }

  /**
   * Annule l'opération de création ou de mise à jour et ferme le formulaire.
   */
  public onCancel() {
    this.closeDialog();
  }

  /**
   * Ajoute un produit au panier.
   * @param {Product} product - Le produit à ajouter au panier.
   */
  public addToCart(product: Product) {
    this.cartProducts.push(product);
    this.cartService.addProductToCart({ ...product, quantity: 1 });
  }

  /**
   * Ferme le formulaire de création/màj
   */
  private closeDialog() {
    this.isDialogVisible = false;
  }

  /**
   * Filtre les produits en fonction d'une recherche globale.
   * @param {Event} event - L'événement de recherche déclenché par l'utilisateur.
   */
  public onGlobalFilter(event: any) {
    const query = event.target.value.toLowerCase();

    // Déréférencer les produits signalés en appelant this.products()
    this.filteredProducts = this.products().filter((product: Product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }

  /**
   * Affiche un toast de notification.
   * @param {string} severity - Le niveau de gravité du message (success, info, warn, error).
   * @param {string} summary - Le résumé du message.
   * @param {string} detail - Les détails du message.
   */
  private showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
      key: "bl",
      life: 3000,
    });
  }
}
