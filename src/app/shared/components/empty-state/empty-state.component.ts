import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  title = input<string>('Nincs találat');
  description = input<string>('Jelenleg nincs megjeleníthető tartalom.');
  actionLabel = input<string>('Vissza a főoldalra');
  actionLink = input<string>('/');
}