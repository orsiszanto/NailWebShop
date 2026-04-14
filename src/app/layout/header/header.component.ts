import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchInputComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private authStore = inject(AuthStore);

  // Public selectors from auth store
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly user = this.authStore.user;
  readonly loading = this.authStore.loading;

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout(): void {
    this.authStore.logout();
    this.closeMenu();
  }
}
