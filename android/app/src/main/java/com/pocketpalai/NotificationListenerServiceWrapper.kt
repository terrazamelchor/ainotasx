package com.pocketpal

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

class NotificationListenerServiceWrapper : NotificationListenerService() {

    companion object {
        var instance: NotificationListenerServiceWrapper? = null
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)
        instance?.let {
            // Find the module instance from ReactPackage
            val packages = (application as MainApplication).reactNativeHost.packages
            packages.forEach { pkg ->
                if (pkg is NotificationListenerPackage) {
                    pkg.getModule()?.onNotificationPosted(sbn)
                }
            }
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        super.onNotificationRemoved(sbn)
        instance?.let {
            val packages = (application as MainApplication).reactNativeHost.packages
            packages.forEach { pkg ->
                if (pkg is NotificationListenerPackage) {
                    pkg.getModule()?.onNotificationRemoved(sbn)
                }
            }
        }
    }
}
