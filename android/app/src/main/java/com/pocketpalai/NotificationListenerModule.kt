package com.pocketpal

import android.app.Notification
import android.os.Bundle
import android.service.notification.StatusBarNotification
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationListenerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var isListening = false

    override fun getName(): String {
        return "NotificationListener"
    }

    @ReactMethod
    fun startListening(promise: Promise) {
        try {
            isListening = true
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        try {
            isListening = false
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun isPermissionEnabled(promise: Promise) {
        try {
            val packageName = reactApplicationContext.packageName
            val flat = android.provider.Settings.Secure.getString(
                reactApplicationContext.contentResolver,
                "enabled_notification_listeners"
            )
            val enabled = flat != null && flat.contains(packageName)
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun openNotificationSettings() {
        try {
            val intent = android.content.Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.currentActivity?.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun onNotificationPosted(sbn: StatusBarNotification) {
        if (!isListening) return

        try {
            val packageName = sbn.packageName
            val notification = sbn.notification
            val extras = notification.extras
            
            val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
            val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
            val bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT)?.toString() ?: text
            
            val params = Arguments.createMap().apply {
                putString("packageName", packageName)
                putString("title", title)
                putString("message", if (bigText.isNotEmpty()) bigText else text)
                putString("ticker", notification.tickerText?.toString() ?: "")
                putDouble("timestamp", System.currentTimeMillis().toDouble())
            }

            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onNotificationReceived", params)
                
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun onNotificationRemoved(sbn: StatusBarNotification) {
        if (!isListening) return

        try {
            val packageName = sbn.packageName
            val notification = sbn.notification
            val extras = notification.extras
            
            val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
            val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""
            
            val params = Arguments.createMap().apply {
                putString("packageName", packageName)
                putString("title", title)
                putString("message", text)
                putDouble("timestamp", System.currentTimeMillis().toDouble())
            }

            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onNotificationRemoved", params)
                
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
