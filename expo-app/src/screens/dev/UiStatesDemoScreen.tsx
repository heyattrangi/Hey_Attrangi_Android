import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import {
  LoadingState,
  EmptyState,
  ErrorState,
  OfflineState,
  SuccessState,
  ScreenStateHost,
  EMPTY_VARIANTS,
  ERROR_VARIANTS,
  SUCCESS_VARIANTS,
  LOADING_VARIANTS,
  EmptyVariant,
  ErrorVariant,
  SuccessVariant,
} from '../../components/ui/states';
import {
  LogoutDialog,
  CancelSessionDialog,
  DiscardChangesDialog,
  DeleteAccountDialog,
  PermissionRequiredDialog,
  BiometricSetupDialog,
  SessionExpiredDialog,
} from '../../components/ui/dialogs';
import { useUiStateStore } from '../../store/uiStateStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { LoadingDomain } from '../../app/ui-states';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'UiStatesDemo'>;
};

type PreviewKind =
  | { type: 'loading'; domain: LoadingDomain }
  | { type: 'empty'; variant: EmptyVariant }
  | { type: 'error'; variant: ErrorVariant }
  | { type: 'offline' }
  | { type: 'success'; variant: SuccessVariant }
  | { type: 'host' };

const DEMO_SCREEN_ID = 'ui-states-demo';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {title}
    </Text>
    <View style={styles.chipRow}>{children}</View>
  </View>
);

