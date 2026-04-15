import { Component, EventEmitter, Output, Input, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class ProductFilterComponent implements OnInit, OnChanges {
  @Output() filterChange = new EventEmitter<FilterOptions>();
  @Output() resetFilters = new EventEmitter<void>();
  @Input() initialFilters?: FilterOptions;

  isOpen = false;

  category = '';
  brand = '';
  priceRange = '';
  sortBy = 'newest';
  onSaleOnly = false;
  inStockOnly = false;

  private lastCategory = '';
  private lastBrand = '';
  private lastOnSaleOnly = false;

  constructor() {
    this.setInitialState();
  }

  ngOnInit(): void {
    // Beállítja az inicializáló szűrő értékeket, ha vannak
    this.updateFiltersFromInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Figyelje az initialFilters Input-ot és frissítse az értékeket
    // De csak akkor, ha ténylegesen megváltozott a kategória, márka vagy onSaleOnly
    if (changes['initialFilters'] && !changes['initialFilters'].firstChange) {
      const currentCategory = this.initialFilters?.category || '';
      const currentBrand = this.initialFilters?.brand || '';
      const currentOnSaleOnly = this.initialFilters?.onSaleOnly || false;
      
      // Csak akkor frissítünk, ha a kategória, márka vagy onSaleOnly valóban megváltozott
      if (
        currentCategory !== this.lastCategory ||
        currentBrand !== this.lastBrand ||
        currentOnSaleOnly !== this.lastOnSaleOnly
      ) {
        this.lastCategory = currentCategory;
        this.lastBrand = currentBrand;
        this.lastOnSaleOnly = currentOnSaleOnly;
        this.category = currentCategory;
        this.brand = currentBrand;
        this.onSaleOnly = currentOnSaleOnly;
      }
    }
  }

  private updateFiltersFromInput(): void {
    if (this.initialFilters) {
      this.category = this.initialFilters.category || '';
      this.brand = this.initialFilters.brand || '';
      this.priceRange = this.initialFilters.priceRange || '';
      this.sortBy = this.initialFilters.sortBy || 'newest';
      this.onSaleOnly = this.initialFilters.onSaleOnly || false;
      this.inStockOnly = this.initialFilters.inStockOnly || false;
      
      this.lastCategory = this.category;
      this.lastBrand = this.brand;
      this.lastOnSaleOnly = this.onSaleOnly;
    }
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