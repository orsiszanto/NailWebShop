import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  showSuccess(message: string): void {
    // Simple alert for now - can be replaced with a proper toast component later
    alert(`✅ ${message}`);
  }

  showError(message: string): void {
    alert(`❌ ${message}`);
  }

  showInfo(message: string): void {
    alert(`ℹ️ ${message}`);
  }
}