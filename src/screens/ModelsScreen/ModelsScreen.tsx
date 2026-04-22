import React, {useState, useEffect} from 'react';
import {View, FlatList, Alert, ActivityIndicator, Pressable} from 'react-native';
import {observer} from 'mobx-react-lite';
import {reaction} from 'mobx';
import {Portal} from 'react-native-paper';

import {useTheme} from '../../hooks';
import {DownloadErrorDialog, RemoteModelSheet, ServerDetailsSheet} from '../../components';
import {modelStore, serverStore} from '../../store';
import {Model, ModelOrigin} from '../../utils/types';

// Modelos predefinidos disponibles para descarga
const AVAILABLE_MODELS = [
  {
    id: 'lilyanatia/Bonsai-1.7B-requantized/Bonsai-1.7B-IQ1_S.gguf',
    name: 'Bonsai 1.7B IQ1_S (Ultra pequeño)',
    author: 'lilyanatia',
    type: 'GGUF',
    size: '~438 MB',
    description: 'Modelo ultra compacto para dispositivos con recursos limitados',
    downloadUrl: 'https://huggingface.co/lilyanatia/Bonsai-1.7B-requantized/resolve/main/Bonsai-1.7B-IQ1_S.gguf',
    origin: ModelOrigin.HF,
    isDownloaded: false,
    progress: 0,
  },
  {
    id: 'lilyanatia/Bonsai-1.7B-requantized/Bonsai-1.7B-Q2_K.gguf',
    name: 'Bonsai 1.7B Q2_K (Equilibrado)',
    author: 'lilyanatia',
    type: 'GGUF',
    size: '~698 MB',
    description: 'Modelo equilibrado entre rendimiento y calidad',
    downloadUrl: 'https://huggingface.co/lilyanatia/Bonsai-1.7B-requantized/resolve/main/Bonsai-1.7B-Q2_K.gguf',
    origin: ModelOrigin.HF,
    isDownloaded: false,
    progress: 0,
  },
];

export const ModelsScreen: React.FC = observer(() => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remoteModelSheetVisible, setRemoteModelSheetVisible] = useState(false);
  const [serverDetailsSheetVisible, setServerDetailsSheetVisible] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [isShowingErrorDialog, setIsShowingErrorDialog] = useState(false);

  const theme = useTheme();

  // Cargar modelos al iniciar
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Sincronizar estado de descarga con modelStore
        const syncedModels = AVAILABLE_MODELS.map(availableModel => {
          const storedModel = modelStore.models.find(m => m.id === availableModel.id);
          return storedModel || {
            ...availableModel,
            isDownloaded: false,
            progress: 0,
          };
        });
        setModels(syncedModels);
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();

    // Escuchar cambios en el estado de descarga
    const disposeReaction = reaction(
      () => modelStore.models.map(m => ({id: m.id, isDownloaded: m.isDownloaded, progress: m.progress})),
      (updatedModels) => {
        setModels(prevModels => 
          prevModels.map(model => {
            const updated = updatedModels.find(m => m.id === model.id);
            return updated ? {...model, ...updated} : model;
          })
        );
      }
    );

    return () => disposeReaction();
  }, []);

  return (
    <View style={{flex: 1, padding: 16}} testID="models-screen">
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={models}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{marginBottom: 16, padding: 16, backgroundColor: theme.colors.surface, borderRadius: 8}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <View style={{fontSize: 18, fontWeight: 'bold', marginBottom: 4}}>
                    {item.name}
                  </View>
                  <View style={{fontSize: 14, color: theme.colors.onSurfaceVariant, marginBottom: 8}}>
                    {item.description}
                  </View>
                  <View style={{fontSize: 12, color: theme.colors.onSurfaceVariant}}>
                    Tamaño: {item.size}
                  </View>
                  {item.isDownloaded && (
                    <View style={{marginTop: 8, flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{color: theme.colors.primary, marginRight: 8}}>
                        ✓ Descargado
                      </View>
                      {modelStore.activeModel?.id === item.id && (
                        <View style={{color: theme.colors.secondary, fontWeight: 'bold'}}>
                          • En uso
                        </View>
                      )}
                    </View>
                  )}
                  {modelStore.isDownloading(item.id) && (
                    <View style={{marginTop: 8}}>
                      <View style={{fontSize: 12, marginBottom: 4}}>
                        Descargando: {Math.round(modelStore.getDownloadProgress(item.id) * 100)}%
                      </View>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', gap: 8}}>
                  {!item.isDownloaded && !modelStore.isDownloading(item.id) && (
                    <Pressable
                      onPress={() => modelStore.downloadHFModel(item as any, {rfilename: item.downloadUrl.split('/').pop() || ''} as any)}
                      style={({pressed}) => ({
                        backgroundColor: theme.colors.primary,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 4,
                        opacity: pressed ? 0.7 : 1,
                      })}>
                      <View style={{color: theme.colors.onPrimary, fontWeight: 'bold'}}>
                        Descargar
                      </View>
                    </Pressable>
                  )}
                  {item.isDownloaded && (
                    <Pressable
                      onPress={async () => {
                        try {
                          await modelStore.selectModel(item);
                          Alert.alert('Éxito', `Modelo ${item.name} activado`);
                        } catch (error) {
                          Alert.alert('Error', 'No se pudo cargar el modelo');
                        }
                      }}
                      style={({pressed}) => ({
                        backgroundColor: modelStore.activeModel?.id === item.id 
                          ? theme.colors.secondary 
                          : theme.colors.primary,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 4,
                        opacity: pressed ? 0.7 : 1,
                      })}>
                      <View style={{color: theme.colors.onPrimary, fontWeight: 'bold'}}>
                        {modelStore.activeModel?.id === item.id ? 'En uso' : 'Activar'}
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* DownloadErrorDialog with Portal for better visibility */}
      <Portal>
        <DownloadErrorDialog
          visible={isShowingErrorDialog}
          onDismiss={() => {
            modelStore.clearDownloadError();
          }}
          error={modelStore.downloadError}
          model={
            modelStore.downloadError?.metadata?.modelId
              ? modelStore.models.find(
                  m => m.id === modelStore.downloadError?.metadata?.modelId,
                )
              : undefined
          }
          onTryAgain={modelStore.retryDownload}
        />
      </Portal>

      <RemoteModelSheet
        isVisible={remoteModelSheetVisible}
        onDismiss={() => setRemoteModelSheetVisible(false)}
      />
      <ServerDetailsSheet
        isVisible={serverDetailsSheetVisible}
        onDismiss={() => {
          setServerDetailsSheetVisible(false);
          setSelectedServerId(null);
        }}
        serverId={selectedServerId}
      />
    </View>
  );
});
