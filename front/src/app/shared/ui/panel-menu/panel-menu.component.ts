import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from "primeng/panelmenu";
import { BadgeModule } from "primeng/badge";
import { RippleModule } from "primeng/ripple";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-panel-menu",
  templateUrl: "./panel-menu.component.html",
  styleUrls: ["./panel-menu.component.scss"],
  standalone: true,
  imports: [PanelMenuModule, BadgeModule, RippleModule, CommonModule],
})
export class PanelMenuComponent {
  public readonly items: MenuItem[] = [
    {
      label: "Accueil",
      icon: "pi pi-home",
      routerLink: ["/home"],
    },
    {
      label: "Produits",
      icon: "pi pi-barcode",
      routerLink: ["/products/list"],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      routerLink: ["/contact"],
    },
  ];
}
