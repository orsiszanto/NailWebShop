import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-favorite-products',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorite-products.component.html',
  styleUrl: './favorite-products.component.scss',
})
export class FavoriteProductsComponent {}
