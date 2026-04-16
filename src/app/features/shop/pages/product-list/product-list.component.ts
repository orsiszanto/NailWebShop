import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  readonly isLoading = signal(false);

  // Filter state - reactive signals
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');
  readonly selectedBrand = signal('');
  readonly selectedPriceRange = signal('');
  readonly selectedSortBy = signal('newest');
  readonly onSaleOnly = signal(false);
  readonly inStockOnly = signal(false);

  readonly products: ProductListItem[] = [
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

  // Computed filtered products
  readonly filteredProducts = computed(() => {
    let filtered = [...this.products];

    const search = this.searchTerm().trim();
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    const category = this.selectedCategory();
    if (category) {
      filtered = filtered.filter(
        (product) => product.category === category
      );
    }

    const brand = this.selectedBrand();
    if (brand) {
      filtered = filtered.filter(
        (product) => product.brand === brand
      );
    }

    const priceRange = this.selectedPriceRange();
    if (priceRange) {
      filtered = filtered.filter((product) => {
        switch (priceRange) {
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

    if (this.onSaleOnly()) {
      filtered = filtered.filter((product) => product.oldPrice !== null);
    }

    if (this.inStockOnly()) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sort
    const sortBy = this.selectedSortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
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
  });

  readonly hasResults = computed(() => this.filteredProducts().length > 0);

  readonly currentFilters = computed(() => ({
    category: this.selectedCategory(),
    brand: this.selectedBrand(),
    priceRange: this.selectedPriceRange(),
    sortBy: this.selectedSortBy(),
    onSaleOnly: this.onSaleOnly(),
    inStockOnly: this.inStockOnly(),
  }));

  ngOnInit(): void {
    // Olvassa be a query paramétereket a headerből
    this.activatedRoute.queryParams.subscribe((params) => {
      const category = params['category'];
      const brand = params['brand'];
      const onSaleOnly = params['onSaleOnly'] === 'true';
      
      if (category || brand || onSaleOnly) {
        this.onFilterChange({
          category: category || '',
          brand: brand || '',
          priceRange: '',
          sortBy: 'newest',
          onSaleOnly: onSaleOnly,
          inStockOnly: false,
        });
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onFilterChange(options: FilterOptions): void {
    this.selectedCategory.set(options.category || '');
    this.selectedBrand.set(options.brand || '');
    this.selectedPriceRange.set(options.priceRange || '');
    this.selectedSortBy.set(options.sortBy);
    this.onSaleOnly.set(options.onSaleOnly);
    this.inStockOnly.set(options.inStockOnly);
  }

  onResetFilters(): void {
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.selectedPriceRange.set('');
    this.selectedSortBy.set('newest');
    this.onSaleOnly.set(false);
    this.inStockOnly.set(false);
  }
}