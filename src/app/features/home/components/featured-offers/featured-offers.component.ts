import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../shop/components/product-card/product-card.component';

@Component({
  selector: 'app-featured-offers',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './featured-offers.component.html',
  styleUrl: './featured-offers.component.scss',
})
export class FeaturedOffersComponent {}