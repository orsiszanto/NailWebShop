import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  name = input<string>('Termék neve');
  price = input<string>('3 990 Ft');
  oldPrice = input<string | null>(null);
  imageAlt = input<string>('Termék képe');
}