import { Component } from '@angular/core';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { CategoryTilesComponent } from './components/category-titles/category-titles.component';
import { FavoriteProductsComponent } from './components/favorite-products/favorite-products.component';
import { BrandStripComponent } from './components/brand-strip/brand-strip.component';
import { UspSectionComponent } from './components/usp-section/usp-section.component';
import { NewsletterSignupComponent } from './components/newsletter-signup/newsletter-signup.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroBannerComponent, 
            CategoryTilesComponent,
            FavoriteProductsComponent,
            BrandStripComponent,
            UspSectionComponent,
            NewsletterSignupComponent,
        ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}