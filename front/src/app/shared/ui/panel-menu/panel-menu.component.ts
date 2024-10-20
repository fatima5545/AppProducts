import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from "primeng/panelmenu";
import { BadgeModule } from "primeng/badge";
import { RippleModule } from "primeng/ripple";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-panel-menu",
  standalone: true,
  imports: [PanelMenuModule, BadgeModule, RippleModule, CommonModule],
  styleUrls: ["./panel-menu.component.scss"],
  template: `
    <p-panelMenu [model]="items" styleClass="w-full">
      <ng-template pTemplate="item" let-item>
        <a pRipple class="flex align-items-center px-3 py-2 cursor-pointer">
        </a>
      </ng-template>
    </p-panelMenu>
  `,
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
