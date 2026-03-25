import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { ProductCardComponent } from '../../../shop/components/product-card/product-card.component';

@Component({
  selector: 'app-favorite-products',
  standalone: true,
  imports: [RouterLink,  ProductCardComponent],
  templateUrl: './favorite-products.component.html',
  styleUrl: './favorite-products.component.scss',
})
export class FavoriteProductsComponent {}
