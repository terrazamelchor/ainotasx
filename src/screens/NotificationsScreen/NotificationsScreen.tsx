import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {observer} from 'mobx-react-lite';
import {NotificationStore} from '../../store/NotificationStore';
import {ModelStore} from '../../store/ModelStore';
import {TTSStore} from '../../store/TTSStore';
import styles from './styles';

const NotificationsScreen: React.FC = observer(() => {
  const [isNarrating, setIsNarrating] = useState<string | null>(null);

  useEffect(() => {
    NotificationStore.checkPermission();
    return () => {
      NotificationStore.stopListening();
    };
  }, []);

  const handleRequestPermission = async () => {
    await NotificationStore.requestPermission();
    setTimeout(() => {
      NotificationStore.checkPermission();
    }, 1000);
  };

  const handleStartListening = async () => {
    if (!NotificationStore.hasPermission) {
      Alert.alert(
        'Permiso requerido',
        'Debes habilitar el permiso de notificaciones en la configuración del sistema.',
        [
          {text: 'Cancelar', style: 'cancel'},
          {text: 'Ir a Configuración', onPress: handleRequestPermission},
        ],
      );
      return;
    }
    await NotificationStore.startListening();
  };

  const handleStopListening = async () => {
    await NotificationStore.stopListening();
  };

  const handleNarrateNotification = async (notification: any) => {
    if (isNarrating === notification.id) {
      TTSStore.stop();
      setIsNarrating(null);
      return;
    }

    try {
      setIsNarrating(notification.id);
      
      // Marcar como leída
      NotificationStore.markAsRead(notification.id);

      // Crear prompt para el modelo GGUF
      const systemPrompt = `Eres un narrador profesional de notificaciones. Tu tarea es leer el contenido de las notificaciones de manera clara y natural. 
      
Instrucciones:
- Lee el nombre de la aplicación, el título y el mensaje completo
- Usa un tono claro y profesional
- No agregues comentarios adicionales, solo narra el contenido
- Si hay abreviaturas o símbolos, léelos de forma natural`;

      const userMessage = `Por favor narra esta notificación:
App: ${notification.packageName}
Título: ${notification.title || 'Sin título'}
Mensaje: ${notification.message || 'Sin contenido'}`;

      // Usar el modelo GGUF para generar la narración
      const response = await ModelStore.generateResponse(
        systemPrompt,
        userMessage,
      );

      // Enviar el texto generado al TTS nativo
      if (response && response.text) {
        await TTSStore.speak(response.text);
      } else {
        // Fallback: leer directamente el contenido de la notificación
        const textToSpeak = `${notification.packageName}. ${notification.title || ''}. ${notification.message || ''}`;
        await TTSStore.speak(textToSpeak);
      }

      setIsNarrating(null);
    } catch (error) {
      console.error('Error narrating notification:', error);
      setIsNarrating(null);
      
      // Fallback directo a TTS si falla el modelo
      try {
        const textToSpeak = `${notification.packageName}. ${notification.title || ''}. ${notification.message || ''}`;
        await TTSStore.speak(textToSpeak);
      } catch (ttsError) {
        console.error('Error en TTS fallback:', ttsError);
      }
    }
  };

  const handleDeleteNotification = (id: string) => {
    NotificationStore.removeNotificationById(id);
  };

  const renderNotification = ({item}: {item: any}) => (
    <View style={[styles.notificationCard, item.isRead && styles.readNotification]}>
      <View style={styles.notificationHeader}>
        <Text style={styles.appName}>{item.packageName}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      
      {item.title ? (
        <Text style={styles.title}>{item.title}</Text>
      ) : null}
      
      <Text style={styles.message} numberOfLines={3}>
        {item.message}
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isNarrating === item.id && styles.narratingButton,
          ]}
          onPress={() => handleNarrateNotification(item)}>
          <Text style={styles.actionButtonText}>
            {isNarrating === item.id ? 'Detener' : 'Narrar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteNotification(item.id)}>
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!NotificationStore.hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>
            Permiso de Notificaciones Requerido
          </Text>
          <Text style={styles.permissionText}>
            Para leer las notificaciones de otras aplicaciones, necesitas habilitar
            el permiso de acceso a notificaciones en la configuración del sistema.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handleRequestPermission}>
            <Text style={styles.permissionButtonText}>
              Habilitar Permiso
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              NotificationStore.isListening && styles.statusDotActive,
            ]}
          />
          <Text style={styles.statusText}>
            {NotificationStore.isListening ? 'Escuchando' : 'Detenido'}
          </Text>
        </View>
      </View>

      {!NotificationStore.isListening && (
        <TouchableOpacity
          style={styles.listenButton}
          onPress={handleStartListening}>
          <Text style={styles.listenButtonText}>Comenzar a Escuchar</Text>
        </TouchableOpacity>
      )}

      {NotificationStore.isListening && (
        <TouchableOpacity
          style={[styles.listenButton, styles.stopButton]}
          onPress={handleStopListening}>
          <Text style={styles.listenButtonText}>Detener</Text>
        </TouchableOpacity>
      )}

      {NotificationStore.notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {NotificationStore.isListening
              ? 'Esperando notificaciones...'
              : 'No hay notificaciones'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={NotificationStore.notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
});

export default NotificationsScreen;
