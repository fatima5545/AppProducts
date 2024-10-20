import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

/**
 * Service permettant de gérer l'envoi d'e-mails via des requêtes HTTP.
 * Ce service fournit des méthodes pour envoyer des e-mails.
 */
@Injectable({
  providedIn: "root",
})
export class EmailService {
  // Injection du service HttpClient pour gérer les requêtes HTTP
  private readonly http = inject(HttpClient);

  // URL de l'API backend
  private readonly path = "http://localhost:5000/email/send-email"; // URL de l'API backend

  /**
   * Envoie un email via une requête POST.
   * @param emailData - L'objet contenant les données de l'email à envoyer.
   * @returns {Observable<boolean>} Un observable indiquant si l'envoi de l'email a réussi ou échoué.
   */
  public sendEmail(emailData: {
    email: string;
    message: string;
  }): Observable<boolean> {
    return this.http.post<boolean>(this.path, emailData).pipe(
      tap(() => {
        console.log("Email envoyé avec succès !");
      }),
      catchError((error) => {
        console.error("Erreur lors de l'envoi de l'email :", error);
        return of(false); // Retourne "false" en cas d'erreur
      })
    );
  }
}
