import * as React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

import {observer} from 'mobx-react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {ttsStore, uiStore} from './src/store';
import {useTheme} from './src/hooks';
import {Theme} from './src/utils/types';

import {l10n, initLocale} from './src/locales';
import {L10nContext} from './src/utils';
import {ROUTES} from './src/utils/navigationConstants';

import {
  SidebarContent,
  ModelsHeaderRight,
  HeaderLeft,
  AppWithMigration,
  MemorySnapshotTrigger,
} from './src/components';
import {ChatScreen, ModelsScreen, NotificationsScreen} from './src/screens';

// Check if app is in debug mode
const isDebugMode = __DEV__;

const Drawer = createDrawerNavigator();

const screenWidth = Dimensions.get('window').width;

const App = observer(() => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const currentL10n = l10n[uiStore.language];

  // Initialize locale with the current language
  React.useEffect(() => {
    initLocale(uiStore.language);
  }, []);

  // Initialize TTS store (memory gate + AppState/session listeners).
  // Fire-and-forget: `init()` is idempotent and swallows its own errors.
  React.useEffect(() => {
    ttsStore.init().catch(() => {
      // init() swallows its own errors; catch to satisfy no-floating-promises.
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <MemorySnapshotTrigger />
      <SafeAreaProvider>
        <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
          <PaperProvider theme={theme}>
            <L10nContext.Provider value={currentL10n}>
              <NavigationContainer>
                <BottomSheetModalProvider>
                  <Drawer.Navigator
                    screenOptions={{
                      headerLeft: () => <HeaderLeft />,
                      drawerStyle: {
                        width: screenWidth > 400 ? 320 : screenWidth * 0.8,
                      },
                      headerStyle: {
                        backgroundColor: theme.colors.background,
                      },
                      headerTintColor: theme.colors.onBackground,
                      headerTitleStyle: styles.headerTitle,
                    }}
                    drawerContent={props => <SidebarContent {...props} />}>
                    <Drawer.Screen
                      name={ROUTES.NOTIFICATIONS}
                      component={gestureHandlerRootHOC(NotificationsScreen)}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Drawer.Screen
                      name={ROUTES.CHAT}
                      component={gestureHandlerRootHOC(ChatScreen)}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Drawer.Screen
                      name={ROUTES.MODELS}
                      component={gestureHandlerRootHOC(ModelsScreen)}
                      options={{
                        headerRight: () => <ModelsHeaderRight />,
                        headerStyle: styles.headerWithoutDivider,
                        title: currentL10n.screenTitles.models,
                      }}
                    />
                  </Drawer.Navigator>
                </BottomSheetModalProvider>
              </NavigationContainer>
            </L10nContext.Provider>
          </PaperProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    headerWithoutDivider: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: theme.colors.background,
    },
    headerWithDivider: {
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.fonts.titleSmall,
    },
  });

// Wrap the App component with AppWithMigration to show migration UI when needed
const AppWithMigrationWrapper = () => {
  return (
    <AppWithMigration>
      <App />
    </AppWithMigration>
  );
};

export default AppWithMigrationWrapper;
