import { Component, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [NgIf, ProductSearchComponent],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss'
})
export class ProductFilterComponent {

  isOpen = false;

  constructor() {
    this.setInitialState();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('window:resize')
  onResize() {
    this.setInitialState();
  }

  private setInitialState() {
    this.isOpen = window.innerWidth >= 1024; // desktop: open
  }
}