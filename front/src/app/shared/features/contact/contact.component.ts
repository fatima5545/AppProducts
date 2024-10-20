import { Component, inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common"; // fournira les directives come ngIf ngFor
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { EmailService } from "app/products/data-access/email.service";

/**
 * Composant de formulaire de contact pour permettre aux utilisateurs d'envoyer des messages.
 */
@Component({
  selector: "app-contact",
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    CardModule,
    CommonModule,
    ToastModule,
  ],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
  providers: [MessageService],
})
export class ContactComponent {
  // Injection du service de gestion des messages toast
  private readonly messageService = inject(MessageService);
  // Injection du service d envoir des emails
  private readonly emailService = inject(EmailService);

  //Objet utilisateur contenant les informations du formulaire
  user = {
    message: "",
    email: "",
  };

  /**
   * Affiche un message toast indiquant que le message a été envoye avec succès
   */
  showToast() {
    this.messageService.add({
      severity: "success",
      summary: "Message envoyé",
      detail: "Votre message a été envoyé avec succès.",
      key: "bl",
      life: 3000,
    });
  }

  /**
   * Vérifie les informations du formulaire d envoyer le message.
   * Affiche un message de confirmation si le formulaire est valide, sinon marque les champs invalides
   * @param {any} form - Le formulaire à vérifier.
   */
  checkForm(form: any) {
    if (form.valid) {
      this.showToast();
      console.log("Formulaire envoyé", this.user);
      this.onSend();
    } else {
      if (form.controls.email.invalid) {
        form.controls.email.markAsTouched(); // Marque le champ email comme touché pour afficher l'erreur
      }
      if (!this.user.message) {
        form.controls.message.markAsTouched();
      }
      console.log("Formulaire invalide");
    }
  }

  onSend() {
    this.emailService.sendEmail(this.user).subscribe();
  }
}
