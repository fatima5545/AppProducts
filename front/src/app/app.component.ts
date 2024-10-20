import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ToolbarModule } from "primeng/toolbar";
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { CommonModule } from "@angular/common";
import { CartService } from "./products/data-access/cart.service";
import { CartComponent } from "./shared/features/cart/cart.component";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    RouterModule,
    SplitterModule,
    ToolbarModule,
    PanelMenuComponent,
    CartComponent,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
  ],
})
export class AppComponent {
  private readonly cartService = inject(CartService);
  title = "ALTEN SHOP";
  public isDialogVisible = false;

  public goToCart() {
    this.isDialogVisible = true;
  }

  public onCancel() {
    this.isDialogVisible = false;
  }

  getCartQuantity(): number {
    return this.cartService.getCartQuantity();
  }
}
