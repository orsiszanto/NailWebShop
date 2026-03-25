import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-offers',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './featured-offers.component.html',
  styleUrl: './featured-offers.component.scss',
})
export class FeaturedOffersComponent {}