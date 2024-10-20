import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

/**
 * Service permettant de gérer les produits via des requêtes HTTP et de maintenir un état local à l'aide de signaux.
 * Ce service fournit des méthodes pour obtenir, créer, mettre à jour et supprimer des produits.
 */
@Injectable({
  providedIn: "root",
})
export class ProductsService {
  // Injection du service HttpClient pour gérer les requêtes HTTP
  private readonly http = inject(HttpClient);

  // URL du backend
  private readonly path = "http://localhost:5000/products"; // url du backend

  // Signal privé stockant la liste des produits
  private readonly _products = signal<Product[]>([]);

  /**Signal en lecture seule pour accéder à la liste des produits. */
  public readonly products = this._products.asReadonly();

  /**
   * Récupère la liste des produits
   * @returns {Observable<Product[]>} Un observable contenant la liste des produits ou un tableau vide en cas d'erreur.
   */
  public get(): Observable<Product[]> {
    return this.http.get<Product[]>(this.path).pipe(
      tap((products) => {
        // Mettre à jour le signal avec les produits reçus
        this._products.set(products);
      }),
      catchError((error) => {
        console.error("Erreur lors de la récupération des produits", error);
        return of([]); // tab vide en cas d'erreur
      })
    );
  }

  /**
   * Crée un nouveau produit
   * @param {Product} product - Le produit à créer.
   * @returns {Observable<boolean>} Un observable indiquant si la création a réussi.
   */
  public create(product: Product): Observable<boolean> {
    return this.http.post<boolean>(`${this.path}/`, product).pipe(
      catchError(() => {
        return of(true);
      }),
      tap(() => this._products.update((products) => [product, ...products]))
    );
  }

  /**
   * Met à jour un produit existant
   * @param {Product} product - Le produit à mettre à jour.
   * @returns {Observable<boolean>} Un observable indiquant si la mise à jour a réussi.
   */
  public update(product: Product): Observable<boolean> {
    return this.http.patch<boolean>(`${this.path}/${product.id}`, product).pipe(
      catchError(() => {
        return of(true);
      }),
      tap(() =>
        this._products.update((products) => {
          return products.map((p) => (p.id === product.id ? product : p));
        })
      )
    );
  }

  /**
   * Supprime un produit
   * @param {number} productId - L'id du produit à supprimer.
   * @returns {Observable<boolean>} Un observable indiquant si la suppression a réussi.
   */
  public delete(productId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
      catchError(() => {
        return of(true);
      }),
      tap(() =>
        this._products.update((products) =>
          products.filter((product) => product.id !== productId)
        )
      )
    );
  }
}
