import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddToCartComponent } from '../../components/add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, AddToCartComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  selectedImageIndex = 0;

  product = {
    id: '1',
    name: 'Nude Pink Gél Lakk',
    price: 3990,
    oldPrice: 4990,
    imageAlt: 'Crystal Nails nude pink gél lakk fő kép',
    brand: 'Crystal Nails',
    category: 'Gél lakk',
    size: '8 ml',
    color: 'Nude pink',
    inStockLabel: 'Készleten',
  };

  images = [
    {
      src: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1200&auto=format&fit=crop',
      alt: 'Crystal Nails nude pink gél lakk fő kép',
    },
    {
      src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1200&auto=format&fit=crop',
      alt: 'Crystal Nails nude pink gél lakk közelebbi nézet',
    },
    {
      src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      alt: 'Crystal Nails nude pink gél lakk használat közben',
    },
    {
      src: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop',
      alt: 'Crystal Nails nude pink gél lakk csomagolás',
    },
  ];

  formatPrice(value: number): string {
    return `${value.toLocaleString('hu-HU')} Ft`;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
}