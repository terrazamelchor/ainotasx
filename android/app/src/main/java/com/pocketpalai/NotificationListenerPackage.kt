package com.pocketpal

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class NotificationListenerPackage : ReactPackage {

    private var module: NotificationListenerModule? = null

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = ArrayList<NativeModule>()
        module = NotificationListenerModule(reactContext)
        modules.add(module!!)
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    fun getModule(): NotificationListenerModule? {
        return module
    }
}
