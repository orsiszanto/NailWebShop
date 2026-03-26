import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  category?: string;
  brand?: string;
  priceRange?: string;
  sortBy: string;
  onSaleOnly: boolean;
  inStockOnly: boolean;
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
})
export class ProductFilterComponent {
  @Output() filterChange = new EventEmitter<FilterOptions>();
  @Output() resetFilters = new EventEmitter<void>();

  isOpen = false;

  category = '';
  brand = '';
  priceRange = '';
  sortBy = 'newest';
  onSaleOnly = false;
  inStockOnly = false;

  constructor() {
    this.setInitialState();
  }

  toggle(): void {
    if (window.innerWidth < 1024) {
      this.isOpen = !this.isOpen;
    }
  }

  applyFilters(): void {
    this.filterChange.emit({
      category: this.category,
      brand: this.brand,
      priceRange: this.priceRange,
      sortBy: this.sortBy,
      onSaleOnly: this.onSaleOnly,
      inStockOnly: this.inStockOnly,
    });
  }

  clearFilters(): void {
    this.category = '';
    this.brand = '';
    this.priceRange = '';
    this.sortBy = 'newest';
    this.onSaleOnly = false;
    this.inStockOnly = false;

    this.resetFilters.emit();
    this.applyFilters();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setInitialState();
  }

  private setInitialState(): void {
    this.isOpen = window.innerWidth >= 1024;
  }
}