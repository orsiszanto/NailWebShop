import { Component, HostListener, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <button
        type="button"
        class="scroll-to-top"
        (click)="scrollToTop()"
        aria-label="Görgetés az oldal tetejére"
        title="Vissza az oldal tetejére">
        ▲
      </button>
    }
  `,
  styleUrl: './scroll-to-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopComponent implements OnInit {
  protected readonly isVisible = signal(false);
  private scrollThreshold = 300;

  ngOnInit(): void {
    // Initial check
    this.checkScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    const isScrolled = window.scrollY > this.scrollThreshold;
    this.isVisible.set(isScrolled);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
