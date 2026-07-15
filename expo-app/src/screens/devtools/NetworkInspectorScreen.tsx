import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  NetworkInspectorPlaceholder,
  NetworkLogRow,
  GallerySection,
} from '../../components/devtools';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'NetworkInspector'
  >;
};

export const NetworkInspectorScreen: React.FC<Props> = ({ navigation }) => {
  const snapshot = useDevToolsStore((s) => s.snapshot);
  const networkLogs = useDevToolsStore((s) => s.networkLogs);
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Network Inspector"
        subtitle="Placeholder"
        onBack={() => navigation.goBack()}
      />
      <NetworkInspectorPlaceholder
        message={
          snapshot?.networkInspectorMessage ??
          'Request capture lands with HttpClient tap hooks.'
        }
      />
      <GallerySection title="Sample traffic">
        {networkLogs.map((log) => (
          <NetworkLogRow
            key={log.id}
            method={log.method}
            path={log.path}
            status={log.status}
            durationMs={log.durationMs}
            source={log.source}
          />
        ))}
      </GallerySection>
      <Text style={styles.footer}>
        Ready: {String(snapshot?.networkInspectorReady ?? false)}
      </Text>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  footer: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});
