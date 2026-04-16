import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AddToCartComponent } from '../../components/add-to-cart/add-to-cart.component';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../data-access/product.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, AddToCartComponent, LoadingSpinnerComponent, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);

  readonly selectedImageIndex = signal(0);
  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly images = signal<Array<{ src: string; alt: string }>>([]);

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    this.loading.set(true);
    this.error.set(null);

    this.activatedRoute.params.subscribe(async (params) => {
      try {
        const productId = params['id'];
        if (!productId) {
          throw new Error('Termék ID nem található.');
        }

        const product = await this.productService.getById(productId);
        this.product.set(product);

        // Mock images (Firebase-ben szokják tárolni az URL-eket)
        this.images.set([
          {
            src: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1200&auto=format&fit=crop',
            alt: `${product.name} - fő kép`,
          },
          {
            src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1200&auto=format&fit=crop',
            alt: `${product.name} - közelebbi nézet`,
          },
          {
            src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
            alt: `${product.name} - használat közben`,
          },
          {
            src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop',
            alt: `${product.name} - csomagolás`,
          },
        ]);

        this.loading.set(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ismeretlen hiba történt';
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  formatPrice(value: number | null | undefined): string {
    if (!value) {
      return '';
    }
    return `${value.toLocaleString('hu-HU')} Ft`;
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }
}