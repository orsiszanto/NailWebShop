import { Component } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import {
  ProductFilterComponent,
  FilterOptions,
} from '../../components/product-filter/product-filter.component';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

type ProductListItem = {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  imageAlt: string;
  category: string;
  brand: string;
  inStock: boolean;
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductCardComponent,
    ProductFilterComponent,
    ProductSearchComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  isLoading = false;

  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  selectedPriceRange = '';
  selectedSortBy = 'newest';
  onSaleOnly = false;
  inStockOnly = false;

  products: ProductListItem[] = [
    {
      id: '1',
      name: 'Crystal Nails Compact Base Gel',
      price: 3990,
      oldPrice: null,
      imageAlt: 'Crystal Nails Compact Base Gel termék képe',
      category: 'alapanyagok',
      brand: 'crystal-nails',
      inStock: true,
    },
    {
      id: '2',
      name: 'Moyra Gel Polish Nude Pink',
      price: 2490,
      oldPrice: 2990,
      imageAlt: 'Moyra Gel Polish Nude Pink termék képe',
      category: 'lakkok',
      brand: 'moyra',
      inStock: true,
    },
    {
      id: '3',
      name: 'Perfect Nails Primer',
      price: 1890,
      oldPrice: null,
      imageAlt: 'Perfect Nails Primer termék képe',
      category: 'alapanyagok',
      brand: 'indigo',
      inStock: true,
    },
    {
      id: '4',
      name: 'Cover Pink Builder Gel',
      price: 4590,
      oldPrice: null,
      imageAlt: 'Cover Pink Builder Gel termék képe',
      category: 'alapanyagok',
      brand: 'crystal-nails',
      inStock: true,
    },
    {
      id: '5',
      name: 'Top Shine No Wipe',
      price: 2790,
      oldPrice: null,
      imageAlt: 'Top Shine No Wipe termék képe',
      category: 'alapanyagok',
      brand: 'moyra',
      inStock: true,
    },
    {
      id: '6',
      name: 'Nail Prep folyadék',
      price: 1590,
      oldPrice: null,
      imageAlt: 'Nail Prep folyadék termék képe',
      category: 'alapanyagok',
      brand: 'indigo',
      inStock: false,
    },
    {
      id: '7',
      name: 'Gél lakk Bordeaux Red',
      price: 2690,
      oldPrice: 2990,
      imageAlt: 'Gél lakk Bordeaux Red termék képe',
      category: 'lakkok',
      brand: 'moyra',
      inStock: true,
    },
    {
      id: '8',
      name: 'Matt Top Gel',
      price: 2590,
      oldPrice: null,
      imageAlt: 'Matt Top Gel termék képe',
      category: 'alapanyagok',
      brand: 'crystal-nails',
      inStock: true,
    },
    {
      id: '9',
      name: 'Reszelő 100/180',
      price: 390,
      oldPrice: null,
      imageAlt: 'Reszelő 100/180 termék képe',
      category: 'eszkozok',
      brand: 'indigo',
      inStock: true,
    },
    {
      id: '10',
      name: 'Cuticle Oil Cherry',
      price: 1290,
      oldPrice: null,
      imageAlt: 'Cuticle Oil Cherry termék képe',
      category: 'alapanyagok',
      brand: 'crystal-nails',
      inStock: true,
    },
    {
      id: '11',
      name: 'Akril ecset',
      price: 2190,
      oldPrice: null,
      imageAlt: 'Akril ecset termék képe',
      category: 'eszkozok',
      brand: 'indigo',
      inStock: false,
    },
    {
      id: '12',
      name: 'Díszítő ecset vékony',
      price: 1490,
      oldPrice: null,
      imageAlt: 'Díszítő ecset vékony termék képe',
      category: 'diszitok',
      brand: 'moyra',
      inStock: true,
    },
  ];

  onSearch(term: string): void {
    this.searchTerm = term;
  }

  onFilterChange(options: FilterOptions): void {
    this.selectedCategory = options.category || '';
    this.selectedBrand = options.brand || '';
    this.selectedPriceRange = options.priceRange || '';
    this.selectedSortBy = options.sortBy;
    this.onSaleOnly = options.onSaleOnly;
    this.inStockOnly = options.inStockOnly;
  }

  onResetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedPriceRange = '';
    this.selectedSortBy = 'newest';
    this.onSaleOnly = false;
    this.inStockOnly = false;
  }

  get filteredProducts(): ProductListItem[] {
    let filtered = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    if (this.selectedBrand) {
      filtered = filtered.filter(
        (product) => product.brand === this.selectedBrand
      );
    }

    if (this.selectedPriceRange) {
      filtered = filtered.filter((product) => {
        switch (this.selectedPriceRange) {
          case '0-3000':
            return product.price >= 0 && product.price <= 3000;
          case '3000-6000':
            return product.price > 3000 && product.price <= 6000;
          case '6000+':
            return product.price > 6000;
          default:
            return true;
        }
      });
    }

    if (this.onSaleOnly) {
      filtered = filtered.filter((product) => product.oldPrice !== null);
    }

    if (this.inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    filtered.sort((a, b) => {
      switch (this.selectedSortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name, 'hu');
        case 'popular':
          return a.name.localeCompare(b.name, 'hu');
        case 'newest':
        default:
          return Number(b.id) - Number(a.id);
      }
    });

    return filtered;
  }

  get hasResults(): boolean {
    return this.filteredProducts.length > 0;
  }
}