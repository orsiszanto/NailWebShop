import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private authStore = inject(AuthStore);

  // Public selectors from auth store
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly user = this.authStore.user;
  readonly loading = this.authStore.loading;

  logout(): void {
    this.authStore.logout();
  }
}
