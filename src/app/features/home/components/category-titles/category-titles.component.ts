import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-tiles',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-titles.component.html',
  styleUrl: './category-titles.component.scss',
})
export class CategoryTilesComponent {}