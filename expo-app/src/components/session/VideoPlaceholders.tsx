import React, { memo } from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../app/design-system';
import { Icon } from '../app/Icon';

export interface TherapistVideoPlaceholderProps {
  name: string;
  image?: ImageSourcePropType;
  cameraOff?: boolean;
}

export const TherapistVideoPlaceholder = memo<TherapistVideoPlaceholderProps>(({
  name,
  image,
  cameraOff,
}) => (
  <View style={styles.remote} accessibilityLabel={`Therapist video, ${name}`}>
    {image && !cameraOff ? (
      <Image source={image} style={styles.remoteImage} resizeMode="cover" />
    ) : (
      <View style={styles.remoteFallback}>
        <Icon name="account" size={64} color={Colors.primary} />
        <Text style={styles.remoteName}>{name}</Text>
        {cameraOff ? (
          <Text style={styles.hint}>Camera off</Text>
        ) : (
          <Text style={styles.hint}>Video tile — SDK feed later</Text>
        )}
      </View>
    )}
  </View>
));

TherapistVideoPlaceholder.displayName = 'TherapistVideoPlaceholder';

export interface SelfPreviewProps {
  cameraOff?: boolean;
  facing?: 'user' | 'environment';
  label?: string;
}

export const SelfPreview = memo<SelfPreviewProps>(({
  cameraOff,
  facing = 'user',
  label = 'You',
}) => (
  <View
    style={styles.self}
    accessibilityLabel={`Your camera preview, ${cameraOff ? 'off' : 'on'}`}
  >
    {cameraOff ? (
      <View style={styles.selfOff}>
        <Icon name="video-off" size={22} color={Colors.textWhite} />
      </View>
    ) : (
      <View style={styles.selfOn}>
        <Icon name="account-circle" size={36} color={Colors.primary} />
        <Text style={styles.selfLabel}>{label}</Text>
        <Text style={styles.selfFacing}>
          {facing === 'user' ? 'Front' : 'Rear'}
        </Text>
      </View>
    )}
  </View>
));

SelfPreview.displayName = 'SelfPreview';

const styles = StyleSheet.create({
  remote: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.xlarge,
    overflow: 'hidden',
  },
  remoteImage: { width: '100%', height: '100%' },
  remoteFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  remoteName: {
    ...Typography.heading3,
    color: Colors.textWhite,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  self: {
    width: 112,
    height: 152,
    borderRadius: Radius.large,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#2A2A2A',
  },
  selfOff: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  selfOn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.peachMuted,
  },
  selfLabel: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 4,
  },
  selfFacing: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
});
