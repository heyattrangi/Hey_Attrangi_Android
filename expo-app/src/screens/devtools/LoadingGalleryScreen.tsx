import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppScreen, AppHeader } from '../../components/app';
import { ShowcaseChip } from '../../components/devtools';
import { LoadingState, LOADING_VARIANTS } from '../../components/ui/states';
import { LoadingDomain } from '../../app/ui-states';
import { MainStackParamList } from '../../navigation/types';
import { Spacing } from '../../app/design-system';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'LoadingGallery'>;
};

const DOMAINS = Object.keys(LOADING_VARIANTS) as LoadingDomain[];

export const LoadingGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const [domain, setDomain] = useState<LoadingDomain>('default');

  return (
    <AppScreen includeBottomInset gradient="topRightWarm">
      <AppHeader
        title="Loading Gallery"
        subtitle="Domain loading canvases"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.chips}>
        {DOMAINS.map((d) => (
          <ShowcaseChip
            key={d}
            label={d}
            selected={d === domain}
            onPress={() => setDomain(d)}
          />
        ))}
      </View>
      <LoadingState domain={domain} />
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
