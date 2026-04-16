import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  it('should create a success notification', () => {
    service.success('Teszt', 'Sikeres teszt üzenet');
    
    const notifications = service.notifications();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].title).toBe('Teszt');
    expect(notifications[0].message).toBe('Sikeres teszt üzenet');
  });

  it('should create an error notification', () => {
    service.error('Hiba', 'Hibaüzenet');
    
    const notifications = service.notifications();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].title).toBe('Hiba');
  });

  it('should create a warning notification', () => {
    service.warning('Figyelem', 'Figyelmeztetés');
    
    const notifications = service.notifications();
    expect(notifications[0].type).toBe('warning');
  });

  it('should create an info notification', () => {
    service.info('Info', 'Információ');
    
    const notifications = service.notifications();
    expect(notifications[0].type).toBe('info');
  });

  it('should use legacy showSuccess method', () => {
    service.showSuccess('Kosárba adva!');
    
    const notifications = service.notifications();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].title).toBe('Siker');
    expect(notifications[0].message).toBe('Kosárba adva!');
  });

  it('should use legacy showError method', () => {
    service.showError('Valami hiba történt');
    
    const notifications = service.notifications();
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].title).toBe('Hiba');
    expect(notifications[0].message).toBe('Valami hiba történt');
  });

  it('should remove notification by id', () => {
    service.success('Test1', 'Message 1');
    service.success('Test2', 'Message 2');
    
    let notifications = service.notifications();
    expect(notifications.length).toBe(2);
    
    const firstNotificationId = notifications[0].id;
    service.remove(firstNotificationId);
    
    notifications = service.notifications();
    expect(notifications.length).toBe(1);
    expect(notifications[0].id).not.toBe(firstNotificationId);
  });

  it('should have unique notification IDs', () => {
    service.success('Test1', 'Message 1');
    service.success('Test2', 'Message 2');
    service.success('Test3', 'Message 3');
    
    const notifications = service.notifications();
    const ids = notifications.map(n => n.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(3);
  });

  it('should use default duration if not specified', () => {
    service.success('Test', 'Message');
    
    const notification = service.notifications()[0];
    expect(notification.duration).toBe(5000);
  });

  it('should use custom duration when specified', () => {
    service.success('Test', 'Message', 10000);
    
    const notification = service.notifications()[0];
    expect(notification.duration).toBe(10000);
  });

  it('should use different durations for different notification types', () => {
    service.success('Success', 'Message', 5000);
    service.error('Error', 'Message', 7000);
    
    const notifications = service.notifications();
    expect(notifications[0].duration).toBe(5000);
    expect(notifications[1].duration).toBe(7000);
  });
});
