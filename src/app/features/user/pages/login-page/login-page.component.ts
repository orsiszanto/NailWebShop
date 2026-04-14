import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth-store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);

  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Public selectors from auth store
  readonly loading = this.authStore.loading;
  readonly error = this.authStore.error;

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.value;

    try {
      await this.authStore.login(email, password);
    } catch (err) {
      // Hiba kezelése az AuthStore-ban - nincs extra tennivaló itt
      console.error('Bejelentkezés hiba:', err);
    }
  }

  // Getter az email control hibaüzenetéhez
  get emailError(): string | null {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'Az email cím kötelező.';
    }
    if (control?.hasError('email')) {
      return 'Érvénytelen email cím.';
    }
    return null;
  }

  // Getter a jelszó control hibaüzenetéhez
  get passwordError(): string | null {
    const control = this.form.get('password');
    if (control?.hasError('required')) {
      return 'A jelszó kötelező.';
    }
    if (control?.hasError('minlength')) {
      return 'A jelszó legalább 6 karakter hosszú kell hogy legyen.';
    }
    return null;
  }
}
