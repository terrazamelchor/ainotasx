import {makeAutoObservable, runInAction} from 'mobx';
import {NativeModules, NativeEventEmitter} from 'react-native';

const {NotificationListener} = NativeModules;

export interface NotificationItem {
  id: string;
  packageName: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

class NotificationStoreClass {
  notifications: NotificationItem[] = [];
  isListening: boolean = false;
  hasPermission: boolean = false;

  private eventEmitter: NativeEventEmitter | null = null;

  constructor() {
    makeAutoObservable(this);
    this.setupEventListeners();
    this.checkPermission();
  }

  private setupEventListeners() {
    if (NotificationListener) {
      this.eventEmitter = new NativeEventEmitter(NotificationListener);
      this.eventEmitter.addListener('onNotificationReceived', data => {
        this.addNotification(data);
      });
      this.eventEmitter.addListener('onNotificationRemoved', data => {
        this.removeNotification(data);
      });
    }
  }

  private generateId(pkg: string, title: string, timestamp: number): string {
    return `${pkg}-${title}-${timestamp}`;
  }

  private addNotification(data: any) {
    const notification: NotificationItem = {
      id: this.generateId(data.packageName, data.title, data.timestamp),
      packageName: data.packageName,
      title: data.title,
      message: data.message,
      timestamp: data.timestamp,
      isRead: false,
    };

    runInAction(() => {
      this.notifications.unshift(notification);
    });
  }

  private removeNotification(data: any) {
    runInAction(() => {
      this.notifications = this.notifications.filter(
        n =>
          !(
            n.packageName === data.packageName &&
            n.title === data.title &&
            Math.abs(n.timestamp - data.timestamp) < 5000
          ),
      );
    });
  }

  async checkPermission() {
    if (NotificationListener) {
      try {
        const enabled = await NotificationListener.isPermissionEnabled();
        runInAction(() => {
          this.hasPermission = enabled;
        });
      } catch (error) {
        console.error('Error checking permission:', error);
      }
    }
  }

  async requestPermission() {
    if (NotificationListener) {
      NotificationListener.openNotificationSettings();
    }
  }

  async startListening() {
    if (NotificationListener) {
      try {
        await NotificationListener.startListening();
        runInAction(() => {
          this.isListening = true;
        });
      } catch (error) {
        console.error('Error starting listener:', error);
      }
    }
  }

  async stopListening() {
    if (NotificationListener) {
      try {
        await NotificationListener.stopListening();
        runInAction(() => {
          this.isListening = false;
        });
      } catch (error) {
        console.error('Error stopping listener:', error);
      }
    }
  }

  markAsRead(id: string) {
    runInAction(() => {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.isRead = true;
      }
    });
  }

  markAllAsRead() {
    runInAction(() => {
      this.notifications.forEach(n => {
        n.isRead = true;
      });
    });
  }

  removeNotificationById(id: string) {
    runInAction(() => {
      this.notifications = this.notifications.filter(n => n.id !== id);
    });
  }

  clearAll() {
    runInAction(() => {
      this.notifications = [];
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get recentNotifications(): NotificationItem[] {
    return this.notifications.slice(0, 50);
  }
}

export const NotificationStore = new NotificationStoreClass();
