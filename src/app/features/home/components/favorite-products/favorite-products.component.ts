import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../shop/components/product-card/product-card.component';
import { ProductService } from '../../../shop/data-access/product.service';
import { Product } from '../../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-products',
  standalone: true,
  imports: [
    RouterLink,
    ProductCardComponent,
    LoadingSpinnerComponent,
    CommonModule,
  ],
  templateUrl: './favorite-products.component.html',
  styleUrl: './favorite-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteProductsComponent implements OnInit {
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
      .getAll()
      .then((products) => {
        // Első 8 termék (kedvenceink szimulációja)
        this.products.set(products.slice(0, 8));
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
