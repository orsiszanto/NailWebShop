import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../shop/components/product-card/product-card.component';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [RouterLink,
    ProductCardComponent
  ],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.scss',
})
export class NewArrivalsComponent {}