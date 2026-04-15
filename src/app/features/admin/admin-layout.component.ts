import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { signal, computed } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-container">
      <aside class="admin-sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="admin-logo">
          <h1>Admin</h1>
        </div>
        <nav class="admin-nav">
          <ul>
            <li>
              <a 
                routerLink="/admin/dashboard" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link"
                (click)="closeSidebar()">
                <span class="icon">📊</span>
                <span class="label">Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/products" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link"
                (click)="closeSidebar()">
                <span class="icon">📦</span>
                <span class="label">Termékkezelés</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/categories" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link"
                (click)="closeSidebar()">
                <span class="icon">📁</span>
                <span class="label">Kategóriák</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/admin/orders" 
                routerLinkActive="active" 
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link"
                (click)="closeSidebar()">
                <span class="icon">📋</span>
                <span class="label">Rendelések</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Footer logout section -->
        <div class="admin-footer">
          <div class="user-info">
            <span class="user-email">{{ authStore.user()?.email }}</span>
            <button class="btn-logout" (click)="logout()" title="Kijelentkezés">
              🚪 Kilépés
            </button>
          </div>
        </div>
      </aside>

      <main class="admin-content">
        <div class="admin-header">
          <button class="toggle-sidebar" (click)="toggleSidebar()" title="Menü">☰</button>
          <h2>{{ pageTitle() }}</h2>
          <div class="header-spacer"></div>
        </div>
        <div class="admin-main">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
      }

      .admin-container {
        display: flex;
        height: 100%;
        background: #f5f7fa;
      }

      .admin-sidebar {
        width: 280px;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: white;
        padding: 2rem 0;
        overflow-y: auto;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        transition: width 0.3s ease, margin-left 0.3s ease;
        display: flex;
        flex-direction: column;

        @media (max-width: 768px) {
          position: fixed;
          height: 100%;
          z-index: 100;
          left: 0;
          top: 0;
          margin-left: -280px;

          &.collapsed {
            margin-left: 0;
            box-shadow: 8px 0 16px rgba(0, 0, 0, 0.3);
          }
        }
      }

      .admin-logo {
        padding: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 2rem;
        flex-shrink: 0;

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
      }

      .admin-nav {
        flex: 1;
        overflow-y: auto;

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            margin: 0;
          }
        }
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border-left-color: #3b82f6;
        }

        &.active {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          border-left-color: #3b82f6;
          font-weight: 600;
        }

        .icon {
          font-size: 1.25rem;
          width: 1.5rem;
          text-align: center;
          flex-shrink: 0;
        }

        .label {
          flex: 1;
        }
      }

      .admin-footer {
        padding: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        flex-shrink: 0;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .user-email {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.6);
        word-break: break-word;
      }

      .btn-logout {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #fca5a5;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;

        &:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          color: #fecaca;
        }
      }

      .admin-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .admin-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
          font-weight: 600;
        }
      }

      .header-spacer {
        flex: 1;
      }

      .toggle-sidebar {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #1e293b;
        padding: 0.5rem;

        &:hover {
          background: #f1f5f9;
          border-radius: 6px;
        }

        @media (max-width: 768px) {
          display: block;
        }
      }

      .admin-main {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;

        @media (max-width: 768px) {
          padding: 1rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  authStore = inject(AuthStore);
  private router = inject(Router);
  
  sidebarCollapsed = signal(false);
  currentRoute = signal('Dashboard');

  pageTitle = computed(() => {
    const route = this.currentRoute();
    return `Admin - ${route}`;
  });

  constructor() {
    // Dinamikus page title a route alapján
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        const url = navEvent.url;

        if (url.includes('/admin/dashboard')) {
          this.currentRoute.set('Dashboard');
        } else if (url.includes('/admin/products')) {
          this.currentRoute.set('Termékkezelés');
        } else if (url.includes('/admin/categories')) {
          this.currentRoute.set('Kategóriák');
        } else if (url.includes('/admin/orders')) {
          this.currentRoute.set('Rendelések');
        }
      });
  }

  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }

  closeSidebar() {
    // Mobilon bezárjuk a sidebars navigáció után
    if (window.innerWidth <= 768) {
      this.sidebarCollapsed.set(false);
    }
  }

  logout() {
    this.authStore.logout();
  }
}
