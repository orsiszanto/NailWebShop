import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCategoryService } from '../../data-access/admin-category.service';
import { Category } from '../../../../core/models';
import { signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagementComponent implements OnInit {
  private adminCategoryService = inject(AdminCategoryService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  loading = signal(false);
  isEditModalOpen = signal(false);
  selectedCategory = signal<Category | null>(null);
  categoryForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
    this.loadCategories();
  }

  private initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: [true],
    });
  }

  async loadCategories() {
    this.loading.set(true);
    try {
      const data = await this.adminCategoryService.getAll();
      this.categories.set(data);
    } catch (error) {
      this.notificationService.error('Hiba', 'Kategóriák betöltése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  openEditModal(category: Category) {
    this.selectedCategory.set(category);
    this.categoryForm.patchValue(category);
    this.isEditModalOpen.set(true);
  }

  openNewCategoryModal() {
    this.selectedCategory.set(null);
    this.categoryForm.reset({ active: true });
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.selectedCategory.set(null);
    this.categoryForm.reset();
  }

  async saveCategory() {
    if (!this.categoryForm.valid) {
      this.notificationService.warning('Validálás', 'Kérjük, töltse ki az összes mezőt');
      return;
    }

    const formData = this.categoryForm.value;
    this.loading.set(true);

    try {
      if (this.selectedCategory()) {
        // Update
        await this.adminCategoryService.update(this.selectedCategory()!.id, formData);
        this.notificationService.success('Siker', 'Kategória sikeresen módosítva');
      } else {
        // Create
        await this.adminCategoryService.create(formData);
        this.notificationService.success('Siker', 'Kategória sikeresen létrehozva');
      }
      this.closeEditModal();
      await this.loadCategories();
    } catch (error) {
      this.notificationService.error('Hiba', 'Kategória mentése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCategory(id: string) {
    if (!confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) return;

    this.loading.set(true);
    try {
      await this.adminCategoryService.delete(id);
      this.notificationService.success('Siker', 'Kategória sikeresen törölve');
      await this.loadCategories();
    } catch (error) {
      this.notificationService.error('Hiba', 'Kategória törlése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  getFieldError(field: string): string {
    const control = this.categoryForm.get(field);
    if (!control?.errors || !control?.touched) return '';

    if (control.hasError('required')) return 'Ez a mező kötelező';
    if (control.hasError('minlength'))
      return `Minimum ${control.getError('minlength').requiredLength} karakter szükséges`;

    return '';
  }
}