const Chip: React.FC<{
  label: string;
  selected?: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
    accessibilityRole="button"
    accessibilityState={{ selected: Boolean(selected) }}
    accessibilityLabel={label}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

export const UiStatesDemoScreen: React.FC<Props> = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [preview, setPreview] = useState<PreviewKind | null>(null);
  const [dialog, setDialog] = useState<
    | 'logout'
    | 'cancel'
    | 'discard'
    | 'delete'
    | 'permission'
    | 'biometric'
    | 'session'
    | null
  >(null);

  const setScreenState = useUiStateStore((s) => s.setScreenState);
  const clearScreenState = useUiStateStore((s) => s.clearScreenState);
  const hostOverride = useUiStateStore((s) => s.screens[DEMO_SCREEN_ID]);

  const loadingDomains = useMemo(
    () => Object.keys(LOADING_VARIANTS) as LoadingDomain[],
    [],
  );
  const emptyVariants = useMemo(
    () => Object.keys(EMPTY_VARIANTS) as EmptyVariant[],
    [],
  );
  const errorVariants = useMemo(
    () => Object.keys(ERROR_VARIANTS) as ErrorVariant[],
    [],
  );
  const successVariants = useMemo(
    () => Object.keys(SUCCESS_VARIANTS) as SuccessVariant[],
    [],
  );

  const previewHeight = Math.min(height * 0.48, 420);

  return (
    <AppScreen includeBottomInset>
      <AppHeader
        title="UI States QA"
        subtitle="Design-folder states & dialogs"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Section title="LoadingState">
          {loadingDomains.map((domain) => (
            <Chip
              key={domain}
              label={domain}
              selected={preview?.type === 'loading' && preview.domain === domain}
              onPress={() => setPreview({ type: 'loading', domain })}
            />
          ))}
        </Section>

        <Section title="EmptyState">
          {emptyVariants.map((variant) => (
            <Chip
              key={variant}
              label={variant}
              selected={preview?.type === 'empty' && preview.variant === variant}
              onPress={() => setPreview({ type: 'empty', variant })}
            />
          ))}
        </Section>

        <Section title="ErrorState">
          {errorVariants.map((variant) => (
            <Chip
              key={variant}
              label={variant}
              selected={preview?.type === 'error' && preview.variant === variant}
              onPress={() => setPreview({ type: 'error', variant })}
            />
          ))}
        </Section>

        <Section title="OfflineState">
          <Chip
            label="offline"
            selected={preview?.type === 'offline'}
            onPress={() => setPreview({ type: 'offline' })}
          />
        </Section>

        <Section title="SuccessState">
          {successVariants.map((variant) => (
            <Chip
              key={variant}
              label={variant}
              selected={preview?.type === 'success' && preview.variant === variant}
              onPress={() => setPreview({ type: 'success', variant })}
            />
          ))}
        </Section>

        <Section title="Dialogs">
          <Chip label="Logout" onPress={() => setDialog('logout')} />
          <Chip label="Cancel Session" onPress={() => setDialog('cancel')} />
          <Chip label="Discard Changes" onPress={() => setDialog('discard')} />
          <Chip label="Delete Account" onPress={() => setDialog('delete')} />
          <Chip label="Permission Required" onPress={() => setDialog('permission')} />
          <Chip label="Biometric Setup" onPress={() => setDialog('biometric')} />
          <Chip label="Session Expired" onPress={() => setDialog('session')} />
        </Section>

        <Section title="Zustand ScreenStateHost">
          <Chip
            label="Force empty.sessions"
            selected={hostOverride?.mode === 'empty'}
            onPress={() => {
              setScreenState(DEMO_SCREEN_ID, {
                mode: 'empty',
                emptyKind: 'sessions',
              });
              setPreview({ type: 'host' });
            }}
          />
          <Chip
            label="Force offline"
            selected={hostOverride?.mode === 'offline'}
            onPress={() => {
              setScreenState(DEMO_SCREEN_ID, { mode: 'offline' });
              setPreview({ type: 'host' });
            }}
          />
          <Chip
            label="Force success.payment"
            selected={hostOverride?.mode === 'success'}
            onPress={() => {
              setScreenState(DEMO_SCREEN_ID, {
                mode: 'success',
                successVariant: 'payment',
              });
              setPreview({ type: 'host' });
            }}
          />
          <Chip
            label="Clear override"
            onPress={() => {
              clearScreenState(DEMO_SCREEN_ID);
              setPreview({ type: 'host' });
            }}
          />
        </Section>

        <Text style={styles.previewLabel} accessibilityRole="header">
          Preview
        </Text>
        <View style={[styles.preview, { height: previewHeight }]} accessibilityLabel="State preview">
          {!preview ? (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.placeholderText}>
                Tap a chip above to preview a Design-folder state.
              </Text>
            </View>
          ) : null}

          {preview?.type === 'loading' ? (
            <LoadingState domain={preview.domain} />
          ) : null}
          {preview?.type === 'empty' ? (
            <EmptyState variant={preview.variant} onAction={() => undefined} />
          ) : null}
          {preview?.type === 'error' ? (
            <ErrorState variant={preview.variant} onRetry={() => undefined} />
          ) : null}
          {preview?.type === 'offline' ? (
            <OfflineState onRetry={() => undefined} />
          ) : null}
          {preview?.type === 'success' ? (
            <SuccessState variant={preview.variant} onAction={() => undefined} />
          ) : null}
          {preview?.type === 'host' ? (
            <ScreenStateHost
              screenId={DEMO_SCREEN_ID}
              status="success"
              onRetry={() => undefined}
              onEmptyAction={() => undefined}
              onSuccessAction={() => undefined}
            >
              <View style={styles.hostContent}>
                <Text style={styles.placeholderText}>
                  Content mode — no Zustand override active.
                </Text>
              </View>
            </ScreenStateHost>
          ) : null}
        </View>
      </ScrollView>

      <LogoutDialog
        visible={dialog === 'logout'}
        onConfirm={() => setDialog(null)}
        onCancel={() => setDialog(null)}
      />
      <CancelSessionDialog
        visible={dialog === 'cancel'}
        onCancelSession={() => setDialog(null)}
        onReschedule={() => setDialog(null)}
        onDismiss={() => setDialog(null)}
      />
      <DiscardChangesDialog
        visible={dialog === 'discard'}
        onConfirm={() => setDialog(null)}
        onCancel={() => setDialog(null)}
      />
      <DeleteAccountDialog
        visible={dialog === 'delete'}
        onConfirm={() => setDialog(null)}
        onCancel={() => setDialog(null)}
      />
      <PermissionRequiredDialog
        visible={dialog === 'permission'}
        onOpenSettings={() => setDialog(null)}
        onCancel={() => setDialog(null)}
      />
      <BiometricSetupDialog
        visible={dialog === 'biometric'}
        onConfirm={() => setDialog(null)}
        onCancel={() => setDialog(null)}
      />
      <SessionExpiredDialog
        visible={dialog === 'session'}
        onSignIn={() => setDialog(null)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: 40,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  previewLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  preview: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xxlarge,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.background,
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  hostContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
