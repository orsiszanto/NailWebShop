import { Component } from '@angular/core';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-product-filter',
  imports: [ProductSearchComponent],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss'
})
export class ProductFilterComponent {}