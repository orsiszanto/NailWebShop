import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminProductService } from '../../data-access/admin-product.service';
import { Product } from '../../../../core/models';
import { signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagementComponent implements OnInit {
  private adminProductService = inject(AdminProductService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  loading = signal(false);
  isEditModalOpen = signal(false);
  selectedProduct = signal<Product | null>(null);
  productForm!: FormGroup;

  categories = [
    { id: 'alapanyagok', name: 'Alapanyagok' },
    { id: 'lakkok', name: 'Lakkok' },
    { id: 'diszitok', name: 'Díszítők' },
    { id: 'eszkozok', name: 'Eszközök' },
  ];

  ngOnInit() {
    this.initializeForm();
    this.loadProducts();
  }

  private initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      active: [true],
      oldPrice: [0],
      images: [[], Validators.required],
    });
  }

  async loadProducts() {
    this.loading.set(true);
    try {
      const data = await this.adminProductService.getAll();
      this.products.set(data);
    } catch (error) {
      this.notificationService.error('Hiba', 'Termékek betöltése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  openEditModal(product: Product) {
    this.selectedProduct.set(product);
    this.productForm.patchValue({
      ...product,
      images: product.images?.join(',') || '',
    });
    this.isEditModalOpen.set(true);
  }

  openNewProductModal() {
    this.selectedProduct.set(null);
    this.productForm.reset({ active: true });
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.selectedProduct.set(null);
    this.productForm.reset();
  }

  async saveProduct() {
    if (!this.productForm.valid) {
      this.notificationService.warning('Validálás', 'Kérjük, töltse ki az összes mezőt správt');
      return;
    }

    const formData = this.productForm.value;
    // Szöveg formátumú képeket tömbbé konvertáljuk
    formData.images = formData.images ? formData.images.split(',').map((img: string) => img.trim()).filter((img: string) => img) : [];
    
    this.loading.set(true);

    try {
      if (this.selectedProduct()) {
        // Update
        await this.adminProductService.update(this.selectedProduct()!.id, formData);
        this.notificationService.success('Siker', 'Termék sikeresen módosítva');
      } else {
        // Create
        await this.adminProductService.create(formData);
        this.notificationService.success('Siker', 'Termék sikeresen létrehozva');
      }
      this.closeEditModal();
      await this.loadProducts();
    } catch (error) {
      this.notificationService.error('Hiba', 'Termék mentése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteProduct(id: string) {
    if (!confirm('Biztosan törölni szeretnéd ezt a terméket?')) return;

    this.loading.set(true);
    try {
      await this.adminProductService.delete(id);
      this.notificationService.success('Siker', 'Termék sikeresen törölve');
      await this.loadProducts();
    } catch (error) {
      this.notificationService.error('Hiba', 'Termék törlése sikertelen');
    } finally {
      this.loading.set(false);
    }
  }

  getCategoryName(id: string): string {
    return this.categories.find((c) => c.id === id)?.name || id;
  }

  isOnSale(product: Product): boolean {
    return !!product.oldPrice && product.oldPrice > product.price;
  }

  getFieldError(field: string): string {
    const control = this.productForm.get(field);
    if (!control?.errors || !control?.touched) return '';

    if (control.hasError('required')) return 'Ez a mező kötelező';
    if (control.hasError('minlength'))
      return `Minimum ${control.getError('minlength').requiredLength} karakter szükséges`;
    if (control.hasError('min')) return `Minimum érték: 0`;

    return '';
  }
}


