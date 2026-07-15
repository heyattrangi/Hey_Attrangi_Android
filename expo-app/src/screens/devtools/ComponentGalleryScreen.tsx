import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader, AppCard } from '../../components/app';
import { DevMenuRow, GallerySection } from '../../components/devtools';
import { useDevToolsStore } from '../../store/devToolsStore';
import { MainStackParamList } from '../../navigation/types';
import { Colors, Typography, Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'ComponentGallery'>;
};

export const ComponentGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const loadSnapshot = useDevToolsStore((s) => s.loadSnapshot);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Component Gallery"
        subtitle="Catalog of building blocks"
        onBack={() => navigation.goBack()}
      />
      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle}>Reusable UI map</Text>
        <Text style={styles.heroBody}>
          Jump into themed galleries. Live Storybook stories live in Component
          Showcase.
        </Text>
      </AppCard>
      <GallerySection title="Design">
        <DevMenuRow
          label="Typography"
          subtitle="Type scale preview"
          onPress={() => navigation.navigate('TypographyPreview')}
        />
        <DevMenuRow
          label="Colors"
          subtitle="Palette swatches"
          onPress={() => navigation.navigate('ColorPalettePreview')}
        />
        <DevMenuRow
          label="Theme playground"
          subtitle="Spacing · radius · surfaces"
          onPress={() => navigation.navigate('ThemePlayground')}
        />
        <DevMenuRow
          label="Motion"
          subtitle="Animation tokens"
          onPress={() => navigation.navigate('AnimationPreview')}
        />
      </GallerySection>
      <GallerySection title="States & dialogs">
        <DevMenuRow
          label="Empty states"
          subtitle="Empty variants"
          onPress={() => navigation.navigate('EmptyStateGallery')}
        />
        <DevMenuRow
          label="Loading"
          subtitle="Loading domains"
          onPress={() => navigation.navigate('LoadingGallery')}
        />
        <DevMenuRow
          label="Dialogs"
          subtitle="Design dialogs"
          onPress={() => navigation.navigate('DialogGallery')}
        />
      </GallerySection>
      <GallerySection title="Stories">
        <DevMenuRow
          label="Component Showcase"
          subtitle="Storybook-style"
          onPress={() => navigation.navigate('ComponentShowcase')}
        />
      </GallerySection>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero: { gap: Spacing.xs, marginBottom: Spacing.lg },
  heroTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  heroBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
