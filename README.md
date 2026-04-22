# PocketPal AI - Notificador Inteligente 📱🔔

PocketPal AI es un asistente de notificaciones inteligente que utiliza modelos de lenguaje pequeños (SLMs) ejecutados directamente en tu dispositivo Android. La aplicación lee las notificaciones de otras apps, las procesa con IA para generar una narración natural y las reproduce mediante el sistema TTS nativo del dispositivo.

> **Nota de Privacidad**: Todo el procesamiento ocurre completamente en tu dispositivo. Las notificaciones se leen localmente y no se envían a servidores externos. El modelo de IA y la síntesis de voz funcionan offline una vez descargados.

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Uso](#uso)
- [Configuración de Desarrollo](#configuración-de-desarrollo)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Agradecimientos](#agradecimientos)

## 📰 Novedades

- **🔔 Sistema de Notificaciones Inteligentes (v2.0, 2025)**: PocketPal AI ahora puede leer todas las notificaciones de tu dispositivo Android y narrarlas usando IA local.
- **🤖 Integración con Modelos GGUF**: Soporte completo para descargar y utilizar modelos GGUF desde Hugging Face para procesamiento de lenguaje natural.
- **🎙️ Narración TTS Nativa**: Integración con el sistema Text-to-Speech de Android para reproducción de audio de alta calidad.
- **📱 Interfaz Simplificada**: Nueva pantalla principal dedicada a mostrar y gestionar notificaciones de todas las aplicaciones.

## Características Principales

- **Lectura de Notificaciones Universal**: Accede a notificaciones de cualquier aplicación instalada en tu dispositivo Android.
- **Procesamiento con IA Local**: Utiliza modelos GGUF (GPT-quantized) para interpretar y narrar notificaciones de forma inteligente.
- **Síntesis de Voz Nativa**: Integración directa con el motor TTS del sistema Android.
- **Funcionamiento Offline**: Una vez descargado el modelo, todo el procesamiento ocurre sin necesidad de internet.
- **Gestión de Notificaciones**: Historial completo de notificaciones con opciones para marcar como leídas, eliminar o volver a escuchar.
- **Modelos Flexibles**: Descarga y cambia entre múltiples modelos GGUF según tus necesidades.
- **Búsqueda en Hugging Face**: Explora y descarga modelos directamente desde el hub de Hugging Face.
- **Descargas en Segundo Plano**: Continúa descargando modelos mientras usas otras aplicaciones.
- **Privacidad Total**: Tus notificaciones y datos nunca salen de tu dispositivo.

## Instalación

### Android

Obtén PocketPal AI en Google Play:

[**Disponible en Google Play**](https://play.google.com/store/apps/details?id=com.pocketpalai)

O compila la aplicación desde el código fuente siguiendo las instrucciones de desarrollo.

## Uso

### Configuración Inicial

1. Abre la aplicación después de instalarla.
2. La pantalla principal mostrará la lista de notificaciones recibidas.
3. En el primer uso, deberás habilitar el permiso de lectura de notificaciones.

### Descargar un Modelo GGUF

1. Abre el menú lateral (☰).
2. Navega a la sección **Modelos**.
3. Explora los modelos disponibles o busca en Hugging Face.
4. Selecciona un modelo GGUF compatible con tu dispositivo.
5. Toca **Descargar** y espera a que finalice la descarga.
6. Una vez descargado, el modelo estará disponible para usar automáticamente.

> **Recomendación**: Para dispositivos con memoria limitada, usa modelos cuantizados (Q4_K_M, Q5_K_M) de hasta 3B de parámetros.

### Habilitar Lectura de Notificaciones

1. Desde la pantalla principal, toca el botón **Iniciar Escucha**.
2. El sistema te redirigirá a la configuración de notificaciones de Android.
3. Busca **PocketPal AI** en la lista de aplicaciones.
4. Activa el interruptor para permitir el acceso a notificaciones.
5. Regresa a la aplicación y confirma que el estado muestra "Escuchando".

⚠️ **Importante**: Este permiso permite leer el contenido de todas las notificaciones del sistema. Solo habilítalo si confías en la aplicación.

### Escuchar Notificaciones

1. Cuando llegue una nueva notificación, aparecerá en la lista de la pantalla principal.
2. Cada notificación muestra:
   - **Nombre de la App**: Aplicación que generó la notificación.
   - **Título**: Encabezado de la notificación.
   - **Mensaje**: Contenido completo del mensaje.
3. Toca el botón **▶️ Narrar** en cualquier notificación.
4. La IA procesará el contenido y lo narrará usando el TTS nativo.
5. Puedes detener la narración en cualquier momento tocando el botón **⏹️ Detener**.

### Gestionar Notificaciones

- **Marcar como Leída**: Las notificaciones se marcan automáticamente al ser narradas.
- **Eliminar**: Desliza hacia la izquierda o toca el botón de eliminar para borrar notificaciones individuales.
- **Historial**: Todas las notificaciones permanecen en la lista hasta que las elimines manualmente.
- **Re-narrar**: Puedes volver a escuchar cualquier notificación tocando el botón de narrar nuevamente.

## Configuración de Desarrollo

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **Yarn**
- **React Native CLI**
- **Android Studio** (para desarrollo Android)
- **JDK 17** o superior

### Primeros Pasos

1. **Fork y Clonar el Repositorio**

   ```bash
   git clone https://github.com/a-ghorbani/pocketpal-ai
   cd pocketpal-ai
   ```

2. **Instalar Dependencias**

   ```bash
   yarn install
   ```

3. **Ejecutar la Aplicación**

   - **Emulador Android**

     ```bash
     yarn android
     ```

   - **Dispositivo Físico** (con USB debugging activado)

     ```bash
     yarn android
     ```

### Scripts Disponibles

- **Iniciar Metro Bundler**

  ```bash
  yarn start
  ```

- **Limpiar Artefactos de Build**

  ```bash
  yarn clean
  ```

- **Lint y Type Check**

  ```bash
  yarn lint
  yarn typecheck
  ```

- **Ejecutar Tests**

  ```bash
  yarn test
  ```

- **Build de Producción (Android)**

  ```bash
  cd android && ./gradlew assembleRelease
  ```

## Contribuir

¡Damos la bienvenida a todas las contribuciones! Por favor, lee nuestras [Guías de Contribución](CONTRIBUTING.md) y [Código de Conducta](./CODE_OF_CONDUCT.md) antes de comenzar.

### Inicio Rápido para Contribuyentes

1. **Fork del Repositorio**
2. **Crear una Nueva Rama**

   ```bash
   git checkout -b feature/tu-nueva-funcionalidad
   ```

3. **Realizar Tus Cambios**
4. **Probar Tus Cambios**

   ```bash
   yarn android
   ```

5. **Lint y Type Check**

   ```bash
   yarn lint
   yarn typecheck
   ```

6. **Commit de Tus Cambios**

   Sigue el formato de Conventional Commits:

   ```bash
   git commit -m "feat: agregar soporte para nuevo modelo"
   ```

7. **Push y Abrir un Pull Request**

   ```bash
   git push origin feature/tu-nueva-funcionalidad
   ```

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## Contacto

Para preguntas o feedback, por favor abre un issue en el repositorio.

## Agradecimientos

PocketPal AI está construido utilizando el trabajo increíble de:

- **[llama.cpp](https://github.com/ggerganov/llama.cpp)**: Permite la inferencia eficiente de LLMs en dispositivos locales.
- **[llama.rn](https://github.com/mybigday/llama.rn)**: Implementa bindings de llama.cpp en React Native.
- **[React Native](https://reactnative.dev/)**: El framework que potencia la experiencia multiplataforma.
- **[MobX](https://mobx.js.org/)**: Librería de gestión de estado que mantiene la app reactiva.
- **[React Native Paper](https://callstack.github.io/react-native-paper/)**: Componentes Material Design para la UI.
- **[React Navigation](https://reactnavigation.org/)**: Enrutamiento y navegación para las pantallas.
- **[NotificationListenerService](https://developer.android.com/reference/android/service/notification/NotificationListenerService)**: API de Android para lectura de notificaciones del sistema.
- **[@dr.pogodin/react-native-fs](https://github.com/birdofpreyru/react-native-fs)**: Acceso al sistema de archivos para descarga y gestión de modelos.

¡Y muchas otras librerías de código abierto que hacen posible este proyecto!

---

¡Feliz exploración! 🚀📱✨
