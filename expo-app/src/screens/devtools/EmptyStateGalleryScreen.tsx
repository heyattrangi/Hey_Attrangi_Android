import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ShowcaseChip } from '../../components/devtools';
import { EmptyState, EMPTY_VARIANTS, EmptyVariant } from '../../components/ui/states';
import { MainStackParamList } from '../../navigation/types';
import { Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<
    MainStackParamList,
    'EmptyStateGallery'
  >;
};

const VARIANTS = Object.keys(EMPTY_VARIANTS) as EmptyVariant[];

export const EmptyStateGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [variant, setVariant] = useState<EmptyVariant>('therapists');

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Empty State Gallery"
        subtitle="Design empty variants"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.chips}>
        {VARIANTS.map((v) => (
          <ShowcaseChip
            key={v}
            label={v}
            selected={v === variant}
            onPress={() => setVariant(v)}
          />
        ))}
      </View>
      <EmptyState variant={variant} />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
});
