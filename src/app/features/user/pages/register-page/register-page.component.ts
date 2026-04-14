import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth-store';

// Custom validator: jelszavak egyezése
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const password = group.get('password');
  const passwordConfirm = group.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  return password.value === passwordConfirm.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);

  readonly form: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  // Public selectors from auth store
  readonly loading = this.authStore.loading;
  readonly error = this.authStore.error;

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const { name, email, password } = this.form.value;

    try {
      await this.authStore.register(email, password, name);
    } catch (err) {
      // Hiba kezelése az AuthStore-ban
      console.error('Regisztráció hiba:', err);
    }
  }

  // Getter a név control hibaüzenetéhez
  get nameError(): string | null {
    const control = this.form.get('name');
    if (control?.hasError('required')) {
      return 'A név kötelező.';
    }
    if (control?.hasError('minlength')) {
      return 'A név legalább 2 karakter hosszú kell hogy legyen.';
    }
    return null;
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

  // Getter a jelszó megerősítés hibaüzenetéhez
  get passwordConfirmError(): string | null {
    const control = this.form.get('passwordConfirm');
    if (control?.hasError('required')) {
      return 'A jelszó megerősítése kötelező.';
    }
    if (this.form.hasError('passwordMismatch') && control?.touched) {
      return 'A jelszavak nem egyeznek.';
    }
    return null;
  }
}
