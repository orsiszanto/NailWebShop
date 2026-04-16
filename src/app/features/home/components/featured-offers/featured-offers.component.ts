import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../shop/components/product-card/product-card.component';
import { ProductService } from '../../../shop/data-access/product.service';
import { Product } from '../../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-offers',
  standalone: true,
  imports: [
    RouterLink,
    ProductCardComponent,
    LoadingSpinnerComponent,
    CommonModule,
  ],
  templateUrl: './featured-offers.component.html',
  styleUrl: './featured-offers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedOffersComponent implements OnInit {
  private productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getOnSale()
      .then((products) => {
        // Első 4 akciós termék
        this.products.set(products.slice(0, 4));
        this.loading.set(false);
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Ismeretlen hiba történt';
        this.error.set(errorMessage);
        this.loading.set(false);
      });
  }
}